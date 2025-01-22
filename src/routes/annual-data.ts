import { z } from "zod";

const annualDataBodySchema = z.object({
  year: z.number(),
  value: z.number(),
  company: z.string(),
  currency: z.string(),
});

export async function postAnnualData(
  input: z.infer<typeof annualDataBodySchema>
) {
  const response = await fetch(
    `https://technical-case-platform-engineer.onrender.com/annual-data`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return {
    status: response.status,
    message: await response.text(),
  };
}
