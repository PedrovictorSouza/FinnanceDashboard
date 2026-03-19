import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const appDir = join(process.cwd(), "app");

const rules = [
  {
    id: "no-implicit-fill-row",
    description:
      "Evite `grid-template-rows: auto minmax(0, 1fr)` em componentes. Esse padrao costuma esconder o verdadeiro dono do spacing e dificulta manutencao.",
    matches: ({ property, value }) =>
      property === "grid-template-rows" && normalizeSpaces(value) === "auto minmax(0, 1fr)",
  },
  {
    id: "no-max-content-inline-size",
    description:
      "Evite `inline-size: max-content` em layout de componentes. Esse padrao costuma gerar sizing dificil de prever e inspecionar.",
    matches: ({ property, value }) =>
      property === "inline-size" && normalizeSpaces(value) === "max-content",
  },
  {
    id: "no-axis-mixed-overflow",
    description:
      "Evite `overflow: hidden auto` ou `overflow: auto hidden`. Prefira declarar os eixos explicitamente para deixar o scroll claro no inspect.",
    matches: ({ property, value }) =>
      property === "overflow" &&
      ["hidden auto", "auto hidden"].includes(normalizeSpaces(value)),
  },
];

const legacyAllowlist = [
  {
    file: "app/components/dashboard/GoalTrackerCard.module.css",
    selector: ".goal-tracker-card",
    ruleId: "no-implicit-fill-row",
    reason: "Legado do card de metas; precisa refactor estrutural antes de remover.",
  },
  {
    file: "app/components/dashboard/GoalTrackerCard.module.css",
    selector: ".goal-tracker-card-groups",
    ruleId: "no-implicit-fill-row",
    reason: "Legado do card de metas; precisa refactor estrutural antes de remover.",
  },
  {
    file: "app/components/dashboard/GoalTrackerCard.module.css",
    selector: ".goal-tracker-card-group",
    ruleId: "no-implicit-fill-row",
    reason: "Legado do card de metas; precisa refactor estrutural antes de remover.",
  },
  {
    file: "app/components/dashboard/GoalTrackerCard.module.css",
    selector: ".goal-tracker-card-item-content",
    ruleId: "no-max-content-inline-size",
    reason: "Legado do card de metas; precisa refactor estrutural antes de remover.",
  },
  {
    file: "app/components/dashboard/TransactionsCard.module.css",
    selector: ".card",
    ruleId: "no-implicit-fill-row",
    reason: "Card legado do dashboard ainda usa preenchimento vertical implicito.",
  },
  {
    file: "app/components/dashboard/TransactionsCard.module.css",
    selector: ".content",
    ruleId: "no-implicit-fill-row",
    reason: "Card legado do dashboard ainda usa preenchimento vertical implicito.",
  },
  {
    file: "app/components/dashboard/TransactionsCard.module.css",
    selector: ".transaction-list",
    ruleId: "no-axis-mixed-overflow",
    reason: "Scroll legado do card de transacoes ainda nao foi normalizado.",
  },
  {
    file: "app/components/dashboard/SpendingLimitCard.module.css",
    selector: ".card",
    ruleId: "no-implicit-fill-row",
    reason: "Card legado do dashboard ainda usa preenchimento vertical implicito.",
  },
  {
    file: "app/components/WalletPanel.module.css",
    selector: ".wallet-shortcuts",
    ruleId: "no-axis-mixed-overflow",
    reason: "Lista legado do wallet ainda usa sintaxe abreviada de overflow.",
  },
];

function getCssFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return getCssFiles(entryPath);
    }

    return entry.name.endsWith(".css") ? [entryPath] : [];
  });
}

function normalizeSpaces(value) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanSelector(value) {
  return normalizeSpaces(value.replace(/\s*\{$/, ""));
}

function hasInlineDisable(lines, lineNumber, ruleId) {
  const min = Math.max(0, lineNumber - 3);
  const pattern = new RegExp(`layout-lint-disable-next-line\\s+${ruleId}\\b`);

  for (let index = lineNumber - 2; index >= min; index -= 1) {
    if (pattern.test(lines[index])) {
      return true;
    }

    if (lines[index].includes("{")) {
      break;
    }
  }

  return false;
}

function isAllowlisted(file, selector, ruleId) {
  return legacyAllowlist.some(
    (entry) => entry.file === file && entry.selector === selector && entry.ruleId === ruleId,
  );
}

function parseCssFile(filePath) {
  const relativePath = relative(process.cwd(), filePath);
  const css = readFileSync(filePath, "utf8");
  const lines = css.split("\n");
  const violations = [];
  const stack = [];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line || line.startsWith("/*") || line.startsWith("*")) {
      continue;
    }

    if (line.endsWith("{")) {
      const selector = cleanSelector(line);
      stack.push(selector);
      continue;
    }

    if (line.startsWith("}")) {
      stack.pop();
      continue;
    }

    const match = line.match(/^([a-z-]+)\s*:\s*(.+);$/);

    if (!match || stack.length === 0) {
      continue;
    }

    const [, property, value] = match;
    const selector = stack[stack.length - 1];
    const declaration = {
      file: relativePath,
      selector,
      property,
      value,
      line: index + 1,
    };

    for (const rule of rules) {
      if (!rule.matches(declaration)) {
        continue;
      }

      if (hasInlineDisable(lines, declaration.line, rule.id)) {
        continue;
      }

      if (isAllowlisted(relativePath, selector, rule.id)) {
        continue;
      }

      violations.push({
        ...declaration,
        ruleId: rule.id,
        description: rule.description,
      });
    }
  }

  return violations;
}

const files = getCssFiles(appDir);
const violations = files.flatMap(parseCssFile);

if (violations.length > 0) {
  console.error("Layout lint encontrou padroes proibidos.\n");

  for (const violation of violations) {
    console.error(
      `- [${violation.ruleId}] ${violation.file}:${violation.line}\n` +
        `  selector: ${violation.selector}\n` +
        `  declaracao: ${violation.property}: ${violation.value};\n` +
        `  motivo: ${violation.description}\n`,
    );
  }

  console.error(
    "Se houver excecao legitima, adicione um comentario local no CSS:\n" +
      "/* layout-lint-disable-next-line <rule-id> -- motivo objetivo */\n",
  );

  process.exit(1);
}

console.log("Layout structural lint passed.");
