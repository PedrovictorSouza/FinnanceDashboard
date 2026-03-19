import type { DashboardVerticalCardViewModel } from "../../modules/dashboard/domain/dashboard.types";
import styles from "./VerticalKpiPanel.module.css";

type VerticalKpiPanelProps = {
  copy: DashboardVerticalCardViewModel;
  componentId: string;
};

export function VerticalKpiPanel({ copy, componentId }: VerticalKpiPanelProps) {
  return (
    <article
      className={`motion-enter-right ${styles["vertical-panel"]}`}
      data-component={componentId}
      data-slot="vertical-kpi-panel"
      aria-labelledby="vertical-kpis-heading"
    >
      <h2 id="vertical-kpis-heading" className="sr-only">
        {copy.aria}
      </h2>

      <ul
        className={styles["vertical-kpis"]}
        data-slot="vertical-kpi-list"
        aria-labelledby="vertical-kpis-heading"
      >
        {copy.items.map((item) => (
          <li key={item.title} className={styles["vertical-kpi-item"]} data-slot="vertical-kpi-item">
            <h3 className={styles["vertical-kpi-title"]} data-slot="vertical-kpi-title">
              {item.title}
            </h3>
            <h1 className={styles["vertical-kpi-value"]} data-slot="vertical-kpi-value">
              {item.subtitle}
            </h1>
            <p className={styles["vertical-kpi-meta"]} data-slot="vertical-kpi-meta">
              <span className={styles["vertical-kpi-icon"]} data-slot="vertical-kpi-icon" aria-hidden="true" />
              <span>{item.support}</span>
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
