import chalk from "chalk";
import { access, mkdir } from "node:fs/promises";
import { postAnnualData } from "./api/annual-data";
import { getExchangeRate } from "./api/exhange-rate";
import { getMonthlyData } from "./api/monthly-data";
import { aggregateMonthlyData } from "./utilities/aggregate-monthly-data";
import { normalizeAndValidateDatapoints } from "./utilities/normalize-to-sek";

import { args } from "./utilities/parse-cli-args";
import { perMonthHighestValue } from "./utilities/per-month-highest-value";

const { company, year } = args();

async function main() {
  const { grouped: companyData, raw } = await getMonthlyData();
  const exchangeRates = await getExchangeRate({
    fromCurrency: "EUR",
    toCurrency: "SEK",
    rate: 100,
  });

  const normalizedCompanyData = normalizeAndValidateDatapoints(
    companyData,
    exchangeRates
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

  const createDirIfNotExists = (dir: string) =>
    access(dir)
      .then(() => undefined)
      .catch(() => mkdir(dir));

  createDirIfNotExists("results");

  const annualFile = Bun.file("./results/annual-data.json");
  const fileData = JSON.stringify(annualData, null, 2);
  console.log(`### Annual data [${year}] ###`);
  console.log(chalk.green(fileData));
  annualFile.write(fileData);

  // Further questions
  const bestPerMonthFile = Bun.file("./results/best-per-month.json");

  bestPerMonthFile.write(
    JSON.stringify(
      perMonthHighestValue(
        normalizeAndValidateDatapoints({ all: raw }, exchangeRates)["all"]!
      ),
      null,
      2
    )
  );

  console.log("### Total value of Nexara Technologies ###");
  console.log(
    chalk.green(
      JSON.stringify(
        aggregateMonthlyData(normalizedCompanyData)["Nexara Technologies"],
        null,
        2
      )
    )
  );

  console.log();
  console.log(
    chalk.green(
      "Note: For month-by-month data, see the",
      chalk.bold("results"),
      "folder"
    )
  );

  process.exit(0);
}
main();
