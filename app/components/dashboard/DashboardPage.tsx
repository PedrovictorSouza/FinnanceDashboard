import { WalletPanel } from "../WalletPanel";
import type { DashboardPageViewModel } from "../../modules/dashboard/domain/dashboard.types";
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
  viewModel: DashboardPageViewModel;
};

export function DashboardPage({ viewModel }: DashboardPageProps) {
  const {
    locale,
    skipLink,
    sidebar,
    sidebarAria,
    components,
    search,
    topBar,
    languageAriaLabel,
    languageOptions,
    chart,
    verticalCard,
    walletPanel,
    spendingCard,
    variableCard,
    costCard,
    healthCard,
    goalCard,
    transactionCard,
  } = viewModel;

  return (
    <>
      <a className="skip-link" data-slot="dashboard-skip-link" href="#conteudo-principal">
        {skipLink}
      </a>

      <div className="layout-shell" data-slot="dashboard-layout-shell" lang={locale}>
        <DashboardSidebar
          copy={sidebar}
          aria={sidebarAria}
          componentId={components.sidebar}
        />

        <main id="conteudo-principal" className="layout-content" data-slot="dashboard-layout-content">
          <DashboardTopBar
            componentId={components.top}
            search={search}
            topBar={topBar}
            languageAriaLabel={languageAriaLabel}
            languageOptions={languageOptions}
          />

          <DashboardPrimaryGroup
            componentId={components.cardPrimaryGroup}
            chartComponentId={components.cardPrimary}
            verticalComponentId={components.cardVertical}
            chartCopy={chart}
            verticalCopy={verticalCard}
            locale={locale}
          />

          <section
            className="dashboard-slot dashboard-wallet-slot"
            data-component={components.cardRightTop}
            data-slot="dashboard-wallet-slot"
          >
            <WalletPanel copy={walletPanel} />
          </section>

          <SpendingLimitCard
            componentId={components.cardMediumLeft}
            copy={spendingCard}
          />

          <VariableExpensesCard
            componentId={components.cardMediumRight}
            copy={variableCard}
          />

          <CostAnalysisCard componentId={components.cardLarge1} copy={costCard} />

          <FinancialHealthCard componentId={components.cardLarge2} copy={healthCard} />

          <GoalTrackerCard componentId={components.cardLarge3} copy={goalCard} />

          <TransactionsCard
            componentId={components.cardRightBottom}
            copy={transactionCard}
          />
        </main>
      </div>
    </>
  );
}
