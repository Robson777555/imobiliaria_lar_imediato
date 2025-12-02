import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import express from "express";

// Validar variáveis de ambiente essenciais
if (!process.env.JWT_SECRET) {
  console.error("[ERROR] JWT_SECRET não está configurado! Configure esta variável na Vercel.");
}

const app = express();

// Trust proxy - CRITICAL for Vercel/Netlify to correctly detect HTTPS
// This allows Express to trust the X-Forwarded-* headers from the proxy
app.set('trust proxy', true);

// CORS Configuration - CRITICAL for production
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
  ].filter(Boolean);

  // Allow requests from any origin in development, or from allowed origins in production
  if (process.env.NODE_ENV === "development" || !origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[tRPC] ${req.method} ${req.url}`);
  next();
});

// tRPC middleware - usar root path pois já estamos em /api/trpc/*
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path, type }) => {
      console.error(`[tRPC Error] ${type} ${path}:`, error);
      if (error.stack) {
        console.error(`[tRPC Error] Stack:`, error.stack);
      }
    },
  })
);

// Error handling middleware (deve vir DEPOIS das rotas)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Express Error]:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
});

// Export for Vercel serverless function
export default app;
