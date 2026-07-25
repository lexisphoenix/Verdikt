# Verdikt — Video narration script (English)

Voiceover for the silent screen recording from `scripts/record-demo.ts`.  
**Target length: ~3 minutes** · Optional borderline clip: **+25s**

**One-liner:** *"We verify the deliverable against a rubric — not the agent's lifetime reputation."*

**Author:** Alexis Phoenix · **Live:** [verdikt-kohl.vercel.app](https://verdikt-kohl.vercel.app)

---

## [0:00 – 0:18] Hook + landing

**[SCREEN]** Landing page — hero headline, agent handoff infographic, sponsor pills.

> Hi, I'm Alexis Phoenix. This is **Verdikt**.
>
> AI agents are doing real work now — one agent orders a task, another delivers it. But how do you know the deliverable is actually good?
>
> Verdikt checks the work against your rubric, pays the provider for that quality, and leaves a public receipt on Hedera. We verify the deliverable — not the agent's reputation.

---

## [0:18 – 0:32] The handoff

**[SCREEN]** Agent handoff card on landing — client → Verdikt → provider flow. Brief scroll to "Under the hood" pipeline if it loops nicely.

> Here's the idea in one breath: a client agent sends a task and a rubric. A provider agent sends back the deliverable. Verdikt sits in the middle — judge the work, settle payment, prove it happened.

---

## [0:32 – 0:55] Start a job

**[SCREEN]** Click **Run demo** or **Submit & verify** → `/jobs/new`. VPN copy preset selected. Task spec, rubric, deliverable pre-filled. Acme Client Agent → CopyForge Provider visible in the form.

> Let's run it live. I'll use the **VPN copy** preset — task, weighted rubric, and deliverable are already filled in.
>
> You can see one agent ordered the work and another delivered it. I hit **Submit & verify** — and Verdikt sends this to the AI judge.

**[SCREEN]** Loading state on Submit & verify → redirect to job detail page.

---

## [0:55 – 1:35] Verdict

**[SCREEN]** Job detail — big score, PASS/FAIL badge, summary line. Pipeline track: Submit → Judge → Review → Anchor. Scroll to rubric breakdown — criterion bars or radar chart with scores and rationale per criterion (clarity, accuracy, tone).

> Verdict's back.
>
> Eighty-seven out of a hundred — **pass**. And it's not just a thumbs up. For each criterion — clarity, accuracy, tone — you get a score and a plain-English reason why.
>
> That's a live call to **0G**, judging this specific deliverable against this specific rubric. Not a hardcoded regex. Not "trust me, the agent is reputable."

**[SCREEN]** Scroll to **Work quality** and **AI confidence** meter bars. Then **Pay for quality** section — job budget 1.00 HBAR, payout percentage bar, client → provider arrow with HBAR amount.

> The score also drives payment. Better work, bigger slice of the budget. Here the job budget is one HBAR — and this score unlocks most of it for the provider.

---

## [1:35 – 1:50] When the AI isn't sure

**[SCREEN]** Pipeline track on Review step (or briefly mention while still on verdict page — do not switch presets in main take).

> One more thing worth knowing: when the AI isn't sure — borderline score, low confidence — Verdikt stops and a **person** decides before anything is final. Clear passes like this one sail through on their own.

*(See optional clip below for the full human-review moment.)*

---

## [1:50 – 2:15] Public receipt + fingerprints

**[SCREEN]** Audit trail card — task hash, deliverable hash, verdict hash. Click **View on HashScan** → Hedera explorer with the consensus message.

> Once the verdict is final, Verdikt publishes a **public receipt** on Hedera — anyone can look it up, no trust in our database required.
>
> We also store **fingerprints** of the task, the deliverable, and the verdict. Same files, same fingerprint — proof nothing was swapped after the fact.

---

## [2:15 – 2:45] Release payout

**[SCREEN]** **Pay for quality** panel — percentage of budget, HBAR amount. Scroll to **Payout** section → enter provider Hedera account ID → click **Release payout**. Show success state with transaction ID; optionally open HashScan for the transfer.

> Payment follows quality. The score sets what percentage of the one-HBAR budget goes to the provider — you can see it right here under **Pay for quality**.
>
> I'll release the payout… and there it is — testnet HBAR, sent because the work passed and the verdict is on chain.

---

## [2:45 – 3:00] Close

**[SCREEN]** Dashboard with recent jobs, or pull back to landing CTA. End on verdikt-kohl.vercel.app URL visible.

> Agents hand off work every day. Verdikt makes sure someone actually checked it — and that the provider gets paid for the quality they delivered, with proof anyone can verify.
>
> Try it yourself at **verdikt-kohl.vercel.app**. I'm Alexis Phoenix — thanks for watching.

---

## Optional: Human review clip (+25s)

Record as a separate take. On `/jobs/new`, select **Borderline appeal** preset (strict rubric, minimum score 95 — VPN copy scores ~90 and triggers review).

**[SCREEN]** Submit & verify → job page with **pending review** status, **Provisional AI verdict** badge, review panel with approve / override / reject.

> This one's borderline — strong copy, but the rubric is strict. Verdikt didn't auto-finalize. A human has to approve, override, or reject — and **only then** does the public receipt go to Hedera.

**[SCREEN]** Click Approve → status completes, HashScan link appears, pipeline shows Review + Anchor filled in.

> Approved. Now it's final — and the fingerprints hit the chain.

---

## Recording tips

- Browser zoom **110–125%** so text reads on video
- Read slightly slower than this script — pauses match the screen recording
- iMovie / CapCut / DaVinci: import `demo-recordings/*.webm`, add voiceover track
- Export **1080p**, under **5 minutes** for ETHGlobal submission
- Main take: **VPN copy** preset only — save borderline for the optional clip
