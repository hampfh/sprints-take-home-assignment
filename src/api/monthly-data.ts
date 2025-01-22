import { z } from "zod";

export const companyDataPointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
  company: z.string(),
  currency: z.string(),
});
export type CompanyDataPoint = z.infer<typeof companyDataPointSchema>;
export type GroupedCompanyData = Partial<Record<string, CompanyDataPoint[]>>;

export const monthlyDataResponseSchema = z.array(companyDataPointSchema);

export async function getMonthlyData() {
  const response = await fetch(
    "https://technical-case-platform-engineer.onrender.com/monthly-data"
  );

  const result = await response.json();
  const monthlyData = monthlyDataResponseSchema.parse(result);

  return Object.groupBy(monthlyData, (current) => current.company);
}
