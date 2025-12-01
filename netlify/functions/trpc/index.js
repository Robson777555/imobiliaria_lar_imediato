// Função em formato CommonJS para garantir compatibilidade máxima
exports.handler = async function(event, context) {
  console.log("[TRPC INDEX.JS] Handler iniciado");
  
  try {
    // Importar dinamicamente (ESM)
    const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
    const { appRouter } = await import("../../../server/routers.js");
    const { createContext } = await import("../../../server/_core/context.js");
    
    const protocol = (event.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = event.headers?.host || "localhost";
    const pathParam = event.queryStringParameters?.path || "";
    const requestPath = pathParam ? `/api/trpc/${pathParam}` : "/api/trpc";
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
    console.error("[TRPC INDEX.JS] Erro:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Function error",
        message: error.message,
        type: "TRPC_FUNCTION_ERROR"
      }),
    };
  }
};

