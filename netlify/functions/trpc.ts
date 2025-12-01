import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Handler compatível com Netlify Functions v1 e v2
export const handler = async (event: any, context?: any) => {
  const cookies: string[] = [];
  
  // Construir URL completa - compatível com v1 e v2
  const protocol = (event.headers?.["x-forwarded-proto"] || event.headers?.["x-forwarded-protocol"] || "https").split(",")[0].trim();
  const host = event.headers?.host || event.headers?.["x-forwarded-host"] || "localhost";
  
  // Tratar diferentes formatos de path do Netlify (v1 usa path, v2 usa rawPath)
  let requestPath = event.rawPath || event.path || "";
  
  // Remover o prefixo da função Netlify se presente
  if (requestPath.includes("/.netlify/functions/trpc")) {
    requestPath = requestPath.replace("/.netlify/functions/trpc", "");
  }
  
  // Garantir que o path comece com /api/trpc
  if (!requestPath.startsWith("/api/trpc")) {
    requestPath = `/api/trpc${requestPath}`;
  }
  
  // Tratar query string - v1 usa queryStringParameters, v2 pode usar rawQuery
  let queryString = "";
  if (event.rawQuery) {
    queryString = `?${event.rawQuery}`;
  } else if (event.queryStringParameters && Object.keys(event.queryStringParameters).length > 0) {
    queryString = "?" + new URLSearchParams(event.queryStringParameters).toString();
  }
  
  const url = `${protocol}://${host}${requestPath}${queryString}`;
  
  // Criar um objeto Request compatível
  const headers = new Headers();
  Object.entries(event.headers || {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  });

  // Tratar body - pode ser string ou base64 no Netlify
  let body: string | undefined = undefined;
  if (event.body && event.httpMethod && !["GET", "HEAD"].includes(event.httpMethod)) {
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, "base64").toString("utf-8");
    } else {
      body = typeof event.body === "string" ? event.body : JSON.stringify(event.body);
    }
  }

  const req = new Request(url, {
    method: event.httpMethod || event.requestContext?.http?.method || "GET",
    headers,
    body,
  });

  // Criar um contexto Express-like para o createContext
  const expressContext = {
    req: {
      headers: event.headers || {},
      hostname: host.split(":")[0],
      protocol: protocol,
      get: (name: string) => {
        const headerName = name.toLowerCase();
        const headers = event.headers || {};
        // Buscar por nome exato ou case-insensitive
        return headers[headerName] || headers[Object.keys(headers).find(k => k.toLowerCase() === headerName) || ""] || undefined;
      },
      cookie: event.headers?.cookie || "",
    } as any,
    res: {
      cookie: (name: string, value: string, options?: any) => {
        const cookieOptions = [
          `${name}=${value}`,
          options?.path ? `Path=${options.path}` : "Path=/",
          options?.httpOnly ? "HttpOnly" : "",
          options?.secure ? "Secure" : "",
          options?.sameSite ? `SameSite=${options.sameSite}` : "",
          options?.maxAge ? `Max-Age=${Math.floor(options.maxAge / 1000)}` : "",
        ].filter(Boolean).join("; ");
        
        cookies.push(cookieOptions);
      },
      clearCookie: (name: string, options?: any) => {
        const cookieOptions = [
          `${name}=`,
          options?.path ? `Path=${options.path}` : "Path=/",
          "Max-Age=0",
        ].filter(Boolean).join("; ");
        
        cookies.push(cookieOptions);
      },
    } as any,
  };

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      return await createContext(expressContext);
    },
    onError: (opts) => {
      console.error("[tRPC Error]", opts.error);
    },
  });

  // Adicionar cookies ao response
  // Netlify Functions espera Set-Cookie como array ou string separada por vírgula
  const allCookies: string[] = [...cookies];
  const responseHeaders: Record<string, string | string[]> = {};
  
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      // Adicionar cookies do tRPC response
      if (value) {
        allCookies.push(value);
      }
    } else {
      responseHeaders[key] = value;
    }
  });

  // Adicionar todos os cookies ao response
  // Netlify aceita tanto array quanto string
  if (allCookies.length > 0) {
    // Usar array para múltiplos cookies (mais correto segundo HTTP spec)
    responseHeaders["Set-Cookie"] = allCookies;
  }

  const body = await response.text();

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body,
  };
};

