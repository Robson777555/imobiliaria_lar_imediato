import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Handler para Netlify Functions - SOLUÇÃO DEFINITIVA
export const handler = async (event: any) => {
  // Se a função está sendo chamada, sempre retornar JSON válido
  // Isso garante que nunca retornaremos HTML por engano
  try {
    const cookies: string[] = [];
    
    const protocol = (event.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = event.headers?.host || "localhost";
  
  // ESTRATÉGIA DEFINITIVA: O Netlify preserva o path original no rawPath
  // Mesmo após redirect, rawPath contém o path original da requisição
  let requestPath = "";
  
  // PRIORIDADE 1: rawPath - sempre contém o path original antes do redirect
  if (event.rawPath && event.rawPath.startsWith("/api/trpc")) {
    requestPath = event.rawPath;
  } 
  // PRIORIDADE 2: path - pode conter o path original
  else if (event.path && event.path.startsWith("/api/trpc")) {
    requestPath = event.path;
  }
  // PRIORIDADE 3: query parameter (passado pelo redirect)
  else if (event.queryStringParameters?.path) {
    requestPath = `/api/trpc/${event.queryStringParameters.path}`;
  }
  // PRIORIDADE 4: pathParameters (catch-all)
  else if (event.pathParameters) {
    const proxy = event.pathParameters.proxy || event.pathParameters["*"] || "";
    requestPath = proxy ? `/api/trpc/${proxy}` : "/api/trpc";
  }
  // PRIORIDADE 5: reconstruir do rawPath se contém função
  else if (event.rawPath && event.rawPath.includes("/.netlify/functions/trpc")) {
    const match = event.rawPath.match(/\/\.netlify\/functions\/trpc\/?(.*)/);
    requestPath = match && match[1] ? `/api/trpc/${match[1]}` : "/api/trpc";
  }
  // FALLBACK: header x-original-url
  else if (event.headers?.["x-original-url"]) {
    try {
      const originalUrl = event.headers["x-original-url"];
      const url = new URL(originalUrl.startsWith("http") ? originalUrl : `${protocol}://${host}${originalUrl}`);
      requestPath = url.pathname.startsWith("/api/trpc") ? url.pathname : "/api/trpc";
    } catch {
      requestPath = "/api/trpc";
    }
  }
  // ÚLTIMO RECURSO
  else {
    requestPath = "/api/trpc";
  }
  
  // Garantir que sempre começa com /api/trpc
  if (!requestPath.startsWith("/api/trpc")) {
    requestPath = "/api/trpc";
  }
  
  // Query string
  let queryString = "";
  if (event.rawQuery) {
    queryString = `?${event.rawQuery}`;
  } else if (event.queryStringParameters) {
    const params = new URLSearchParams();
    Object.entries(event.queryStringParameters).forEach(([key, value]) => {
      if (key !== "path" && value) params.append(key, String(value));
    });
    if (params.toString()) queryString = `?${params.toString()}`;
  }
  
  const url = `${protocol}://${host}${requestPath}${queryString}`;
  
  // Headers
  const headers = new Headers();
  Object.entries(event.headers || {}).forEach(([key, value]) => {
    if (["host", "connection"].includes(key.toLowerCase())) return;
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  });

  // Body
  let body: string | undefined = undefined;
  const method = event.httpMethod || "GET";
  if (event.body && !["GET", "HEAD"].includes(method)) {
    body = event.isBase64Encoded 
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : (typeof event.body === "string" ? event.body : JSON.stringify(event.body));
  }

  const req = new Request(url, { method, headers, body });

  // Context Express-like
  const expressContext = {
    req: {
      headers: event.headers || {},
      hostname: host.split(":")[0],
      protocol,
      get: (name: string) => {
        const lower = name.toLowerCase();
        const headers = event.headers || {};
        const key = Object.keys(headers).find(k => k.toLowerCase() === lower);
        return key ? (headers as any)[key] : undefined;
      },
      cookie: event.headers?.cookie || "",
    } as any,
    res: {
      cookie: (name: string, value: string, options?: any) => {
        const parts = [
          `${name}=${value}`,
          options?.path ? `Path=${options.path}` : "Path=/",
          options?.httpOnly ? "HttpOnly" : "",
          options?.secure ? "Secure" : "",
          options?.sameSite ? `SameSite=${options.sameSite}` : "",
        ];
        if (options?.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
        cookies.push(parts.filter(Boolean).join("; "));
      },
      clearCookie: (name: string, options?: any) => {
        cookies.push(`${name}=; Path=${options?.path || "/"}; Max-Age=0`);
      },
    } as any,
  };

  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async () => createContext(expressContext),
      onError: ({ error, path, type }) => {
        console.error(`[tRPC] ${type} ${path}:`, error);
      },
    });

    const responseHeaders: Record<string, string | string[]> = {};
    const allCookies: string[] = [...cookies];
    
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === "set-cookie") {
        allCookies.push(value);
      } else if (lower !== "content-encoding") {
        responseHeaders[key] = value;
      }
    });

    if (allCookies.length > 0) {
      responseHeaders["Set-Cookie"] = allCookies;
    }

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text(),
    };
  } catch (error: any) {
    console.error("[Netlify Function]", error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ 
        error: "Internal error", 
        message: error?.message || String(error),
        type: "TRPC_ERROR"
      }),
    };
  } catch (outerError: any) {
    // Se houver qualquer erro no handler, sempre retornar JSON
    console.error("[Netlify Function Handler Error]", outerError);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ 
        error: "Function error", 
        message: outerError?.message || String(outerError),
        type: "TRPC_ERROR"
      }),
    };
  }
};

