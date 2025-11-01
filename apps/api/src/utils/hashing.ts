import { createHash } from "crypto";

export function sha256(data: string | object): string {
  const input = typeof data === "string" ? data : JSON.stringify(data);
  return createHash("sha256").update(input).digest("hex");
}
