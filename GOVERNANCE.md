# Governance

Pance is **open source, with a single maintainer**. Anyone can use it, fork it and propose changes. **Nothing is merged, released or added to the roadmap without the maintainer's approval.**

## Who decides

[Jonathan Lerma](https://github.com/lermajonathan) is the maintainer and makes every final decision: what is built, what is changed and what is declined. This keeps the system coherent. It is not a judgement on the quality of a proposal.

## What you can do

| You want to | Do this |
|---|---|
| Use Pance | Install `@pance/react` and `@pance/tokens`. MIT license: commercial use, forks and modifications are welcome. |
| Ask a question or float an idea | [Discussions](https://github.com/lermajonathan/pance-ds/discussions) |
| Report a bug | A [bug report](https://github.com/lermajonathan/pance-ds/issues/new?template=bug_report.yml) |
| Suggest a change, feature or component | A [proposal](https://github.com/lermajonathan/pance-ds/issues/new?template=proposal.yml) |
| Fix a typo or a small docs error | Open a pull request directly |

## How a proposal is decided

1. **Open a proposal.** Describe the problem first, then the change.
2. **Triage.** The maintainer labels it `approved`, `needs-info`, `later` or `declined`, with a short reason. Best effort, no fixed deadline.
3. **Decision record.** An approved change to a token, a component API or a policy gets a [DDR-DS record](docs/decisions/README.md) (status `Proposed` until it ships).
4. **Implementation.** Only proposals labelled `approved` should become pull requests. Pull requests for unapproved work may be closed without review.
5. **Review and merge.** Every pull request needs the maintainer's approval and passing CI. Only the maintainer merges and releases.

## What fits Pance

Changes should keep the system accessible (WCAG 2.2 AA), token-driven, documented in English and Spanish, and consistent with the existing component model (`severity`, `variant`, `size`). Breaking changes follow the [deprecation policy](docs/deprecation.md).

## Name and brand

The MIT license covers the code and the design files. It does not grant rights to the name "Pance", its logo or its cover artwork. You may say your project is "built with Pance" or "based on Pance"; please do not present a fork as the official Pance.

## Changes to this document

Only the maintainer changes this document.
