import { readFileSync } from "node:fs";
import { join } from "node:path";

const sourcePath = join(process.cwd(), "app/components/WalletPanel.module.css");
const css = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(message);
}

function normalizeCss(value) {
  return value.replace(/\s+/g, "");
}

function extractFirstRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));

  if (!match) {
    fail(`Could not find source rule for ${selector}`);
  }

  return match[1];
}

function assertContains(haystack, needle, context) {
  if (!normalizeCss(haystack).includes(normalizeCss(needle))) {
    fail(`${context} must include "${needle}"`);
  }
}

function assertNotContains(haystack, needle, context) {
  if (normalizeCss(haystack).includes(normalizeCss(needle))) {
    fail(`${context} must not include "${needle}"`);
  }
}

const walletPanelRule = extractFirstRule(css, ".wallet-panel");

assertContains(walletPanelRule, "gap: 17px;", "WalletPanel source rule");
assertNotContains(walletPanelRule, "gap: 8px;", "WalletPanel source rule");

console.log("WalletPanel CSS regression check passed.");
