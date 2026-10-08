# 99Tech Code Challenge #1 #

Note that if you fork this repository, your responses may be publicly linked to this repo.  
Please submit your application along with the solutions attached or linked.   

It is important that you minimally attempt the problems, even if you do not arrive at a working solution.

## Submission ##
You can either provide a link to an online repository, attach the solution in your application, or whichever method you prefer.
We're cool as long as we can view your solution without any pain.

## Solutions ##

Solutions live under `src/`:

| Problem | Path | Status / Notes |
| ------- | ---- | -------------- |
| Problem 4 | `src/problem4/` (`index.ts`) | Implemented: `sum_to_n_a` (iterative, O(n)/O(1)), `sum_to_n_b` (recursive, O(n)/O(n)), `sum_to_n_c` (formula `n*(n+1)/2`, O(1)/O(1)); handles positive and negative `n` |
| Problem 5 | `src/problem5/` | Implemented: Task CRUD API (Express 5 + TypeScript + Postgres 16 + Drizzle ORM + zod 4, Swagger UI). See `src/problem5/README.md` for setup, `npm run dev`, migrations/seed, and `npm run docs:generate` |
| Problem 6 | `src/problem6/README.md` | Implemented: Scoreboard API specification (signed action proofs, idempotency via `UNIQUE(action_id)`, atomic increments, Redis sorted-set leaderboard, outbox + worker, SSE live updates). Diagrams in `src/problem6/assets/` |
