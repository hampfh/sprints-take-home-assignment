import { describe, expect, it } from "bun:test";
import { DateTime } from "luxon";
import { normalizeAndValidate } from "./normalize-to-sek";

const DEFAULT_EXCHANGE_RATE = [
  {
    from_currency: "EUR",
    to_currency: "SEK",
    rate: 10,
  },
];

describe("Normalize tests", () => {
  it("Performs correct exchange rate", () => {
    const result = normalizeAndValidate(
      {
        company: "test company",
        currency: "EUR",
        timestamp: "2022-01-01",
        value: 1,
      },
      DEFAULT_EXCHANGE_RATE,
      "SEK"
    );

    expect(result?.value).toBe(10);
  });

  it("Doesn't change value if currency is already correct", () => {
    const result = normalizeAndValidate(
      {
        company: "test company",
        currency: "SEK",
        timestamp: "2022-01-01",
        value: 1,
      },
      DEFAULT_EXCHANGE_RATE,
      "SEK"
    );

    expect(result?.value).toBe(1);
  });

  it("Deletes future datapoint", () => {
    const result = normalizeAndValidate(
      {
        company: "test company",
        currency: "SEK",
        timestamp: DateTime.now().plus({ year: 1 }).toFormat("yyyy-mm-dd"),
        value: 1,
      },
      DEFAULT_EXCHANGE_RATE,
      "SEK"
    );

    expect(result).toBeNull();
  });

  it("Deletes malformatted dates", () => {
    const result = normalizeAndValidate(
      {
        company: "test company",
        currency: "SEK",
        timestamp: "hello",
        value: 1,
      },
      DEFAULT_EXCHANGE_RATE,
      "SEK"
    );

    expect(result).toBeNull();
  });

  it("Deletes negative values", () => {
    const result = normalizeAndValidate(
      {
        company: "test company",
        currency: "SEK",
        timestamp: "hello",
        value: -10,
      },
      DEFAULT_EXCHANGE_RATE,
      "SEK"
    );

    expect(result).toBeNull();
  });
});
