export function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function statusOf(
  stock: number,
  demand: number
): "Healthy" | "Low" | "Critical" {
  if (stock > demand) return "Healthy";
  if (stock === demand) return "Low";
  return "Critical";
}
