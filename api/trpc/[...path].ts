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

// Error handling middleware (deve vir antes do tRPC)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Express Error]:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// tRPC middleware
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path, type }) => {
      console.error(`[tRPC Error] ${type} ${path}:`, error);
      console.error(`[tRPC Error] Stack:`, error.stack);
    },
  })
);

// Export for Vercel serverless function
export default app;
