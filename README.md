# Technical solution (part 1)

I'm using elysia api client for this project using bun.

## 🛠️ Installation

The project requires the javascript runner [Bun.sh](http://bun.sh).

When bun is installed, install all dependencies of the project by running:

```bash
bun install
```

## 🚗 Running

Run the project with the following command where it will aggregate all data for the specified year and company:

```bash
bun run start --year 2022 --company "Solvex Solutions"
```

Note that even though `--company` is specified all known companies will be aggregated in the console, however only the specified company will be posted to the api endpoint.

### Running tests

To run the test suite (which isn't very big) run the following command:

```bash
bun run test
```
