import { readFileSync } from "node:fs";
import { join } from "node:path";

const sourcePath = join(process.cwd(), "app/components/dashboard/VerticalKpiPanel.module.css");
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

const verticalKpisRule = extractFirstRule(css, ".vertical-kpis");

assertContains(verticalKpisRule, "gap: 30px;", "VerticalKpiPanel source rule");
assertNotContains(verticalKpisRule, "gap: 4px;", "VerticalKpiPanel source rule");

console.log("VerticalKpiPanel CSS regression check passed.");
