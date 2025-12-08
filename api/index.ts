import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import path from "path";
import fs from "fs";
import { parse } from "cookie";
import crypto from "crypto";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware to fix path for Vercel rewrites
app.use((req, res, next) => {
  const originalUrlHeader = req.headers['x-vercel-original-path'] || req.headers['x-rewrite-path'];
  const originalUrl = typeof originalUrlHeader === 'string' ? originalUrlHeader : (req.originalUrl || req.url);
  
  if (originalUrl && typeof originalUrl === 'string' && originalUrl.startsWith('/api/trpc') && !req.path.startsWith('/api/trpc')) {
    req.url = originalUrl;
  }
  
  next();
});

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

// tRPC API - handle both /api/trpc and root path (for Vercel rewrites)
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

// Also handle root path for Vercel rewrites
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path, type }) => {
      console.error(`[tRPC Error] ${type} ${path}:`, error);
    },
  })
);

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

const VALID_USERNAME = "@userCliente96";
const VALID_PASSWORD = "@passwordCliente96";
const SECRET_KEY = process.env.SESSION_SECRET || "default-secret-key-change-in-production";

function createSessionToken(username: string): string {
  const timestamp = Date.now().toString();
  const message = `${username}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("hex");
  return `${message}:${signature}`;
}

function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) {
      return false;
    }
    const [username, timestamp, signature] = parts;
    
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    if (now - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    const message = `${username}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(message)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

app.use("/api/auth", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuário e senha são obrigatórios",
      });
    }

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const token = createSessionToken(username);
      
      const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
      const cookieOptions: any = {
        path: "/",
        maxAge: 86400 * 1000,
        httpOnly: true,
        sameSite: "lax" as const,
      };
      
      if (isProduction) {
        cookieOptions.secure = true;
      }
      
      res.cookie("auth_token", token, cookieOptions);
      
      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }
  } catch (error: any) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Erro ao processar login",
    });
  }
});

app.get("/api/auth/check", (req, res) => {
  try {
    const cookieHeader = req.headers.cookie || "";
    if (!cookieHeader) {
      return res.status(401).json({
        authenticated: false,
      });
    }
    
    const cookies = parse(cookieHeader);
    const token = cookies.auth_token || "";

    if (token && verifySessionToken(token)) {
      return res.status(200).json({
        authenticated: true,
        username: VALID_USERNAME,
      });
    } else {
      return res.status(401).json({
        authenticated: false,
      });
    }
  } catch (error: any) {
    console.error("Error in check:", error);
    return res.status(500).json({
      authenticated: false,
      error: error.message || "Erro ao verificar autenticação",
    });
  }
});

// Export for Vercel serverless function
export default app;

