import { WalletPanel } from "../WalletPanel";
import { languageLocales, languages, type DashboardDictionary, type LanguageCode } from "../../lib/i18n";
import { CostAnalysisCard } from "./CostAnalysisCard";
import { DashboardPrimaryGroup } from "./DashboardPrimaryGroup";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { FinancialHealthCard } from "./FinancialHealthCard";
import { GoalTrackerCard } from "./GoalTrackerCard";
import { SpendingLimitCard } from "./SpendingLimitCard";
import { TransactionsCard } from "./TransactionsCard";
import { VariableExpensesCard } from "./VariableExpensesCard";

type DashboardPageProps = {
  language: LanguageCode;
  copy: DashboardDictionary;
};

function getLanguageHref(language: LanguageCode) {
  return language === "PT" ? "/" : `/?lang=${language}`;
}

export function DashboardPage({ language, copy }: DashboardPageProps) {
  const languageOptions = languages.map((code) => ({
    code,
    href: getLanguageHref(code),
    label: copy.languageButtons[code],
    isCurrent: code === language,
  }));

  return (
    <>
      <a className="skip-link" data-slot="dashboard-skip-link" href="#conteudo-principal">
        {copy.skipLink}
      </a>

      <div className="layout-shell" data-slot="dashboard-layout-shell" lang={languageLocales[language]}>
        <DashboardSidebar
          copy={copy.sidebar}
          aria={{ sidebar: copy.aria.sidebar, mainNav: copy.aria.mainNav }}
          componentId={copy.components.sidebar}
        />

        <main id="conteudo-principal" className="layout-content" data-slot="dashboard-layout-content">
          <DashboardTopBar
            componentId={copy.components.top}
            search={copy.search}
            topBar={copy.topBar}
            languageAriaLabel={copy.aria.language}
            languageOptions={languageOptions}
          />

          <DashboardPrimaryGroup
            componentId={copy.components.cardPrimaryGroup}
            chartComponentId={copy.components.cardPrimary}
            verticalComponentId={copy.components.cardVertical}
            chartCopy={copy.chart}
            verticalCopy={copy.verticalCard}
            language={language}
          />

          <section
            className="dashboard-slot dashboard-wallet-slot"
            data-component={copy.components.cardRightTop}
            data-slot="dashboard-wallet-slot"
          >
            <WalletPanel copy={copy.walletPanel} />
          </section>

          <SpendingLimitCard
            componentId={copy.components.cardMediumLeft}
            copy={copy.spendingCard}
          />

          <VariableExpensesCard
            componentId={copy.components.cardMediumRight}
            copy={copy.variableCard}
          />

          <CostAnalysisCard componentId={copy.components.cardLarge1} copy={copy.costCard} />

          <FinancialHealthCard componentId={copy.components.cardLarge2} copy={copy.healthCard} />

          <GoalTrackerCard componentId={copy.components.cardLarge3} copy={copy.goalCard} />

          <TransactionsCard
            componentId={copy.components.cardRightBottom}
            copy={copy.transactionCard}
          />
        </main>
      </div>
    </>
  );
}
