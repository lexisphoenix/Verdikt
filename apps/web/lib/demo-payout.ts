/** Demo job budget — payout = budget × (recommendedPayoutBps / 10000). */
export const DEMO_JOB_BUDGET_HBAR = 1.0;

export function payoutAmountFromBps(recommendedPayoutBps: number): number {
  return (recommendedPayoutBps / 10000) * DEMO_JOB_BUDGET_HBAR;
}

export function payoutPercentFromBps(recommendedPayoutBps: number): number {
  return recommendedPayoutBps / 100;
}
