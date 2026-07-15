import { z } from "zod";

export const createPostSchema = z.object({
  author: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(2000),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().max(200).default(""),
});

export const bioQuerySchema = z.object({
  name: z.string().trim().max(80).default(""),
  bio: z.string().trim().max(500).default(""),
});

export const usernameQuerySchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const reportQuerySchema = z.object({
  name: z.enum(["summary", "activity", "errors"]),
});

export const logSearchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-zA-Z0-9._-]+$/, "Only alphanumeric, dot, underscore, and hyphen are allowed"),
});

export const fileQuerySchema = z.object({
  file: z.string().trim().min(1).max(200),
});

export const assetQuerySchema = z.object({
  path: z.string().trim().min(1).max(200),
});

export const urlQuerySchema = z.object({
  url: z.string().url().max(2000),
});

export const webhookBodySchema = z.object({
  callbackUrl: z.string().url().max(2000),
  payload: z.record(z.unknown()).default({}),
});

export const preferencesSchema = z
  .object({
    theme: z.enum(["light", "dark"]).optional(),
    compact: z.boolean().optional(),
  })
  .strict();

export const formulaBodySchema = z.object({
  expression: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[0-9+\-*/().\s]+$/, "Only numbers and + - * / ( ) are allowed"),
});

export const loginBodySchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
});
