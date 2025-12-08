import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { createUserWithPassword } from "./auth";
import * as db from "../db";
import crypto from "crypto";
import { parse } from "cookie";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Garantir que o usuário padrão existe
  try {
    const existingUser = await db.getUserByUsername("@userCliente96");
    if (!existingUser) {
      await createUserWithPassword("@userCliente96", "@passwordCliente96", {
        name: "Cliente 96",
        role: "admin",
      });
      console.log("Usuário padrão criado: @userCliente96");
    }
  } catch (error: any) {
    if (error.message !== "Usuário já existe") {
      console.error("Erro ao inicializar usuário padrão:", error);
    }
  }

  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
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
        
        res.cookie("auth_token", token, {
          path: "/",
          maxAge: 86400 * 1000,
          httpOnly: true,
          sameSite: "lax",
        });
        
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
        message: "Erro ao processar login",
      });
    }
  });

  app.get("/api/auth/check", (req, res) => {
    try {
      const cookieHeader = req.headers.cookie || "";
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
      return res.status(401).json({
        authenticated: false,
      });
    }
  });

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
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
