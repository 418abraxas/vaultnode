export function snippet(s: string, length = 240): string {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length <= length ? clean : clean.slice(0, length - 1) + "…";
}
