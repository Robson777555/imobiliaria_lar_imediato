import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/routers";
import { createContext } from "../../../server/_core/context";

// Handler compatível com Netlify Functions - catch-all para capturar todos os paths
export const handler = async (event: any, context?: any) => {
  const cookies: string[] = [];
  
  // Construir URL completa
  const protocol = (event.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = event.headers?.host || "localhost";
  
  // Pegar o path do parâmetro catch-all
  const pathParam = event.pathParameters?.path || "";
  const requestPath = `/api/trpc/${pathParam}`;
  
  // Tratar query string
  let queryString = "";
  if (event.rawQuery) {
    queryString = `?${event.rawQuery}`;
  } else if (event.queryStringParameters && Object.keys(event.queryStringParameters).length > 0) {
    queryString = "?" + new URLSearchParams(event.queryStringParameters).toString();
  }
  
  const url = `${protocol}://${host}${requestPath}${queryString}`;
  
  console.log("[Netlify Function] Processing request:", {
    path: requestPath,
    method: event.httpMethod,
    url,
    pathParam,
  });
  
  // Criar um objeto Request compatível
  const headers = new Headers();
  Object.entries(event.headers || {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  });

  // Tratar body
  let body: string | undefined = undefined;
  if (event.body && event.httpMethod && !["GET", "HEAD"].includes(event.httpMethod)) {
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, "base64").toString("utf-8");
    } else {
      body = typeof event.body === "string" ? event.body : JSON.stringify(event.body);
    }
  }

  const req = new Request(url, {
    method: event.httpMethod || "GET",
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

  try {
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
    const allCookies: string[] = [...cookies];
    const responseHeaders: Record<string, string | string[]> = {};
    
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        if (value) {
          allCookies.push(value);
        }
      } else {
        responseHeaders[key] = value;
      }
    });

    if (allCookies.length > 0) {
      responseHeaders["Set-Cookie"] = allCookies;
    }

    const body = await response.text();

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body,
    };
  } catch (error: any) {
    console.error("[Netlify Function Error]", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: error?.message || "Unknown error",
      }),
    };
  }
};

