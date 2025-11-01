import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  CORS_ORIGINS: z.string().default("*"),
  JWT_SECRET: z.string().min(1)
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(",").map(s => s.trim());
