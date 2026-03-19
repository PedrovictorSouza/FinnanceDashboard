import { expect, test } from "@playwright/test";
import { gotoDashboard, slotLocator, waitForDashboardStable } from "./helpers/dashboard";

test.describe("dashboard visual regression", () => {
  test("matches the dashboard content snapshot on desktop", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Snapshots are maintained for Chromium only.");

    await gotoDashboard(page);
    await waitForDashboardStable(page);

    await expect(slotLocator(page, "dashboard-layout-content")).toHaveScreenshot(
      "dashboard-layout-content-desktop.png",
      {
        animations: "disabled",
      },
    );
  });

  test("matches the dashboard content snapshot with reduced motion", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Snapshots are maintained for Chromium only.");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoDashboard(page);
    await waitForDashboardStable(page);

    await expect(slotLocator(page, "dashboard-layout-content")).toHaveScreenshot(
      "dashboard-layout-content-reduced-motion.png",
      {
        animations: "disabled",
      },
    );
  });
});
