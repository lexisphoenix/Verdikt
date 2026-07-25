# Demo notes

~3 minutes for 0G, add a minute if you show the Hedera payout.

Use the live site (https://verdikt-kohl.vercel.app) or localhost — full job flow works on both if the DB is seeded.

## Before you record

- Agents seeded (`pnpm db:seed` if local)
- Hedera + 0G keys in env (production already has them on Vercel)
- Browser zoom readable on recording

## Flow

**Problem (15s)**  
Agents hand off work to other agents. Nobody verifies it properly, and nobody can prove a verification even happened.

**Identity (20s)**  
Open `/identity` — verifier is `stora.locker`. Show my.locker with the Ethereum address saved if ENS indexers are slow.

**Submit (30s)**  
`/jobs/new` — the VPN copy example is pre-filled. Hit Submit & verify. Wait for the verdict (~8s with 0G live).

**Verdict (45s)**  
Job detail page: score, PASS/FAIL, the three criterion breakdowns. Mention this comes from 0G, not a hardcoded rule check.

**Audit (30s)**  
Audit panel: three hashes + HCS transaction. Open HashScan — SUBMIT MESSAGE on topic `0.0.9728084`.

**Payout (30s, Hedera track)**  
Release payout → enter `0.0.9695296` → show CRYPTO TRANSFER on HashScan. Real testnet HBAR, amount tied to score.

**Close (10s)**  
Task in, judgment from 0G, proof on Hedera, verifier identity on ENS.

## One line for judges

"We verify the deliverable against a rubric — not the agent's lifetime reputation."
