export function mapScbStatusToInternal(status?: string): "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED" {
  const v = (status || "").toUpperCase()
  if (["SUCCESS", "PAID", "COMPLETED"].includes(v)) return "SUCCEEDED"
  if (["PENDING", "PROCESSING", "WAITING"].includes(v)) return "PENDING"
  if (["EXPIRED"].includes(v)) return "EXPIRED"
  return "FAILED"
}
