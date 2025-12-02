import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { sdk } from "../../server/_core/sdk";

// Wrapper para garantir que sempre retorna JSON
export default async function handler(req: any, res: any) {
  // Garantir Content-Type JSON desde o início
  if (!res.headersSent) {
    res.setHeader("Content-Type", "application/json");
  }
  
  console.log("[tRPC Handler] ===== INICIADO =====");
  console.log("[tRPC Handler] Method:", req.method || req.httpMethod);
  console.log("[tRPC Handler] Query:", JSON.stringify(req.query));
  console.log("[tRPC Handler] URL:", req.url);
  
  try {
    // Get the original URL path from Vercel's catch-all route
    const pathArray = req.query.path || [];
    const trpcPath = Array.isArray(pathArray) 
      ? pathArray.join("/")
      : pathArray || "";
    
    console.log("[tRPC Handler] Path array:", pathArray);
    console.log("[tRPC Handler] tRPC path:", trpcPath);
    
    // Build the full URL for the request
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "";
    
    // Get all query params except 'path'
    const queryParams = new URLSearchParams();
    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (key !== "path" && value) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${protocol}://${host}/api/trpc/${trpcPath}${queryString ? `?${queryString}` : ""}`;
    
    console.log("[tRPC Handler] Final URL:", url);

    // Get request body
    let body: string | undefined;
    if (req.body && method !== "GET" && method !== "HEAD") {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      console.log("[tRPC Handler] Body length:", body?.length);
    }

    // Create Fetch Request
    const fetchReq = new Request(url, {
      method: method,
      headers: new Headers(req.headers as Record<string, string>),
      body,
    });
    
    console.log("[tRPC Handler] Fetch Request criado:", {
      method: fetchReq.method,
      url: fetchReq.url,
      hasBody: !!body,
    });

    // Handle cookies in response
    const cookies: string[] = [];

    // Create Express-like context for createContext
    const expressReq = {
      headers: req.headers || {},
      hostname: host.split(":")[0],
      protocol,
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
    };

    // Call tRPC handler
    console.log("[tRPC Handler] Chamando fetchRequestHandler...");
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: fetchReq,
      router: appRouter,
      createContext: async () => {
        // Use the Express-like context with sdk
        let user = null;
        try {
          user = await sdk.authenticateRequest(expressReq as any);
        } catch (err) {
          console.log("[tRPC Handler] Auth error (expected for login):", err);
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

    console.log("[tRPC Handler] Response status:", response.status);
    console.log("[tRPC Handler] Response headers:", Object.fromEntries(response.headers.entries()));

    // Set response headers - IMPORTANT: Set Content-Type first
    res.setHeader("Content-Type", "application/json");
    
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "set-cookie" && lowerKey !== "content-type") {
        res.setHeader(key, value);
      }
    });

    // Add cookies if any
    if (cookies.length > 0) {
      res.setHeader("Set-Cookie", cookies);
      console.log("[tRPC Handler] Cookies set:", cookies);
    }

    // Send response
    const responseBody = await response.text();
    console.log("[tRPC Handler] Response body length:", responseBody.length);
    console.log("[tRPC Handler] Response preview:", responseBody.substring(0, 200));
    
    res.status(response.status).send(responseBody);
  } catch (error: any) {
    console.error("[tRPC Handler Error]:", error);
    console.error("[tRPC Handler Error Stack]:", error?.stack);
    console.error("[tRPC Handler Error Name]:", error?.name);
    console.error("[tRPC Handler Error Message]:", error?.message);
    
    // SEMPRE retornar JSON, nunca HTML ou texto
    try {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json");
      }
      
      const errorResponse = {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "An internal server error occurred",
          data: {
            code: "INTERNAL_SERVER_ERROR",
            httpStatus: 500,
            path: req.query?.path || "unknown",
            stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
          },
        },
      };
      
      res.status(500).json(errorResponse);
    } catch (jsonError: any) {
      // Se até isso falhar, pelo menos tentar enviar texto como último recurso
      console.error("[tRPC Handler] Erro ao enviar JSON:", jsonError);
      if (!res.headersSent) {
        res.status(500).send(JSON.stringify({
          error: "Failed to serialize error response",
        }));
      }
    }
  }
}

