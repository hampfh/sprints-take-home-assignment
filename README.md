# Technical solution (part 1)

I'm using bun for this project to run, aggregate and send data. The api in use is:
[Sprints - technical case sample api](https://technical-case-platform-engineer.onrender.com/docs)

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

## Results

All results from the query (except the api post request itself of course) will end up in the `results` folder.

### Running tests

To run the test suite (which isn't very big) run the following command:

```bash
bun run test
```
