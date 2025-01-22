import { CompanyDataPoint } from "../api/monthly-data";

export function perMonthHighestValue(datapoints: CompanyDataPoint[]) {
  return Object.entries(Object.groupBy(datapoints, (x) => x.timestamp)).reduce<
    Record<string, Pick<CompanyDataPoint, "company" | "value">>
  >((acc, [date, values]) => {
    const highestDatapoint = values?.reduce((highest, current) =>
      current.value > highest.value ? current : highest
    );
    if (highestDatapoint != null) {
      acc[date] = {
        company: highestDatapoint.company,
        value: highestDatapoint.value,
      };
    }

    return acc;
  }, {});
}
