# Métiers Numériques PEP

[![License][img-license]][lnk-license]
[![Build Status][img-github]][lnk-github]
[![Code Coverage][img-codecov]][lnk-codecov]

> Scrapper and RESTful API for [place-emploi-public.gouv.fr](https://place-emploi-public.gouv.fr) job offers.

## Features

- Automatically index and process new job offers
- Provide RESTful GET routes to fetch relatively clean JSON data
- Provide both sanitized HTML and Markdown sources for mission, profile and team descriptions

## Todo

There is a serious **developpement-related** issue forcing us to use CommonJS instead of ESM for workers
since neither `bull` nor `jest-workers` support it:

- <https://github.com/facebook/jest/issues/12274>
- <https://github.com/OptimalBits/bull/pull/2341>

We use `rollup` to bundle it as CommonJS (via `.cjs` extensions since it's a pure ESM package)
meanwhile `jest-workers` [ESM-compatibility PR is in progress](https://github.com/facebook/jest/pull/12680)
and apparently planned to be released with `jest@19`.

## Contributing

You're a developer and want to either run the app locally or help us improve this application?

Please have a look at our [contributing document](./CONTRIBUTING.md).

---

[img-codecov]: https://img.shields.io/codecov/c/github/betagouv/metiers-numeriques-pep/main?style=flat-square
[img-github]: https://img.shields.io/github/workflow/status/betagouv/metiers-numeriques-pep/Check/main?style=flat-square
[img-license]: https://img.shields.io/github/license/betagouv/metiers-numeriques-pep?style=flat-square
[lnk-codecov]: https://codecov.io/gh/betagouv/metiers-numeriques-pep/branch/main
[lnk-github]: https://github.com/betagouv/metiers-numeriques-pep/actions?query=branch%3Amain++
[lnk-license]: https://github.com/betagouv/metiers-numeriques-pep/blob/main/LICENSE
