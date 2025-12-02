import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import { ENV } from './env';
import * as db from '../db';
import type { User } from '../db';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(
  user: User,
  options?: { expiresInMs?: number }
): Promise<string> {
  const expiresInMs = options?.expiresInMs ?? ONE_YEAR_MS;
  const secret = new TextEncoder().encode(ENV.cookieSecret);

  // Para login com senha (sem openId), usar userId no payload
  // O SDK verificaSession vai converter userId para password_{userId}
  // Para login OAuth, usar openId diretamente
  const payload: any = {
    userId: user.id,
    username: user.username || '',
    role: user.role,
    name: user.name || user.username || '',
  };

  // Se o usuário tem openId (OAuth), incluir openId e appId no payload
  // Caso contrário, o SDK vai detectar userId e converter para password_{userId}
  if (user.openId) {
    payload.openId = user.openId;
    payload.appId = ENV.appId;
  }

  console.log(`[createSessionToken] Criando token para usuário ID: ${user.id}, username: ${user.username}, openId: ${user.openId || 'null'}`);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInMs / 1000)
    .sign(secret);

  return token;
}

export async function authenticateWithPassword(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return null;
    }

    if (!user.passwordHash) {
      return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return null;
    }

    await db.upsertUser({
      ...user,
      lastSignedIn: new Date(),
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function createUserWithPassword(
  username: string,
  password: string,
  options?: {
    name?: string;
    email?: string;
    role?: 'user' | 'admin';
  }
): Promise<User> {
  const existingUser = await db.getUserByUsername(username);
  if (existingUser) {
    throw new Error('Usuário já existe');
  }

  const passwordHash = await hashPassword(password);

  const newUser: db.InsertUser = {
    username,
    passwordHash,
    name: options?.name || null,
    email: options?.email || null,
    role: options?.role || 'user',
    openId: null,
    loginMethod: 'password',
    lastSignedIn: new Date(),
  };

  await db.upsertUser(newUser);

  const user = await db.getUserByUsername(username);
  if (!user) {
    throw new Error('Erro ao criar usuário');
  }

  return user;
}

