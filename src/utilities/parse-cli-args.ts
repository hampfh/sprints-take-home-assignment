import chalk from "chalk";
import { parseArgs } from "util";
import { z } from "zod";

const schema = z.object({
  year: z.coerce.number(),
  company: z.string(),
});

export function args() {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      year: {
        type: "string",
      },
      company: {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const result = schema.safeParse(values);
  if (!result.success) {
    if (result.error.errors[0].path[0] === "company")
      console.log(
        chalk.red(
          "Missing argument --company, please provide it like '--company somecompany'"
        )
      );
    if (result.error.errors[0].path[0] === "year") {
      console.log(
        chalk.red(
          "Missing argument --year, please provide it like '--year 2020'"
        )
      );
    }
    process.exit(1);
  }
  return result.data;
}
