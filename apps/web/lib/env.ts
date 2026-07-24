import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  VERIFIER_MODE: z.enum(["mock", "live", "openai"]).default("mock"),
  ZERO_G_API_KEY: z.string().optional(),
  ZERO_G_BASE_URL: z.string().optional(),
  ZERO_G_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  HEDERA_ACCOUNT_ID: z.string().optional(),
  HEDERA_PRIVATE_KEY: z.string().optional(),
  HEDERA_NETWORK: z.enum(["testnet", "mainnet", "previewnet"]).default("testnet"),
  HEDERA_HCS_TOPIC_ID: z.string().optional(),
  RPC_URL: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return cached;
}

export function isLiveHedera(): boolean {
  const env = getEnv();
  return Boolean(
    env.HEDERA_ACCOUNT_ID &&
      env.HEDERA_PRIVATE_KEY &&
      env.HEDERA_HCS_TOPIC_ID
  );
}
