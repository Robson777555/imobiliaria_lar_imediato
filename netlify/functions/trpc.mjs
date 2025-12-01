// Versão .mjs para garantir que funcione como ESM
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export const handler = async (event) => {
  console.log("[TRPC MJS] Handler chamado!");
  
  try {
    const protocol = event.headers?.["x-forwarded-proto"] || "https";
    const host = event.headers?.host || "localhost";
    
    let requestPath = event.rawPath || event.path || "";
    if (!requestPath.startsWith("/api/trpc")) {
      const pathParam = event.queryStringParameters?.path || "";
      requestPath = pathParam ? `/api/trpc/${pathParam}` : "/api/trpc";
    }
    
    const url = `${protocol}://${host}${requestPath}${event.rawQuery ? `?${event.rawQuery}` : ""}`;
    
    const req = new Request(url, {
      method: event.httpMethod || "GET",
      headers: new Headers(event.headers || {}),
      body: event.body,
    });

    const expressContext = {
      req: {
        headers: event.headers || {},
        hostname: host.split(":")[0],
        protocol: protocol,
        get: (name) => event.headers?.[name.toLowerCase()] || undefined,
        cookie: event.headers?.cookie || "",
      },
      res: {
        cookie: () => {},
        clearCookie: () => {},
      },
    };

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async () => createContext(expressContext),
    });

    const body = await response.text();
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      statusCode: response.status,
      headers,
      body,
    };
  } catch (error) {
    console.error("[TRPC MJS] Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

