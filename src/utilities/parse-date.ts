import { DateTime } from "luxon";

export function parseDate(date: string) {
  return DateTime.fromFormat(date, "yyyy-mm-dd");
}
