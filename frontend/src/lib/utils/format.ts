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

export function formatCompanyInfoKey(key: string): string {
  // Special cases for abbreviations and specific terms
  const specialCases: Record<string, string> = {
    b2b: "B2B",
    b2c: "B2C",
    b2g: "B2G",
    saas: "SaaS",
    url: "URL",
    api: "API",
    ip: "IP",
    ai: "AI",
    ml: "ML",
    ar: "AR",
    vr: "VR",
    ceo: "CEO",
    cto: "CTO",
    cfo: "CFO",
    coo: "COO",
    hr: "HR",
    id: "ID",
    roi: "ROI",
    kpi: "KPI",
    gdpr: "GDPR",
    hipaa: "HIPAA",
    iso: "ISO",
    nda: "NDA",
    pos: "POS",
    crm: "CRM",
    erp: "ERP",
    type: "Type", // For cases like customer_type
    size: "Size", // For cases like company_size
    count: "Count", // For cases like employee_count
    status: "Status", // For cases like company_status
    level: "Level", // For cases like security_level
    rate: "Rate", // For cases like growth_rate
  };

  // Split by underscore and convert to lowercase
  const words = key.toLowerCase().split("_");

  // Process each word
  const processed = words.map((word) => {
    // Check if the word is a special case
    if (specialCases[word]) {
      return specialCases[word];
    }
    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return processed.join(" ");
}
