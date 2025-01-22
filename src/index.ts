import chalk from "chalk";
import { postAnnualData } from "./api/annual-data";
import { getExchangeRate } from "./api/exhange-rate";
import { getMonthlyData } from "./api/monthly-data";
import { aggregateMonthlyData } from "./utilities/aggregate-monthly-data";
import { normalizeAndValidateDatapoints } from "./utilities/normalize-to-sek";
import { args } from "./utilities/parse-cli-args";

const { company, year } = args();

async function main() {
  const companyData = await getMonthlyData();
  const exchangeRate = await getExchangeRate({
    fromCurrency: "EUR",
    toCurrency: "SEK",
    rate: 100,
  });

  const normalizedCompanyData = normalizeAndValidateDatapoints(
    companyData,
    exchangeRate
  );

  const annualData = aggregateMonthlyData(normalizedCompanyData, year);
  const annualCompanyData = annualData[company];

  if (annualCompanyData == null) {
    console.log(chalk.red(`Could not find the company ${company}`));
    process.exit(1);
  }

  await postAnnualData({
    company,
    currency: "SEK",
    year,
    value: annualCompanyData,
  });

  console.log(`### Annual data [${year}] ###`);
  console.log(chalk.green(JSON.stringify(annualData, null, 2)));

  process.exit(0);
}
main();
