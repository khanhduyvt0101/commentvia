# commentvia: working rules

## Green-only merges and releases (owner rule 2026-11-23)

Merge or release only when ALL tests and gates pass, including failures that were already red on the default
branch and were not caused by your change: fix those first, at the root cause. Never skip, delete or weaken a test
just to make it pass (dead code may be removed together with its tests after checking every caller), never compare
against a "known failures" baseline, never bypass hooks or gates. Autopilot runs follow the same rule: a run that
cannot get every gate green reports the blocker instead of merging or releasing.
