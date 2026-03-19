import { expect, test } from "@playwright/test";
import {
  animatedRootSlots,
  collectSlotReport,
  collectHiddenDescendantDiagnostics,
  criticalSlots,
  dumpSlotDiagnostics,
  expectSlotToContainText,
  expectSlotToRender,
  gotoDashboard,
  slotLocator,
  waitForDashboardStable,
} from "./helpers/dashboard";

test.describe("dashboard render diagnostics", () => {
  test("renders the dashboard shell and critical cards with visible content", async ({ page }) => {
    await gotoDashboard(page);
    await waitForDashboardStable(page);

    for (const slot of criticalSlots) {
      await expectSlotToRender(page, slot);
    }

    const textSlots = [
      "dashboard-top-bar",
      "balance-chart",
      "wallet-panel",
      "spending-limit-card",
      "variable-expenses-card",
      "cost-analysis-card",
      "financial-health-card",
      "goal-tracker-card",
      "transactions-card",
    ] as const;

    for (const slot of textSlots) {
      await expectSlotToContainText(page, slot);
    }

    await expect(slotLocator(page, "dashboard-layout-content")).toBeVisible();
  });

  test("keeps animated dashboard descendants visible after the page settles", async ({ page }) => {
    await gotoDashboard(page);
    await waitForDashboardStable(page);

    const offenders: Array<{ root: string; descendants: unknown[] }> = [];

    for (const slot of animatedRootSlots) {
      const root = slotLocator(page, slot);

      if ((await root.count()) === 0) {
        continue;
      }

      const rootReport = await collectSlotReport(page, slot);

      if (
        rootReport.display === "none" ||
        rootReport.visibility === "hidden" ||
        rootReport.width === 0 ||
        rootReport.height === 0
      ) {
        continue;
      }

      const descendants = await collectHiddenDescendantDiagnostics(page, slot);

      if (descendants.length > 0) {
        offenders.push({ root: slot, descendants });
      }
    }

    if (offenders.length > 0) {
      await dumpSlotDiagnostics(
        page,
        [...new Set(offenders.map((entry) => entry.root).concat(criticalSlots as unknown as string[]))],
      );
    }

    expect(offenders).toEqual([]);
  });

  test("renders content when reduced motion disables animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoDashboard(page);
    await waitForDashboardStable(page);

    for (const slot of criticalSlots) {
      await expectSlotToRender(page, slot);
    }

    const invisibleRoots: string[] = [];

    for (const slot of animatedRootSlots) {
      const root = slotLocator(page, slot);

      if ((await root.count()) === 0) {
        continue;
      }

      const rootReport = await collectSlotReport(page, slot);

      if (
        rootReport.display === "none" ||
        rootReport.visibility === "hidden" ||
        rootReport.width === 0 ||
        rootReport.height === 0
      ) {
        continue;
      }

      const diagnostics = await collectHiddenDescendantDiagnostics(page, slot);

      if (diagnostics.length > 0) {
        invisibleRoots.push(`${slot}: ${JSON.stringify(diagnostics, null, 2)}`);
      }
    }

    expect(invisibleRoots).toEqual([]);
  });
});
