import "dotenv/config";
import express from "express";
import { parse } from "cookie";
import crypto from "crypto";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware de logging para todas as requisições
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Auth routes - PRIMEIRO, antes de qualquer outra coisa
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
  console.log("[LOGIN] ========== LOGIN REQUEST START ==========");
  console.log("[LOGIN] Method:", req.method);
  console.log("[LOGIN] Path:", req.path);

  try {
    console.log("[LOGIN] Request received");
    console.log("[LOGIN] Body:", JSON.stringify(req.body));
    const { username, password } = req.body;
    console.log("[LOGIN] Username:", username ? "provided" : "missing");

    if (!username || !password) {
      console.log("[LOGIN] Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Usuário e senha são obrigatórios",
      });
    }

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      console.log("[LOGIN] Credentials valid, creating token");
      const token = createSessionToken(username);
      console.log("[LOGIN] Token created:", token ? "yes" : "no");

      const isProduction = !!(process.env.NODE_ENV === "production" || process.env.VERCEL);
      const maxAge = 86400 * 1000; // 24 horas em milissegundos

      res.cookie("auth_token", token, {
        path: "/",
        maxAge: maxAge,
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
      });

      console.log("[LOGIN] Cookie set, returning success");
      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
      });
    } else {
      console.log("[LOGIN] Invalid credentials");
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }
  } catch (error: any) {
    console.error("[LOGIN] Error:", error);
    console.error("[LOGIN] Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || "Erro ao processar login",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.get("/api/auth/check", (req, res) => {
  console.log("[CHECK] ========== CHECK REQUEST START ==========");
  try {
    console.log("[CHECK] Request received");
    const cookieHeader = req.headers.cookie || "";
    console.log("[CHECK] Cookie header:", cookieHeader ? "present" : "missing");

    if (!cookieHeader) {
      console.log("[CHECK] No cookies, returning unauthenticated");
      return res.status(401).json({
        authenticated: false,
      });
    }

    const cookies = parse(cookieHeader);
    const token = cookies.auth_token || "";
    console.log("[CHECK] Token found:", token ? "yes" : "no");

    if (token && verifySessionToken(token)) {
      console.log("[CHECK] Token valid, authenticated");
      return res.status(200).json({
        authenticated: true,
        username: VALID_USERNAME,
      });
    } else {
      console.log("[CHECK] Token invalid or missing");
      return res.status(401).json({
        authenticated: false,
      });
    }
  } catch (error: any) {
    console.error("[CHECK] Error:", error);
    console.error("[CHECK] Error stack:", error.stack);
    return res.status(500).json({
      authenticated: false,
      error: error.message || "Erro ao verificar autenticação",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Importar e configurar outras rotas (tRPC, OAuth) DEPOIS das rotas de auth
// Usar importações dinâmicas para não quebrar se os módulos não estiverem disponíveis
let trpcConfigured = false;
let oauthConfigured = false;

// Configurar tRPC de forma lazy - não bloquear inicialização
setTimeout(async () => {
  try {
    const { createExpressMiddleware } = await import("@trpc/server/adapters/express");
    const { appRouter } = await import("../server/routers");
    const { createContext } = await import("../server/_core/context");

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
    trpcConfigured = true;
    console.log("[INIT] tRPC configured");
  } catch (error: any) {
    console.warn("[INIT] tRPC not available:", error?.message || "Module not found");
    // Não falhar se tRPC não estiver disponível - rotas de auth devem funcionar
  }
}, 0);

// Configurar OAuth de forma lazy - não bloquear inicialização
setTimeout(async () => {
  try {
    const { registerOAuthRoutes } = await import("../server/_core/oauth");
    registerOAuthRoutes(app);
    oauthConfigured = true;
    console.log("[INIT] OAuth configured");
  } catch (error: any) {
    console.warn("[INIT] OAuth not available:", error?.message || "Module not found");
    // Não falhar se OAuth não estiver disponível
  }
}, 0);

// Error handling middleware - DEVE vir DEPOIS de todas as rotas
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Express Error Handler]:", err);
  console.error("[Express Error] Path:", req.path);
  console.error("[Express Error] Method:", req.method);
  console.error("[Express Error] Stack:", err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler - DEVE vir DEPOIS de todas as rotas
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Export for Vercel serverless function
export default app;
