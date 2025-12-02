import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { sdk } from "../../server/_core/sdk";

export default async function handler(req: any, res: any) {
  // SEMPRE definir Content-Type JSON primeiro
  res.setHeader("Content-Type", "application/json");
  
  try {
    console.log("[tRPC] Handler chamado");
    console.log("[tRPC] Method:", req.method || req.httpMethod);
    console.log("[tRPC] URL:", req.url);
    console.log("[tRPC] Query:", JSON.stringify(req.query));
    
    // Obter path do catch-all route
    const pathArray = req.query?.path || [];
    const trpcPath = Array.isArray(pathArray) 
      ? pathArray.join("/")
      : String(pathArray || "");
    
    console.log("[tRPC] Path:", trpcPath);
    
    // Construir URL completa
    const protocol = (req.headers?.["x-forwarded-proto"] || "https").toString().split(",")[0].trim();
    const host = req.headers?.host || "";
    
    // Query string (sem o path)
    const queryParams = new URLSearchParams();
    if (req.query) {
      Object.entries(req.query).forEach(([key, value]) => {
        if (key !== "path" && value) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const fullUrl = `${protocol}://${host}/api/trpc/${trpcPath}${queryString ? `?${queryString}` : ""}`;
    
    console.log("[tRPC] Full URL:", fullUrl);
    
    // Preparar body
    let body: string | undefined;
    const method = (req.method || req.httpMethod || "GET").toUpperCase();
    
    if (req.body && method !== "GET" && method !== "HEAD") {
      if (typeof req.body === "string") {
        body = req.body;
      } else if (req.body) {
        body = JSON.stringify(req.body);
      }
    }
    
    console.log("[tRPC] Body length:", body?.length || 0);
    
    // Criar Fetch Request
    const fetchReq = new Request(fullUrl, {
      method: method,
      headers: new Headers((req.headers || {}) as Record<string, string>),
      body: body,
    });
    
    // Context para cookies
    const cookies: string[] = [];
    
    // Criar contexto Express-like
    const expressReq = {
      headers: req.headers || {},
      hostname: host.split(":")[0],
      protocol: protocol,
      get: (name: string) => {
        const lower = name.toLowerCase();
        const headers = req.headers || {};
        const key = Object.keys(headers).find((k) => k.toLowerCase() === lower);
        return key ? (headers as any)[key] : undefined;
      },
      cookie: req.headers?.cookie || "",
    };
    
    const expressRes = {
      cookie: (name: string, value: string, options?: any) => {
        const parts = [`${name}=${value}`];
        if (options?.path) parts.push(`Path=${options.path}`);
        if (options?.httpOnly) parts.push("HttpOnly");
        if (options?.secure) parts.push("Secure");
        if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
        if (options?.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
        cookies.push(parts.join("; "));
      },
      clearCookie: (name: string, options?: any) => {
        cookies.push(`${name}=; Path=${options?.path || "/"}; Max-Age=0`);
      },
    };
    
    console.log("[tRPC] Chamando fetchRequestHandler...");
    
    // Chamar tRPC handler
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: fetchReq,
      router: appRouter,
      createContext: async () => {
        let user = null;
        try {
          user = await sdk.authenticateRequest(expressReq as any);
        } catch (err: any) {
          console.log("[tRPC] Auth error (normal para login):", err?.message);
          user = null;
        }
        
        return {
          req: expressReq,
          res: expressRes,
          user,
        };
      },
      onError: ({ error, path, type }) => {
        console.error(`[tRPC Error] ${type} ${path}:`, error);
      },
    });
    
    console.log("[tRPC] Response status:", response.status);
    
    // Definir headers da resposta
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "set-cookie" && lowerKey !== "content-encoding") {
        responseHeaders[key] = value;
      }
    });
    
    // Adicionar cookies
    if (cookies.length > 0) {
      responseHeaders["Set-Cookie"] = cookies;
    }
    
    // Aplicar headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Garantir Content-Type JSON
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    
    // Obter body da resposta
    const responseBody = await response.text();
    
    console.log("[tRPC] Response body length:", responseBody.length);
    console.log("[tRPC] Success!");
    
    // Enviar resposta
    res.status(response.status || 200).send(responseBody);
    
  } catch (error: any) {
    console.error("[tRPC] ERROR CATCH:", error);
    console.error("[tRPC] ERROR Stack:", error?.stack);
    console.error("[tRPC] ERROR Name:", error?.name);
    console.error("[tRPC] ERROR Message:", error?.message);
    
    // SEMPRE retornar JSON, nunca texto ou HTML
    try {
      const errorJson = {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Internal server error",
          data: {
            code: "INTERNAL_SERVER_ERROR",
            httpStatus: 500,
            stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
          },
        },
      };
      
      res.setHeader("Content-Type", "application/json");
      res.status(500).json(errorJson);
    } catch (jsonError: any) {
      console.error("[tRPC] Erro ao serializar erro:", jsonError);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send(JSON.stringify({ error: "Failed to serialize error" }));
    }
  }
}
