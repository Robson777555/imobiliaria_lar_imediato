import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { authenticateWithPassword, createSessionToken } from "./_core/auth";
import { ForbiddenError } from "@shared/_core/errors";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    login: publicProcedure
      .input(
        z.object({
          username: z.string().min(1, "Usuário é obrigatório"),
          password: z.string().min(1, "Senha é obrigatória"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await authenticateWithPassword(input.username, input.password);
        
        if (!user) {
          throw ForbiddenError("Credenciais inválidas");
        }

        const sessionToken = await createSessionToken(user, {
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
  }),

  properties: router({
    search: publicProcedure
      .input(
        z.object({
          neighborhood: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          type: z.enum(["Apartamento", "Casa", "Studio", "Sobrado", "Penthouse", "Terreno", "Comercial"]).optional(),
          minBedrooms: z.number().optional(),
          minBathrooms: z.number().optional(),
          available: z.boolean().optional(),
          featured: z.boolean().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        return await db.searchProperties(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPropertyById(input.id);
      }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          price: z.number().min(0),
          neighborhood: z.string().optional(),
          address: z.string().optional(),
          type: z.enum(["Apartamento", "Casa", "Studio", "Sobrado", "Penthouse", "Terreno", "Comercial"]),
          bedrooms: z.number().min(0).default(0),
          bathrooms: z.number().min(0).default(0),
          garages: z.number().min(0).default(0),
          area: z.number().min(1),
          description: z.string().optional(),
          image: z.string().refine(
            (val) => !val || val === "" || val.startsWith("http") || val.startsWith("data:image"),
            { message: "Imagem deve ser uma URL válida ou uma imagem em base64" }
          ).optional().or(z.literal("")),
          available: z.boolean().default(true),
          featured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id || 0;
        const imageValue = input.image && input.image.trim() !== '' ? input.image.trim() : null;
        
        return await db.createProperty({
          ...input,
          image: imageValue,
          userId,
          available: input.available ? "true" : "false",
          featured: input.featured ? "true" : "false",
        });
      }),

    myProperties: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        return [];
      }
      return await db.getPropertiesByUserId(ctx.user.id);
    }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          price: z.number().min(0).optional(),
          neighborhood: z.string().optional(),
          address: z.string().optional(),
          type: z.enum(["Apartamento", "Casa", "Studio", "Sobrado", "Penthouse", "Terreno", "Comercial"]).optional(),
          bedrooms: z.number().min(0).optional(),
          bathrooms: z.number().min(0).optional(),
          garages: z.number().min(0).optional(),
          area: z.number().min(1).optional(),
          description: z.string().optional(),
          image: z.string().refine(
            (val) => !val || val === "" || val.startsWith("http") || val.startsWith("data:image"),
            { message: "Imagem deve ser uma URL válida ou uma imagem em base64" }
          ).optional().or(z.literal("")),
          available: z.boolean().optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        const formattedUpdates: any = { ...updates };
        if (updates.available !== undefined) {
          formattedUpdates.available = updates.available ? "true" : "false";
        }
        if (updates.featured !== undefined) {
          formattedUpdates.featured = updates.featured ? "true" : "false";
        }
        
        return await db.updateProperty(id, formattedUpdates);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const success = await db.deleteProperty(input.id);
        if (!success) {
          throw new Error("Imóvel não encontrado");
        }
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
