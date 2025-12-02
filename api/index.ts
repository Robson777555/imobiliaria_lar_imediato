import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import path from "path";
import fs from "fs";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Express Error]:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// OAuth callback under /api/oauth/callback
try {
  registerOAuthRoutes(app);
} catch (error) {
  console.error("[OAuth Routes Error]:", error);
}

// tRPC API
try {
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error, path, type }) => {
        console.error(`[tRPC Error] ${type} ${path}:`, error);
      },
    })
  );
} catch (error) {
  console.error("[tRPC Middleware Error]:", error);
}

// In Vercel, static files are served automatically
// Only serve static files if NOT in Vercel environment
if (!process.env.VERCEL && process.env.NODE_ENV !== "development") {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath, { index: false }));
    
    // fall through to index.html if the file doesn't exist (SPA routing)
    app.use("*", (req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Not found");
      }
    });
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export for Vercel serverless function
export default app;

