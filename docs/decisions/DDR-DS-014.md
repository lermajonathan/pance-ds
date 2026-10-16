# DDR-DS-014: Visual regression without committed screenshots

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

CI builds the base commit and the new commit on the same runner, screenshots 50 views and compares them. Intended changes are marked `[visual-change]` in the commit message or pull request title.

## Consequences

No baseline images in the repo, so no Git LFS and no stale baselines. Differences caused by fonts or hardware cannot appear, because both builds run on one machine.
