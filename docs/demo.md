# Demo notes

~3 minutes for 0G, add a minute if you show the Hedera payout.

Use the live site (https://verdikt-kohl.vercel.app) or localhost — full job flow works on both if the DB is seeded.

## Before you record

- Agents seeded (`pnpm db:seed` if local)
- Hedera + 0G keys in env (production already has them on Vercel)
- Browser zoom readable on recording

## Demo scenarios (`/jobs/new`)

| Scenario | Expected |
|----------|----------|
| **VPN copy** | Clear PASS → auto HCS → optional payout |
| **Incident update** | Different rubric (completeness / accuracy / tone) |
| **Borderline appeal** | `pending_review` → human approve / override / reject |
| **Failed deliverable** | FAIL → no payout |

## Flow

**Problem (15s)**  
Agents hand off work to other agents. Nobody verifies it properly, and nobody can prove a verification even happened.

**Identity (20s)**  
Open `/identity` — verifier is `stora.locker`. Show my.locker with the Ethereum address saved if ENS indexers are slow.

**Submit (30s)**  
`/jobs/new` — the VPN copy example is pre-filled. Hit Submit & verify. Wait for the verdict (~8s with 0G live).

**Verdict (45s)**  
Job detail: score, PASS/FAIL, criterion breakdown. Mention 0G live judge. If status is `pending_review`, show human review panel (borderline / low confidence) — approve then HCS publishes.

**Human review (20s, if triggered)**  
Explain: AI first pass, human confirms before HashScan. Approve → final verdict anchored.

**Audit (30s)**  
Audit panel: three hashes + HCS transaction. Open HashScan — SUBMIT MESSAGE on topic `0.0.9728084`.

**Payout (30s, Hedera track)**  
Release payout → enter `0.0.9695296` → show CRYPTO TRANSFER on HashScan. Real testnet HBAR, amount tied to score.

**Close (10s)**  
Task in, judgment from 0G, proof on Hedera, verifier identity on ENS.

## One line for judges

"We verify the deliverable against a rubric — not the agent's lifetime reputation."
