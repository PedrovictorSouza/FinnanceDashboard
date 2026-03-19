import { expect, type Locator, type Page } from "@playwright/test";

export const criticalSlots = [
  "dashboard-layout-shell",
  "dashboard-layout-content",
  "dashboard-top-bar",
  "dashboard-primary-group",
  "balance-chart",
  "wallet-panel",
  "spending-limit-card",
  "variable-expenses-card",
  "cost-analysis-card",
  "financial-health-card",
  "goal-tracker-card",
  "transactions-card",
] as const;

export const animatedRootSlots = [
  "balance-chart",
  "wallet-panel",
  "spending-limit-card",
  "variable-expenses-card",
  "cost-analysis-card",
  "financial-health-card",
  "goal-tracker-card",
  "transactions-card",
  "vertical-kpi-panel",
  "dashboard-sidebar",
] as const;

type SlotReport = {
  slot: string;
  text: string;
  width: number;
  height: number;
  display: string;
  visibility: string;
  opacity: string;
  color: string;
  filter: string;
  transform: string;
};

export function slotLocator(page: Page, slot: string): Locator {
  return page.locator(`[data-slot="${slot}"]`);
}

export async function gotoDashboard(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

export async function waitForDashboardStable(page: Page) {
  await slotLocator(page, "dashboard-layout-content").waitFor({ state: "visible" });
  // The dashboard staggers child animations with up to ~1.8s total delay+duration.
  // Give the page enough time to settle before diagnosing invisible descendants.
  await page.waitForTimeout(2_600);
}

export async function collectSlotReport(page: Page, slot: string): Promise<SlotReport> {
  return await slotLocator(page, slot).evaluate((element, currentSlot) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();

    return {
      slot: currentSlot,
      text,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      color: style.color,
      filter: style.filter,
      transform: style.transform,
    };
  }, slot);
}

export async function expectSlotToRender(page: Page, slot: string) {
  const locator = slotLocator(page, slot);

  await expect(locator, `${slot} should exist`).toHaveCount(1);

  const report = await collectSlotReport(page, slot);

  expect(report.width, `${slot} width should be positive`).toBeGreaterThan(0);
  expect(report.height, `${slot} height should be positive`).toBeGreaterThan(0);
  expect(report.display, `${slot} should not be display:none`).not.toBe("none");
  expect(report.visibility, `${slot} should not be hidden`).not.toBe("hidden");
  expect(report.opacity, `${slot} should not be fully transparent`).not.toBe("0");
}

export async function expectSlotToContainText(page: Page, slot: string) {
  const report = await collectSlotReport(page, slot);
  expect(report.text.length, `${slot} should have text content`).toBeGreaterThan(0);
}

export async function collectHiddenDescendantDiagnostics(page: Page, slot: string) {
  return await slotLocator(page, slot).evaluate((root) => {
    const descendants = [...root.querySelectorAll<HTMLElement>("[data-slot]")];

    return descendants
      .map((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();

        return {
          slot: element.dataset.slot ?? "",
          text,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          filter: style.filter,
          transform: style.transform,
        };
      })
      .filter((entry) => {
        const hasRenderableArea = entry.width > 0 && entry.height > 0;
        const hasRelevantText = entry.text.length > 0;
        const isInvisible =
          entry.display === "none" ||
          entry.visibility === "hidden" ||
          entry.opacity === "0";

        return isInvisible && (hasRenderableArea || hasRelevantText);
      });
  });
}

export async function dumpSlotDiagnostics(page: Page, slots: readonly string[]) {
  const reports = await Promise.all(slots.map((slot) => collectSlotReport(page, slot)));
  console.table(reports);
}
