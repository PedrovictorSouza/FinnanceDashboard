import { expect, test } from "@playwright/test";
import { gotoDashboard, slotLocator } from "./helpers/dashboard";

type FinancialHealthSample = {
  elapsedMs: number;
  percentText: string;
  percentValue: number;
  gaugeFilledLength: number | null;
  gaugeDasharray: string;
};

function extractGaugeFilledLength(gaugeDasharray: string) {
  const numericStops = gaugeDasharray
    .split(/[ ,]+/)
    .map((entry) => Number(entry))
    .filter((value) => Number.isFinite(value));

  if (numericStops.length === 0) {
    return null;
  }

  return numericStops[0];
}

test.describe("financial health gauge binding", () => {
  test("increments the gauge and the numeric label together over time", async ({ page }) => {
    await gotoDashboard(page);
    await slotLocator(page, "financial-health-card-gauge-wrap").waitFor({ state: "visible" });

    const samples = await page.evaluate(async () => {
        const collectSample = (startTime: number) => {
        const percentNode = document.querySelector<HTMLElement>('[data-slot="financial-health-card-percent"]');
        const gaugeProgressNode = document.querySelector<SVGPathElement>('[data-slot="financial-health-card-gauge-progress"]');
        const percentText = (percentNode?.textContent ?? "").trim();
        const percentValue = Number(percentText.replace(/[^\d.-]/g, "")) || 0;
        const gaugeDasharray = gaugeProgressNode?.getAttribute("stroke-dasharray") ?? "";
        const gaugeFilledLength = gaugeDasharray
          .split(/[ ,]+/)
          .map((entry) => Number(entry))
          .find((value) => Number.isFinite(value)) ?? null;

        return {
          elapsedMs: Math.round(performance.now() - startTime),
          percentText,
          percentValue,
          gaugeFilledLength,
          gaugeDasharray,
        };
      };

      const startTime = performance.now();
      const capturedSamples: FinancialHealthSample[] = [collectSample(startTime)];

      await new Promise<void>((resolve) => {
        const sampleCount = 10;
        let ticks = 0;

        const intervalId = window.setInterval(() => {
          capturedSamples.push(collectSample(startTime));
          ticks += 1;

          if (ticks >= sampleCount) {
            window.clearInterval(intervalId);
            resolve();
          }
        }, 180);
      });

      return capturedSamples;
    });

    const firstSample = samples[0];
    const lastSample = samples[samples.length - 1];
    const expectedFilledLength = Math.PI * 48 * 0.75;
    const percentTrajectory = samples.map((sample) => sample.percentValue);
    const gaugeTrajectory = samples.map((sample) => sample.gaugeFilledLength ?? 0);
    const distinctPercentSteps = new Set(percentTrajectory).size;
    const distinctGaugeSteps = new Set(gaugeTrajectory).size;

    expect(lastSample.percentValue, "Financial health percent should end at 75").toBe(75);
    expect(lastSample.gaugeFilledLength, "Gauge should end at 75% of the semicircle arc length").toBeCloseTo(expectedFilledLength, 0);
    expect(
      firstSample.percentValue,
      `Percent should start below the final value. Samples: ${JSON.stringify(samples, null, 2)}`,
    ).toBeLessThan(lastSample.percentValue);
    expect(
      firstSample.gaugeFilledLength ?? 0,
      `Gauge should start below the final sweep. Samples: ${JSON.stringify(samples, null, 2)}`,
    ).toBeLessThan(lastSample.gaugeFilledLength ?? 0);
    expect(distinctPercentSteps, `Percent should visibly change over time. Samples: ${JSON.stringify(samples, null, 2)}`).toBeGreaterThan(2);
    expect(distinctGaugeSteps, `Gauge should visibly change over time. Samples: ${JSON.stringify(samples, null, 2)}`).toBeGreaterThan(2);
  });

  test("does not respond to manual DOM edits on the percent label alone", async ({ page }) => {
    await gotoDashboard(page);
    await slotLocator(page, "financial-health-card-gauge-wrap").waitFor({ state: "visible" });
    await page.waitForTimeout(3_200);

    const gaugeBeforeMutation = await slotLocator(page, "financial-health-card-gauge-progress").getAttribute("stroke-dasharray");

    await page.evaluate(() => {
      const percentNode = document.querySelector<HTMLElement>('[data-slot="financial-health-card-percent"]');

      if (percentNode) {
        percentNode.textContent = "42%";
      }
    });

    await page.waitForTimeout(250);

    const percentAfterMutation = await slotLocator(page, "financial-health-card-percent").textContent();
    const gaugeAfterMutation = await slotLocator(page, "financial-health-card-gauge-progress").getAttribute("stroke-dasharray");
    const gaugeBeforeFilledLength = extractGaugeFilledLength(gaugeBeforeMutation ?? "");
    const gaugeAfterFilledLength = extractGaugeFilledLength(gaugeAfterMutation ?? "");

    expect(percentAfterMutation?.trim()).toBe("42%");
    expect(
      gaugeAfterMutation,
      "Changing only the DOM text should not change the gauge if the gauge is not bound to that text node.",
    ).toBe(gaugeBeforeMutation);
    expect(gaugeAfterFilledLength).toBe(gaugeBeforeFilledLength);
  });
});
