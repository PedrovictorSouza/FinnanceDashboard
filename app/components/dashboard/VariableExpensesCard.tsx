import type { DashboardVariableCardViewModel } from "../../modules/dashboard/domain/dashboard.types";
import styles from "./VariableExpensesCard.module.css";

type VariableExpensesCardProps = {
  copy: DashboardVariableCardViewModel;
  componentId: string;
};

export function VariableExpensesCard({ copy, componentId }: VariableExpensesCardProps) {
  return (
    <section
      className="dashboard-slot dashboard-variable-slot"
      data-component={componentId}
      data-slot="dashboard-variable-slot"
    >
      <article className={`motion-enter ${styles.card}`} data-slot="variable-expenses-card">
        <div className={styles.heading} data-slot="variable-expenses-card-heading">
          <h2 className={styles.title} data-slot="variable-expenses-card-title">
            {copy.title}
          </h2>
        </div>

        <div
          className={styles.summary}
          data-slot="variable-expenses-card-summary"
          aria-label={copy.aria.summary}
        >
          <strong className={styles["summary-value"]} data-slot="variable-expenses-card-summary-value">
            {copy.totalValue}
          </strong>
          <span className={styles["summary-change"]} data-slot="variable-expenses-card-summary-change">
            {copy.totalLabel} · {copy.delta}
          </span>
        </div>
      </article>
    </section>
  );
}
