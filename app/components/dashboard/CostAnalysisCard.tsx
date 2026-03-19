import type { DashboardDictionary } from "../../lib/i18n";
import styles from "./CostAnalysisCard.module.css";

type CostAnalysisCardProps = {
  copy: DashboardDictionary["costCard"];
  componentId: string;
};

export function CostAnalysisCard({ copy, componentId }: CostAnalysisCardProps) {
  return (
    <section
      id="metas"
      className="dashboard-slot dashboard-cost-slot"
      data-component={componentId}
      data-slot="dashboard-cost-slot"
    >
      <article className={styles.card} data-slot="cost-analysis-card">
        <header className={styles.header} data-slot="cost-analysis-card-header">
          <div data-slot="cost-analysis-card-heading">
            <h2 className={styles.title} data-slot="cost-analysis-card-title">
              {copy.title}
            </h2>
            <p className={styles.subtitle} data-slot="cost-analysis-card-subtitle">
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            className={styles["period-btn"]}
            data-slot="cost-analysis-card-period-button"
            aria-label={copy.aria.period}
          >
            <span>{copy.period}</span>
            <span className={styles.caret} data-slot="cost-analysis-card-caret" aria-hidden="true">
              v
            </span>
          </button>
        </header>

        <h1 className={styles.value} data-slot="cost-analysis-card-value">
          {copy.value}
        </h1>

        <div className={styles.segments} data-slot="cost-analysis-card-segments" aria-label={copy.aria.segments}>
          {copy.segments.map((segment, index) => (
            <span
              key={`${segment}-${index}`}
              className={styles.segment}
              data-slot="cost-analysis-card-segment"
              style={{ flexGrow: segment }}
            />
          ))}
        </div>

        <ul className={styles.breakdown} data-slot="cost-analysis-card-breakdown" aria-label={copy.aria.breakdown}>
          {copy.categories.map((item) => (
            <li key={item.label} data-slot="cost-analysis-card-breakdown-item">
              <span className={styles["breakdown-left"]} data-slot="cost-analysis-card-breakdown-left">
                <span
                  className={styles.dot}
                  data-slot="cost-analysis-card-dot"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </span>
              <strong>{item.percent}</strong>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
