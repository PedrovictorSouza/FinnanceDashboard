import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const sourcePath = join(process.cwd(), "app/components/dashboard/GoalTrackerCard.module.css");
const cssDir = join(process.cwd(), ".next/static/css");

function fail(message) {
  throw new Error(message);
}

function normalizeCss(value) {
  return value.replace(/\s+/g, "");
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

function getCssFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return getCssFiles(entryPath);
    }

    return entry.name.endsWith(".css") ? [entryPath] : [];
  });
}

function extractSourceRule(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));

  if (!match) {
    fail(`Could not find source rule for ${selector}`);
  }

  return match[1];
}

function extractBuiltRule(css, selectorPrefix) {
  const escaped = selectorPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`\\.[^,{]*${escaped}[^,{]*\\{([^}]*)\\}`));

  if (!match) {
    fail(`Could not find built rule for selector prefix ${selectorPrefix}`);
  }

  return match[1];
}

const sourceCss = readFileSync(sourcePath, "utf8");
const builtCss = getCssFiles(cssDir)
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

const sourceExpectations = [
  {
    selector: ".goal-tracker-card-groups",
    mustContain: ["display: grid;", "gap: 8px;"],
    mustNotContain: ["gap: 20px;", "gap: 25px;", "justify-content: space-between;"],
  },
  {
    selector: ".goal-tracker-card-list",
    mustContain: [
      "display: grid;",
      "grid-auto-rows: max-content;",
      "gap: 4px;",
      "align-content: start;",
      "justify-items: start;",
    ],
    mustNotContain: ["display: flex;", "justify-content: space-between;"],
  },
  {
    selector: ".goal-tracker-card-item-content",
    mustContain: [
      "display: grid;",
      "grid-template-columns: var(--goal-thumb-size) minmax(0, 1fr);",
      "column-gap: var(--goal-item-column-gap);",
      "justify-self: start;",
      "inline-size: max-content;",
    ],
    mustNotContain: ["padding:", "grid-template-columns: 24px minmax(0, 1fr);", "gap: 20px;"],
  },
];

for (const expectation of sourceExpectations) {
  const rule = extractSourceRule(sourceCss, expectation.selector);

  for (const needle of expectation.mustContain) {
    assertContains(rule, needle, `Source ${expectation.selector}`);
  }

  for (const needle of expectation.mustNotContain) {
    assertNotContains(rule, needle, `Source ${expectation.selector}`);
  }
}

const builtExpectations = [
  {
    selectorPrefix: "goal-tracker-card-groups",
    mustContain: ["display: grid;", "gap: 8px;"],
    mustNotContain: ["gap: 20px;", "gap: 25px;", "justify-content: space-between;"],
  },
  {
    selectorPrefix: "goal-tracker-card-list",
    mustContain: [
      "display: grid;",
      "grid-auto-rows: max-content;",
      "gap: 4px;",
      "align-content: start;",
      "justify-items: start;",
    ],
    mustNotContain: ["display: flex;", "justify-content: space-between;"],
  },
  {
    selectorPrefix: "goal-tracker-card-item-content",
    mustContain: [
      "display: grid;",
      "grid-template-columns: var(--goal-thumb-size) minmax(0, 1fr);",
      "column-gap: var(--goal-item-column-gap);",
      "justify-self: start;",
      "inline-size: max-content;",
    ],
    mustNotContain: ["padding:", "grid-template-columns: 24px minmax(0, 1fr);", "gap: 20px;"],
  },
];

for (const expectation of builtExpectations) {
  const rule = extractBuiltRule(builtCss, expectation.selectorPrefix);

  for (const needle of expectation.mustContain) {
    assertContains(rule, needle, `Built ${expectation.selectorPrefix}`);
  }

  for (const needle of expectation.mustNotContain) {
    assertNotContains(rule, needle, `Built ${expectation.selectorPrefix}`);
  }
}

console.log("Dashboard CSS regression checks passed.");
