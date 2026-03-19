import type { DashboardDictionary } from "../../lib/i18n";
import styles from "./VariableExpensesCard.module.css";

type VariableExpensesCardProps = {
  copy: DashboardDictionary["variableCard"];
  componentId: string;
};

export function VariableExpensesCard({ copy, componentId }: VariableExpensesCardProps) {
  return (
    <section
      className="dashboard-slot dashboard-variable-slot"
      data-component={componentId}
      data-slot="dashboard-variable-slot"
    >
      <article className={styles.card} data-slot="variable-expenses-card">
        <h2 className={styles.title} data-slot="variable-expenses-card-title">
          {copy.title}
        </h2>
        <button
          type="button"
          className={styles.button}
          data-slot="variable-expenses-card-button"
          aria-label={copy.aria.readMore}
        >
          {copy.cta}
        </button>
      </article>
    </section>
  );
}
