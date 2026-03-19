import type { DashboardDictionary } from "../../lib/i18n";
import styles from "./SpendingLimitCard.module.css";

type SpendingLimitCardProps = {
  copy: DashboardDictionary["spendingCard"];
  componentId: string;
};

export function SpendingLimitCard({ copy, componentId }: SpendingLimitCardProps) {
  return (
    <section
      id="despesas"
      className="dashboard-slot dashboard-spending-slot"
      data-component={componentId}
      data-slot="dashboard-spending-slot"
    >
      <article className={styles.card} data-slot="spending-limit-card">
        <header className={styles.header} data-slot="spending-limit-card-header">
          <div className={styles.heading} data-slot="spending-limit-card-heading">
            <h2 className={styles.title} data-slot="spending-limit-card-title">
              {copy.title}
            </h2>
          </div>

          <button
            type="button"
            className={styles["icon-btn"]}
            data-slot="spending-limit-card-icon-button"
            aria-label={copy.aria.icon}
          >
            <span className={`${styles.icon} upload-area`} data-slot="spending-limit-card-icon" aria-hidden="true" />
          </button>
        </header>

        <div className={styles["slider-wrap"]} data-slot="spending-limit-card-slider" aria-label={copy.aria.slider}>
          <div className={styles["slider-track"]} data-slot="spending-limit-card-slider-track">
            <div
              className={styles["slider-fill"]}
              data-slot="spending-limit-card-slider-fill"
              style={{ width: `${copy.progress}%` }}
            />
          </div>
          <div className={styles["slider-scale"]} data-slot="spending-limit-card-slider-scale">
            <span>{copy.minLabel}</span>
            <span>{copy.maxLabel}</span>
          </div>
        </div>
      </article>
    </section>
  );
}
