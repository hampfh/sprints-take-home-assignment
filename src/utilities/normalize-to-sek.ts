import { DateTime } from "luxon";
import { ExchangeRate } from "../api/exhange-rate";
import { CompanyDataPoint, GroupedCompanyData } from "../api/monthly-data";

export function normalizeAndValidateDatapoints(
  companyData: GroupedCompanyData,
  exchangeRates: ExchangeRate[]
) {
  return Object.entries(companyData).reduce<typeof companyData>(
    (acc, [companyName, datapoints]) => {
      const normalizedData = datapoints?.map((datapoint) =>
        normalizeAndValidate(datapoint, exchangeRates, "SEK")
      );

      if (!normalizedData) return acc;

      acc[companyName] = normalizedData.filter((x) => x != null);
      return acc;
    },
    {}
  );
}

export function normalizeAndValidate(
  datapoint: CompanyDataPoint,
  exchangeRates: ExchangeRate[],
  targetCurrency: "SEK"
) {
  const findExchangeRate = () => {
    if (datapoint.currency === targetCurrency) return 1;

    return exchangeRates.find(
      (x) =>
        x.from_currency === datapoint.currency &&
        x.to_currency === targetCurrency
    )?.rate;
  };

  const exchangeRate = findExchangeRate();
  if (!exchangeRate) {
    return null;
  }

  // Check that date is correct
  if (!/\d{2}-\d{2}-\d{2}/g.test(datapoint.timestamp)) {
    // Invalid date
    return null;
  }

  // Only keep dates before current date
  // Historical data
  if (DateTime.fromFormat(datapoint.timestamp, "yyyy-mm-dd") > DateTime.now()) {
    return null;
  }

  return {
    ...datapoint,
    value: datapoint.value * exchangeRate,
    currency: "SEK",
  } satisfies CompanyDataPoint;
}
