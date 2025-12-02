import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { sdk } from "./sdk";
import type { User } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
    if (user) {
      console.log(`[Context] Usuário autenticado: ${user.username} (ID: ${user.id})`);
    }
  } catch (error: any) {
    // Log apenas se não for um erro de autenticação esperado (sem cookie)
    if (error?.message && !error.message.includes("Invalid session cookie") && !error.message.includes("session cookie")) {
      console.error(`[Context] Erro ao autenticar requisição:`, error.message);
    }
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
