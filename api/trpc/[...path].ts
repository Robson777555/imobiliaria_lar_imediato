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
