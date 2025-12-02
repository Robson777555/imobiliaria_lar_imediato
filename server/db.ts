import { promises as fs } from "fs";
import { join } from "path";
import { ENV } from './_core/env';

export interface User {
  id: number;
  openId: string | null;
  username: string | null;
  passwordHash: string | null;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  neighborhood: string | null;
  address: string | null;
  type: "Apartamento" | "Casa" | "Studio" | "Sobrado" | "Penthouse" | "Terreno" | "Comercial";
  bedrooms: number;
  bathrooms: number;
  garages: number;
  area: number;
  description: string | null;
  image: string | null;
  available: "true" | "false";
  featured: "true" | "false";
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type InsertProperty = Omit<Property, "id" | "createdAt" | "updatedAt">;

// Detectar se estamos em ambiente serverless (Vercel)
const IS_SERVERLESS = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Armazenamento em memória para ambiente serverless
let memoryUsers: User[] | null = null;
let memoryProperties: Property[] | null = null;

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "users.json");
const PROPERTIES_FILE = join(DATA_DIR, "properties.json");

async function ensureDataDir() {
  if (IS_SERVERLESS) {
    return; // Não tenta criar diretório em ambiente serverless
  }
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
  }
}

export async function readUsers(): Promise<User[]> {
  // Em ambiente serverless, usar memória
  if (IS_SERVERLESS) {
    if (memoryUsers === null) {
      // Inicializar com usuário padrão se não existir
      const now = new Date();
      memoryUsers = [{
        id: 1,
        openId: null,
        username: "@userCliente96",
        passwordHash: "$2b$12$ycMHKNHKbn24Ec5iQUle0u7ME1qC3ppEWSVn7C2eNrCAB0Lkdi9mK", // hash de @passwordCliente96
        name: "Cliente 96",
        email: null,
        loginMethod: "password",
        role: "admin",
        createdAt: now,
        updatedAt: now,
        lastSignedIn: now,
      }];
    }
    return memoryUsers;
  }
  
  // Em ambiente local, usar arquivos
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data).map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
      lastSignedIn: new Date(u.lastSignedIn),
    }));
    } catch (error) {
    return [];
  }
}

const MOCK_PROPERTIES: Omit<Property, "createdAt" | "updatedAt" | "userId">[] = [
  {
    id: 1,
    title: "Apartamento Moderno no Centro",
    price: 450000,
    neighborhood: "Centro",
    address: "Rua das Flores, 123",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    area: 95,
    description: "Apartamento elegante com acabamento premium, localizado em área nobre do centro. Possui vista para a cidade, cozinha integrada e varanda ampla.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    available: "true",
    featured: "true",
  },
  {
    id: 2,
    title: "Casa com Piscina e Jardim",
    price: 750000,
    neighborhood: "Vila Mariana",
    address: "Avenida Paulista, 456",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: 280,
    description: "Casa espaçosa com piscina aquecida, jardim paisagístico e área de lazer completa. Ideal para famílias que buscam conforto e privacidade.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    available: "true",
    featured: "true",
  },
  {
    id: 3,
    title: "Studio Compacto e Funcional",
    price: 280000,
    neighborhood: "Bom Fim",
    address: "Rua Ramiro Barcelos, 789",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    area: 35,
    description: "Studio bem aproveitado com cozinha integrada, ideal para profissionais ou casais. Localização estratégica próximo a transportes e comércios.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    available: "true",
    featured: "false",
  },
  {
    id: 4,
    title: "Apartamento Duplex com Terraço",
    price: 580000,
    neighborhood: "Moinhos de Vento",
    address: "Rua Quintino Bocaiúva, 234",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    area: 120,
    description: "Duplex sofisticado com terraço privativo, cozinha gourmet e sala ampla. Condomínio com infraestrutura completa e segurança 24h.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    available: "true",
    featured: "true",
  },
  {
    id: 5,
    title: "Sobrado em Condomínio Fechado",
    price: 650000,
    neighborhood: "Três Figueiras",
    address: "Rua Marquês de Pombal, 567",
    type: "Sobrado",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: 200,
    description: "Sobrado moderno em condomínio fechado com segurança, áreas verdes e lazer. Perfeito para quem busca qualidade de vida e segurança.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    available: "true",
    featured: "false",
  },
  {
    id: 6,
    title: "Penthouse com Vista Panorâmica",
    price: 1200000,
    neighborhood: "Bela Vista",
    address: "Avenida Getúlio Vargas, 890",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 4,
    garages: 2,
    area: 250,
    description: "Penthouse exclusivo com vista 360° da cidade, acabamento de luxo, suíte master com spa privado e varanda panorâmica. Imóvel de alto padrão.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    available: "true",
    featured: "true",
  },
];

