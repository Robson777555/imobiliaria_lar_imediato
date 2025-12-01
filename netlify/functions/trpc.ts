import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export const handler = async (event: any) => {
  const cookies: string[] = [];
  
  // Pegar informações do evento
  const protocol = (event.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = event.headers?.host || "localhost";
  
  // Obter o path original da requisição
  // O Netlify sempre passa o rawPath com o path completo da requisição original
  let requestPath = "";
  
  // O rawPath contém o path completo da requisição original (ex: /api/trpc/auth.login)
  // Mesmo que o redirect seja feito, o rawPath mantém o path original
  if (event.rawPath) {
    // rawPath já contém o path original antes do redirect
    requestPath = event.rawPath;
  } else if (event.path) {
    // Fallback para v1
    requestPath = event.path;
  }
  
  // Se o path contém o prefixo da função, é porque não foi redirecionado corretamente
  // Nesse caso, tentar reconstruir do pathParameters ou query
  if (requestPath.includes("/.netlify/functions/trpc")) {
    const pathParams = event.pathParameters || {};
    const splat = pathParams.proxy || pathParams["*"] || pathParams.splat || event.queryStringParameters?.path || "";
    if (splat) {
      requestPath = `/api/trpc/${splat}`;
    } else {
      // Extrair o que vem depois de /.netlify/functions/trpc
      const match = requestPath.match(/\/\.netlify\/functions\/trpc\/(.*)/);
      if (match && match[1]) {
        requestPath = `/api/trpc/${match[1]}`;
      } else {
        requestPath = "/api/trpc";
      }
    }
  }
  
  // Garantir que começa com /api/trpc
  if (!requestPath || !requestPath.startsWith("/api/trpc")) {
    requestPath = "/api/trpc";
  }
  
  // Tratar query string
  let queryString = "";
  if (event.rawQuery) {
    queryString = `?${event.rawQuery}`;
  } else if (event.queryStringParameters) {
    const params = new URLSearchParams();
    Object.entries(event.queryStringParameters || {}).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    if (params.toString()) {
      queryString = `?${params.toString()}`;
    }
  }
  
  const url = `${protocol}://${host}${requestPath}${queryString}`;
  
  // Criar headers
  const headers = new Headers();
  Object.entries(event.headers || {}).forEach(([key, value]) => {
    // Ignorar headers que podem causar problemas
    if (key.toLowerCase() === "host" || key.toLowerCase() === "connection") {
      return;
    }
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  });

  // Tratar body
  let body: string | undefined = undefined;
  const method = event.httpMethod || event.requestContext?.http?.method || "GET";
  if (event.body && !["GET", "HEAD"].includes(method)) {
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, "base64").toString("utf-8");
    } else {
      body = typeof event.body === "string" ? event.body : JSON.stringify(event.body);
    }
  }

  const req = new Request(url, {
    method,
    headers,
    body,
  });

  // Criar contexto Express-like
  const expressContext = {
    req: {
      headers: event.headers || {},
      hostname: host.split(":")[0],
      protocol: protocol,
      get: (name: string) => {
        const headerName = name.toLowerCase();
        const headers = event.headers || {};
        const key = Object.keys(headers).find(k => k.toLowerCase() === headerName);
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
        if (options?.maxAge) {
          parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
        }
        cookies.push(parts.filter(Boolean).join("; "));
      },
      clearCookie: (name: string, options?: any) => {
        cookies.push(
          `${name}=; Path=${options?.path || "/"}; Max-Age=0`
        );
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
        console.error(`[tRPC Error] ${type} ${path}:`, error);
      },
    });

    // Processar headers do response
    const responseHeaders: Record<string, string | string[]> = {};
    const allCookies: string[] = [...cookies];
    
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "set-cookie") {
        allCookies.push(value);
      } else if (lowerKey !== "content-encoding") {
        responseHeaders[key] = value;
      }
    });

    if (allCookies.length > 0) {
      responseHeaders["Set-Cookie"] = allCookies;
    }

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: responseBody,
    };
  } catch (error: any) {
    console.error("[Netlify Function Error]", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: error?.message || String(error),
      }),
    };
  }
};

