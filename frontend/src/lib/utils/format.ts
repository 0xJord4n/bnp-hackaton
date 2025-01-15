export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatFundingStage(stage: string | null | undefined): string {
  if (!stage) return "N/A";

  // Convert to title case and replace underscores with spaces
  const normalized = stage
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Special cases for common abbreviations
  if (normalized.startsWith("Ipo")) return "IPO";
  if (normalized.includes("Ico")) return "ICO";

  return normalized;
}