async function readProperties(): Promise<Property[]> {
  // Em ambiente serverless, usar memória
  if (IS_SERVERLESS) {
    if (memoryProperties === null) {
      const now = new Date();
      memoryProperties = MOCK_PROPERTIES.map(p => ({
        ...p,
        userId: 0,
        createdAt: now,
        updatedAt: now,
      }));
    }
    return memoryProperties;
  }
  
  // Em ambiente local, usar arquivos
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
    const savedProperties = JSON.parse(data).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
    
    if (savedProperties.length === 0) {
      const now = new Date();
      const initialProperties: Property[] = MOCK_PROPERTIES.map(p => ({
        ...p,
        userId: 0,
        createdAt: now,
        updatedAt: now,
      }));
      await writeProperties(initialProperties);
      return initialProperties;
    }
    
    return savedProperties;
  } catch (error) {
    const now = new Date();
    const initialProperties: Property[] = MOCK_PROPERTIES.map(p => ({
      ...p,
      userId: 0,
      createdAt: now,
      updatedAt: now,
    }));
    await writeProperties(initialProperties);
    return initialProperties;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  if (IS_SERVERLESS) {
    memoryUsers = users;
    return;
  }
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

async function writeProperties(properties: Property[]): Promise<void> {
  if (IS_SERVERLESS) {
    memoryProperties = properties;
    return;
  }
  await ensureDataDir();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), "utf-8");
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId && !user.username) {
    throw new Error("User openId or username is required for upsert");
  }

  try {
    const users = await readUsers();
    let existingIndex = -1;
    
    if (user.openId) {
      existingIndex = users.findIndex(u => u.openId === user.openId);
    } else if (user.username) {
      existingIndex = users.findIndex(u => u.username === user.username);
    }
    
    const now = new Date();
    const userData: User = {
      id: existingIndex >= 0 ? users[existingIndex].id : users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...user,
      role: user.role || (user.openId === ENV.ownerOpenId ? "admin" : "user"),
      createdAt: existingIndex >= 0 ? users[existingIndex].createdAt : now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }

    await writeUsers(users);
  } catch (error) {
    throw error;
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  try {
    const users = await readUsers();
    return users.find(u => u.username === username);
  } catch (error) {
    return undefined;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  try {
    const users = await readUsers();
    return users.find(u => u.openId === openId);
  } catch (error) {
    return undefined;
  }
}

export async function createProperty(property: InsertProperty): Promise<Property> {
  try {
    const properties = await readProperties();
    const now = new Date();
    const maxMockId = Math.max(...MOCK_PROPERTIES.map(p => p.id));
    const maxSavedId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) : 0;
    const newId = Math.max(maxMockId, maxSavedId) + 1;
    
    const newProperty: Property = {
      id: newId,
      ...property,
      createdAt: now,
      updatedAt: now,
    };

    properties.push(newProperty);
    await writeProperties(properties);
    
    return newProperty;
  } catch (error) {
    throw error;
  }
}

export async function getPropertyById(id: number): Promise<Property | undefined> {
  try {
    const properties = await readProperties();
    let property = properties.find(p => p.id === id);
    
    if (!property) {
      const mockProperty = MOCK_PROPERTIES.find(p => p.id === id);
      if (mockProperty) {
        property = {
          ...mockProperty,
          userId: 0,
          createdAt: new Date(2024, 0, 1),
          updatedAt: new Date(2024, 0, 1),
        };
      }
    }
    
    return property;
  } catch (error) {
    return undefined;
  }
}

export async function searchProperties(filters: {
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  available?: boolean;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Property[]> {
  try {
    let properties = await readProperties();
    
    const mockPropertiesMap = new Map(MOCK_PROPERTIES.map(p => [p.id, {
      ...p,
      userId: 0,
      createdAt: new Date(2024, 0, 1),
      updatedAt: new Date(2024, 0, 1),
    }]));
    
    properties.forEach(p => mockPropertiesMap.delete(p.id));
    const additionalMockProperties = Array.from(mockPropertiesMap.values());
    properties = [...properties, ...additionalMockProperties];

    if (filters.neighborhood) {
      properties = properties.filter(p => 
        p.neighborhood?.toLowerCase().includes(filters.neighborhood!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      properties = properties.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      properties = properties.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.type) {
      properties = properties.filter(p => p.type === filters.type);
    }

    if (filters.minBedrooms !== undefined) {
      properties = properties.filter(p => p.bedrooms >= filters.minBedrooms!);
    }

    if (filters.minBathrooms !== undefined) {
      properties = properties.filter(p => p.bathrooms >= filters.minBathrooms!);
    }

    if (filters.available !== undefined) {
      const availableStr = filters.available ? "true" : "false";
      properties = properties.filter(p => p.available === availableStr);
    }

    if (filters.featured !== undefined) {
      const featuredStr = filters.featured ? "true" : "false";
      properties = properties.filter(p => p.featured === featuredStr);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      properties = properties.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.address?.toLowerCase().includes(searchLower)
      );
    }

    properties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    
    return properties.slice(offset, offset + limit);
  } catch (error) {
    return [];
  }
}

export async function getPropertiesByUserId(userId: number): Promise<Property[]> {
  try {
    const properties = await readProperties();
    return properties.filter(p => p.userId === userId);
  } catch (error) {
    return [];
  }
}

export async function updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
  try {
    const properties = await readProperties();
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const property = properties[index];
    const isMockProperty = MOCK_PROPERTIES.some(p => p.title === property.title);
    if (isMockProperty) {
      throw new Error("Não é possível atualizar imóveis mockados");
    }
    
    const updatedProperty: Property = {
      ...properties[index],
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    properties[index] = updatedProperty;
    await writeProperties(properties);
    
    return updatedProperty;
  } catch (error) {
    throw error;
  }
}

export async function deleteProperty(id: number): Promise<boolean> {
  try {
    const properties = await readProperties();
    
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    const property = properties[index];
    const isMockProperty = MOCK_PROPERTIES.some(p => p.title === property.title);
    if (isMockProperty) {
      throw new Error("Não é possível deletar imóveis mockados");
    }
    
    properties.splice(index, 1);
    await writeProperties(properties);
    
    return true;
  } catch (error) {
    throw error;
  }
}
