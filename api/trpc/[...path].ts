import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { sdk } from "../../server/_core/sdk";

export default async function handler(req: any, res: any) {
  try {
    // Get the original URL path
    const pathArray = req.query.path;
    const trpcPath = Array.isArray(pathArray) 
      ? pathArray.join("/")
      : pathArray || "";
    
    // Build the full URL
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "";
    const queryString = new URLSearchParams(
      Object.entries(req.query || {}).reduce((acc, [key, value]) => {
        if (key !== "path" && value) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `${protocol}://${host}/api/trpc/${trpcPath}${queryString ? `?${queryString}` : ""}`;

    // Get request body
    let body: string | undefined;
    if (req.body && req.method !== "GET" && req.method !== "HEAD") {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    // Create Fetch Request
    const fetchReq = new Request(url, {
      method: req.method || "GET",
      headers: new Headers(req.headers as Record<string, string>),
      body,
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
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: fetchReq,
      router: appRouter,
      createContext: async () => {
        // Use the Express-like context with sdk
        let user = null;
        try {
          user = await sdk.authenticateRequest(expressReq as any);
        } catch {
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

    // Set response headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "set-cookie") {
        res.setHeader(key, value);
      }
    });

    // Add cookies if any
    if (cookies.length > 0) {
      res.setHeader("Set-Cookie", cookies);
    }

    // Send response
    const responseBody = await response.text();
    res.status(response.status).send(responseBody);
  } catch (error: any) {
    console.error("[tRPC Handler Error]:", error);
    console.error("[tRPC Handler Error Stack]:", error?.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message: error?.message || String(error),
    });
  }
}

