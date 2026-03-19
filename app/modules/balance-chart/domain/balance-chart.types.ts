export type BalanceChartLegend = {
  savings: string;
  income: string;
  expenses: string;
};

export type BalanceChartAria = {
  chart: string;
  range: string;
  controls: string;
  legend: string;
};

export type BalanceChartViewModel = {
  total: string;
  subtitle: string;
  rangeLabel: string;
  legend: BalanceChartLegend;
  days: string[];
  tooltipDate: string;
  aria: BalanceChartAria;
};
