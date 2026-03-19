import type { DashboardDictionary, LanguageCode } from "../../../lib/i18n";
import type { BalanceChartViewModel } from "../../balance-chart/domain/balance-chart.types";

export type DashboardSidebarViewModel = DashboardDictionary["sidebar"];
export type DashboardSidebarAriaViewModel = Pick<DashboardDictionary["aria"], "sidebar" | "mainNav">;
export type DashboardSearchViewModel = DashboardDictionary["search"];
export type DashboardTopBarViewModel = DashboardDictionary["topBar"];
export type DashboardChartViewModel = BalanceChartViewModel;
export type DashboardWalletPanelViewModel = DashboardDictionary["walletPanel"];
export type DashboardVerticalCardViewModel = DashboardDictionary["verticalCard"];
export type DashboardSpendingCardViewModel = DashboardDictionary["spendingCard"];
export type DashboardVariableCardViewModel = DashboardDictionary["variableCard"];
export type DashboardHealthCardViewModel = DashboardDictionary["healthCard"];
export type DashboardCostCardViewModel = DashboardDictionary["costCard"];
export type DashboardGoalCardViewModel = DashboardDictionary["goalCard"];
export type DashboardGoalItemViewModel = DashboardDictionary["goalCard"]["thisYear"]["item"];
export type DashboardTransactionsCardViewModel = DashboardDictionary["transactionCard"];
export type DashboardComponentIdsViewModel = DashboardDictionary["components"];

export type DashboardLanguageOptionViewModel = {
  code: LanguageCode;
  href: string;
  label: string;
  isCurrent: boolean;
};

export type DashboardPageViewModel = {
  language: LanguageCode;
  locale: string;
  skipLink: string;
  languageAriaLabel: DashboardDictionary["aria"]["language"];
  languageOptions: DashboardLanguageOptionViewModel[];
  sidebarAria: DashboardSidebarAriaViewModel;
  components: DashboardComponentIdsViewModel;
  sidebar: DashboardSidebarViewModel;
  search: DashboardSearchViewModel;
  topBar: DashboardTopBarViewModel;
  chart: DashboardChartViewModel;
  walletPanel: DashboardWalletPanelViewModel;
  verticalCard: DashboardVerticalCardViewModel;
  spendingCard: DashboardSpendingCardViewModel;
  variableCard: DashboardVariableCardViewModel;
  healthCard: DashboardHealthCardViewModel;
  costCard: DashboardCostCardViewModel;
  goalCard: DashboardGoalCardViewModel;
  transactionCard: DashboardTransactionsCardViewModel;
};
