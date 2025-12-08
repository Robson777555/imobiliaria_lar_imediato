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
    // Não tentar autenticar se for uma rota de auth
    if (opts.req.path && !opts.req.path.startsWith('/api/auth')) {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Silenciosamente falhar na autenticação - não é um erro crítico
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
