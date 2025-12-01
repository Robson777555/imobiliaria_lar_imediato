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

  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    openId: user.openId,
    role: user.role,
    name: user.name || '',
  })
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

