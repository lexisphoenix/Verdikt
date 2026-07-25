# Verdikt — Video narration script (English)

Use this over the silent screen recording from `scripts/record-demo.ts`.  
Target length: **~3 minutes** (stretch to 4 min if you include payout + HashScan).

**One-liner:** *"We verify the deliverable against a rubric — not the agent's lifetime reputation."*

---

## [0:00 – 0:12] Landing

> Hi, I'm Alexis Phoenix. This is **Verdikt** — verification for work delivered by AI agents.
>
> Client sends a task and rubric. Provider sends the deliverable. We judge it, and anchor proof on Hedera.

*(Animated pipeline on screen)*

---

## [0:12 – 0:28] Identity

> The verifier agent resolves as **stora.locker** — wallet, context, and endpoint on ENS.
>
> Other agents can discover who's judging, not just hit an anonymous API.

---

## [0:28 – 0:45] New job

> Here's a live run. I pick the **VPN copy** demo scenario — task spec, weighted rubric, and deliverable pre-fill.
>
> I hit **Submit & verify**. Zero G is judging against the rubric now.

*(Wait for loading / redirect)*

---

## [0:45 – 1:25] Verdict

> Verdict is back. Score out of a hundred, pass or fail, and a breakdown per criterion — clarity, accuracy, tone — each with its own score and rationale.
>
> This is a **live call to Zero G**, not a hardcoded rule check.
>
> If the score is borderline or confidence is low, Verdikt pauses for **human review** before anything hits the chain. Clear scores like this one auto-complete.

*(Scroll pipeline: Submit → Judge → Review → Anchor)*

---

## [1:25 – 1:55] Audit / HashScan

> Every finalized verdict publishes hashes to **Hedera Consensus Service** — task, deliverable, and verdict.
>
> I'll open **HashScan** — you can see the submit message on our HCS topic. That's proof the verification happened, independent of our database.

---

## [1:55 – 2:25] Payout (Hedera)

> Optional demo step: **testnet HBAR payout** after a pass.
>
> This field is the provider's **Hedera account ID**, not the task price. Verdikt calculates the amount from the score — capped at one testnet HBAR in this demo.
>
> The transfer comes from our operator account — in production, payment would follow client deposit and escrow. Verdikt's core product is the **verifiable verdict**.

*(Click Release payout, show transfer on HashScan if you open it)*

---

## [2:25 – 2:40] Dashboard + close

> Dashboard shows recent jobs and audit status.
>
> Task in, AI judgment from Zero G, human review when it matters, final proof on Hedera, verifier on ENS.
>
> Live at **verdikt-kohl.vercel.app**. Thanks.

---

## Optional: Human review clip (+25s)

Record a second take: select **Borderline appeal** on `/jobs/new` (VPN copy with strict `minimumScore: 95` — score ~90 triggers review):

> The AI scored this borderline, so Verdikt held the verdict for human review. I can approve, override, or reject — and **only then** does the final result publish to HCS.

---

## Recording tips

- Browser zoom **110–125%**
- Read slightly slower than this script — pauses are built into the screen recording
- iMovie / CapCut / DaVinci: import `demo-recordings/*.webm`, add voiceover track
- Export 1080p, under 5 minutes for ETHGlobal
