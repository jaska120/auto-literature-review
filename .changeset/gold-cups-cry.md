---
"auto-literature-review": patch
---

Lower OpenAI API request concurrency to 1 as it is not configurable from the UI, and users might hit the rate limit.
