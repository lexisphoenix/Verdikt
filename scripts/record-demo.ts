/**
 * Silent screen recording of the Verdikt demo flow (no voiceover).
 * Usage: cd apps/web && npx tsx ../../scripts/record-demo.ts
 * Output: demo-recordings/verdikt-demo.webm
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.BASE_URL ?? "https://verdikt-kohl.vercel.app";
const OUT_DIR = join(process.cwd(), "demo-recordings");
const PAYOUT_ACCOUNT = "0.0.9695296";

async function pause(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  console.log("Recording demo at", BASE);

  // Landing (~8s)
  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(5000);
  await page.evaluate(() => window.scrollBy(0, 400));
  await pause(3000);

  // Identity (~8s)
  await page.goto(`${BASE}/identity`, { waitUntil: "networkidle" });
  await pause(6000);

  // New job + submit (~15s + wait for 0G)
  await page.goto(`${BASE}/jobs/new`, { waitUntil: "networkidle" });
  await pause(2500);
  await page.getByRole("button", { name: /Submit & verify/i }).click();
  console.log("Waiting for 0G verdict…");
  await page.waitForURL(/\/jobs\/[^/]+$/, { timeout: 120000 });
  await page.waitForSelector("text=/PASS|FAIL|pending review/i", { timeout: 60000 });
  await pause(5000);

  // Verdict page — scroll through pipeline + criteria
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
  } catch {
    await pause(1000);
  }
  await pause(3500);
  try {
    await page.evaluate(() => window.scrollBy(0, 500));
  } catch {
    /* navigation */
  }
  await pause(3500);
  try {
    await page.evaluate(() => window.scrollBy(0, 500));
  } catch {
    /* navigation */
  }
  await pause(3000);

  // HashScan if link visible
  const hashscan = page.getByRole("link", { name: /View on HashScan/i });
  if (await hashscan.isVisible().catch(() => false)) {
    const href = await hashscan.getAttribute("href");
    if (href) {
      await page.goto(href, { waitUntil: "networkidle" });
      await pause(5000);
      await page.goBack({ waitUntil: "networkidle" });
      await pause(2000);
    }
  }

  // Payout if available
  const payoutInput = page.locator('input[placeholder="0.0.xxxxx"]');
  if (await payoutInput.isVisible().catch(() => false)) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pause(1500);
    await payoutInput.fill(PAYOUT_ACCOUNT);
    await page.getByRole("button", { name: /Release payout/i }).click();
    console.log("Waiting for payout…");
    await pause(6000);
  }

  // Dashboard closing (~5s)
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await pause(4000);

  await context.close();
  await browser.close();

  console.log("\nDone. Video saved under:", OUT_DIR);
  console.log("Rename the .webm to verdikt-demo.webm if needed.");
}

main().catch((e) => {
  console.error("Recording failed:", e);
  process.exit(1);
});
