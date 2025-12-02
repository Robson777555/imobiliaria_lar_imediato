// Using any types for Vercel request/response to avoid dependency issues
type VercelRequest = any;
type VercelResponse = any;
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the full URL
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const path = req.url || `/api/trpc${req.query.path || ""}`;
  const query = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${protocol}://${host}${path}${query ? `?${query}` : ""}`;

  // Create a Fetch API Request
  const fetchReq = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });

  // Create Express-like context for tRPC
  const expressContext = {
    req: {
      headers: req.headers,
      hostname: host?.split(":")[0] || "localhost",
      protocol: protocol,
      get: (name: string) => {
        const lower = name.toLowerCase();
        const headers = req.headers || {};
        const key = Object.keys(headers).find((k) => k.toLowerCase() === lower);
        return key ? (headers as any)[key] : undefined;
      },
      cookie: req.headers.cookie || "",
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
        res.setHeader("Set-Cookie", parts.filter(Boolean).join("; "));
      },
      clearCookie: (name: string, options?: any) => {
        res.setHeader("Set-Cookie", `${name}=; Path=${options?.path || "/"}; Max-Age=0`);
      },
    } as any,
  };

  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: fetchReq,
      router: appRouter,
      createContext: async () => createContext(expressContext),
      onError: ({ error, path, type }) => {
        console.error(`[tRPC Error] ${type} ${path}:`, error);
      },
    });

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (error: any) {
    console.error("[tRPC Handler Error]:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error?.message || String(error),
    });
  }
}

