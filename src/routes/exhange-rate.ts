import { z } from "zod";

export const exchangeRateSchema = z.object({
  from_currency: z.string(),
  to_currency: z.string(),
  rate: z.number(),
});
export type ExchangeRate = z.infer<typeof exchangeRateSchema>;

export async function getExchangeRate({
  fromCurrency,
  toCurrency,
  rate,
}: {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}) {
  const response = await fetch(
    `https://technical-case-platform-engineer.onrender.com/exchange-rates`
  );
  const result = await response.json();
  const exchangeRate = z.array(exchangeRateSchema).parse(result);
  return exchangeRate;
}
