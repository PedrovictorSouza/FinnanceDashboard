import type {
  DashboardGoalCardViewModel,
  DashboardGoalItemViewModel,
} from "../../modules/dashboard/domain/dashboard.types";
import styles from "./GoalTrackerCard.module.css";

type GoalTrackerCardProps = {
  copy: DashboardGoalCardViewModel;
  componentId: string;
};

type GoalItem = DashboardGoalItemViewModel & {
  image?: string;
};

type GoalListItemProps = {
  item: GoalItem;
  goalId: string;
  featured?: boolean;
};

function toDomFragment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function GoalListItem({ item, goalId, featured = false }: GoalListItemProps) {
  const titleId = `${goalId}-title`;
  const supportId = `${goalId}-support`;
  const itemClassName = featured
    ? `${styles["goal-tracker-card-item"]} ${styles["goal-tracker-card-item-featured"]}`
    : styles["goal-tracker-card-item"];

  return (
    <li className={itemClassName} data-slot="goal-tracker-card-item">
      <article
        className={styles["goal-tracker-card-item-content"]}
        data-slot="goal-tracker-card-item-content"
        aria-labelledby={titleId}
      >
        <div
          className={styles["goal-tracker-card-thumb"]}
          data-slot="goal-tracker-card-thumb"
          aria-hidden="true"
          style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
        />

        <div className={styles["goal-tracker-card-body"]} data-slot="goal-tracker-card-body">
          <h4
            id={titleId}
            className={styles["goal-tracker-card-item-title"]}
            data-slot="goal-tracker-card-item-title"
          >
            {item.title}
          </h4>

          <p className={styles["goal-tracker-card-amount"]} data-slot="goal-tracker-card-amount">
            <strong>{item.current}</strong>
            <span>/{item.total}</span>
          </p>

          <div
            className={styles["goal-tracker-card-progress-track"]}
            data-slot="goal-tracker-card-progress-track"
            role="progressbar"
            aria-labelledby={titleId}
            aria-describedby={supportId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={item.progress}
            aria-valuetext={`${item.current} / ${item.total}`}
          >
            <span
              className={styles["goal-tracker-card-progress-fill"]}
              data-slot="goal-tracker-card-progress-fill"
              style={{ width: `${item.progress}%` }}
              aria-hidden="true"
            />
          </div>

          <p
            id={supportId}
            className={styles["goal-tracker-card-support"]}
            data-slot="goal-tracker-card-support"
          >
            {item.support}
          </p>
        </div>
      </article>
    </li>
  );
}

export function GoalTrackerCard({ copy, componentId }: GoalTrackerCardProps) {
  const baseId = toDomFragment(componentId) || "goal-tracker-card";
  const titleId = `${baseId}-title`;
  const thisYearId = `${baseId}-this-year`;
  const longTermId = `${baseId}-long-term`;
  const longTermItems = copy.longTerm.items.slice(0, 3);

  return (
    <section
      className="dashboard-slot dashboard-goal-slot"
      data-component={componentId}
      data-slot="dashboard-goal-slot"
    >
      <article
        className={`motion-enter ${styles["goal-tracker-card"]}`}
        data-slot="goal-tracker-card"
        aria-labelledby={titleId}
      >
        <header className={styles["goal-tracker-card-header"]} data-slot="goal-tracker-card-header">
          <h2
            id={titleId}
            className={styles["goal-tracker-card-title"]}
            data-slot="goal-tracker-card-title"
          >
            {copy.title}
          </h2>

          <button
            type="button"
            className={styles["goal-tracker-card-add-button"]}
            data-slot="goal-tracker-card-add-button"
            aria-label={copy.aria.add}
          >
            {copy.addCta}
          </button>
        </header>

        <div className={styles["goal-tracker-card-groups"]} data-slot="goal-tracker-card-groups">
          <section
            className={styles["goal-tracker-card-group"]}
            data-slot="goal-tracker-card-group"
            aria-labelledby={thisYearId}
          >
            <h3
              id={thisYearId}
              className={styles["goal-tracker-card-group-title"]}
              data-slot="goal-tracker-card-group-title"
            >
              {copy.thisYear.label}
            </h3>

            <ul
              className={styles["goal-tracker-card-list"]}
              data-slot="goal-tracker-card-list"
              aria-labelledby={thisYearId}
            >
              <GoalListItem
                item={copy.thisYear.item}
                goalId={`${thisYearId}-${toDomFragment(copy.thisYear.item.title)}`}
                featured
              />
            </ul>
          </section>

          <section
            className={`${styles["goal-tracker-card-group"]} ${styles["goal-tracker-card-group-scrollable"]}`}
            data-slot="goal-tracker-card-group-scrollable"
            aria-labelledby={longTermId}
          >
            <h3
              id={longTermId}
              className={styles["goal-tracker-card-group-title"]}
              data-slot="goal-tracker-card-group-title"
            >
              {copy.longTerm.label}
            </h3>

            <ul
              className={`${styles["goal-tracker-card-list"]} ${styles["goal-tracker-card-list-scrollable"]}`}
              data-slot="goal-tracker-card-list-scrollable"
              aria-labelledby={longTermId}
            >
              {longTermItems.map((item, index) => (
                <GoalListItem
                  key={`${item.title}-${index}`}
                  item={item}
                  goalId={`${longTermId}-${index}-${toDomFragment(item.title)}`}
                />
              ))}
            </ul>
          </section>
        </div>
      </article>
    </section>
  );
}
