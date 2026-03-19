import { BalanceChart } from "../BalanceChart";
import type { DashboardDictionary, LanguageCode } from "../../lib/i18n";
import styles from "./DashboardPrimaryGroup.module.css";
import { VerticalKpiPanel } from "./VerticalKpiPanel";

type DashboardPrimaryGroupProps = {
  componentId: string;
  chartComponentId: string;
  verticalComponentId: string;
  chartCopy: DashboardDictionary["chart"];
  verticalCopy: DashboardDictionary["verticalCard"];
  language: LanguageCode;
};

export function DashboardPrimaryGroup({
  componentId,
  chartComponentId,
  verticalComponentId,
  chartCopy,
  verticalCopy,
  language,
}: DashboardPrimaryGroupProps) {
  return (
    <section
      className={`dashboard-slot dashboard-primary-group-slot ${styles.group}`}
      data-component={componentId}
      data-slot="dashboard-primary-group"
    >
      <div
        className={styles["chart-panel"]}
        data-component={chartComponentId}
        data-slot="dashboard-primary-chart-panel"
      >
        <BalanceChart copy={chartCopy} language={language} />
      </div>

      <VerticalKpiPanel copy={verticalCopy} componentId={verticalComponentId} />
    </section>
  );
}
