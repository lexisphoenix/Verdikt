import { createHash } from "crypto";

export function canonicalHash(payload: unknown): string {
  const normalized = JSON.stringify(payload, Object.keys(payload as object).sort());
  return "0x" + createHash("sha256").update(normalized, "utf8").digest("hex");
}

export function hashText(text: string): string {
  return "0x" + createHash("sha256").update(text.trim(), "utf8").digest("hex");
}
