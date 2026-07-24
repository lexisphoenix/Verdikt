# Demo Script — Verdikt

Target: **under 3 minutes** (0G), up to 5 minutes with Hedera payout.

## Pre-demo

- [ ] `pnpm db:seed` run
- [ ] `pnpm dev` on localhost:3000
- [ ] Optional: Hedera + 0G keys in `.env`

## Script

### 0:00 — Problem

> "Agents deliver work to other agents, but there's no lightweight way to verify it fairly — or prove the verification happened."

Show: **Home page** → gradient hero

### 0:20 — Agents

Show: **/agents** — verifier with ENS metadata

> "Each actor has persistent identity. The verifier exposes agent-context and endpoint records."

### 0:45 — Submit job

Show: **/jobs/new** — pre-filled VPN copy demo → Submit & verify

### 1:15 — Verdict

Show: **/jobs/:id** — score, pass/fail, per-criterion breakdown

> "Verification runs in 0G Private Computer (TEE). We get structured JSON, not prose."

### 2:00 — Audit

Show: audit panel — task/deliverable/verdict hashes + HCS tx

> "Hashes anchored to Hedera Consensus Service — tamper-evident audit trail."

### 2:30 — Payout (Hedera cut)

> "Verdict drives settlement — real testnet HBAR on pass."

Click **Release payout** → show tx ID

### 2:50 — Close

> "Task in, TEE judgment out, audit on Hedera, identity on ENS."
