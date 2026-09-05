export type AIModelPricing = { provider: string; model: string; inputPerMillionTokens: number; outputPerMillionTokens: number; currency: "USD"; lastUpdated: string; status: "example" };
// Example values only: update this one file after verifying each provider's official pricing.
export const aiModelPricing: AIModelPricing[] = [
  { provider: "Example provider", model: "Example balanced model", inputPerMillionTokens: 3, outputPerMillionTokens: 12, currency: "USD", lastUpdated: "2026-09-05", status: "example" },
];
export const defaultAIModel = aiModelPricing[0];
