import { BalanceChart } from "../../modules/balance-chart/presentation/BalanceChart";
import type {
  DashboardChartViewModel,
  DashboardVerticalCardViewModel,
} from "../../modules/dashboard/domain/dashboard.types";
import styles from "./DashboardPrimaryGroup.module.css";
import { VerticalKpiPanel } from "./VerticalKpiPanel";

type DashboardPrimaryGroupProps = {
  componentId: string;
  chartComponentId: string;
  verticalComponentId: string;
  chartCopy: DashboardChartViewModel;
  verticalCopy: DashboardVerticalCardViewModel;
  locale: string;
};

export function DashboardPrimaryGroup({
  componentId,
  chartComponentId,
  verticalComponentId,
  chartCopy,
  verticalCopy,
  locale,
}: DashboardPrimaryGroupProps) {
  return (
    <section
      className={`dashboard-slot dashboard-primary-group-slot motion-enter-soft ${styles.group}`}
      data-component={componentId}
      data-slot="dashboard-primary-group"
    >
      <div
        className={styles["chart-panel"]}
        data-component={chartComponentId}
        data-slot="dashboard-primary-chart-panel"
      >
        <BalanceChart copy={chartCopy} locale={locale} />
      </div>

      <VerticalKpiPanel copy={verticalCopy} componentId={verticalComponentId} />
    </section>
  );
}
