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

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files in production
if (process.env.NODE_ENV !== "development") {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // fall through to index.html if the file doesn't exist (SPA routing)
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    console.error(`Build directory not found: ${distPath}`);
    app.use("*", (_req, res) => {
      res.status(500).send("Build directory not found. Please run 'npm run build' first.");
    });
  }
}

// Export for Vercel serverless function
export default app;

