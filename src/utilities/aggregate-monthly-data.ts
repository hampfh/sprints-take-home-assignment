import { GroupedCompanyData } from "../routes/monthly-data";
import { parseDate } from "./parse-date";

export function aggregateMonthlyData(
  companyData: GroupedCompanyData,
  targetYear: number
) {
  return Object.entries(companyData).reduce<Partial<Record<string, number>>>(
    (acc, [companyName, datapoints]) => {
      const yearDatapoints = datapoints?.filter(
        (x) => parseDate(x.timestamp).year === targetYear
      );

      acc[companyName] = yearDatapoints?.reduce(
        (total, current) => total + current.value,
        0
      );
      return acc;
    },
    {}
  );
}
