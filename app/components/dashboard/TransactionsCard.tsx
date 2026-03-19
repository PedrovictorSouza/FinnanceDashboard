import type { DashboardTransactionsCardViewModel } from "../../modules/dashboard/domain/dashboard.types";
import { DisclosureCaret } from "../DisclosureCaret";
import styles from "./TransactionsCard.module.css";

type TransactionsCardProps = {
  copy: DashboardTransactionsCardViewModel;
  componentId: string;
};

const transactionAvatarImages = [
  "/images/transaction/logo1.png",
  "/images/transaction/logo2.png",
  "/images/transaction/logo3.png",
  "/images/transaction/logo4.png",
  "/images/transaction/logo5.png",
  "/images/transaction/logo6.png",
  "/images/transaction/logo7.png",
];

export function TransactionsCard({ copy, componentId }: TransactionsCardProps) {
  return (
    <section
      className="dashboard-slot dashboard-transactions-slot"
      data-component={componentId}
      data-slot="dashboard-transactions-slot"
    >
      <article className={`motion-enter ${styles.card}`} data-slot="transactions-card">
        <header className={styles.header} data-slot="transactions-card-header">
          <h2 className={styles.title} data-slot="transactions-card-title">
            {copy.title}
          </h2>
          <button
            type="button"
            className={styles["period-btn"]}
            data-slot="transactions-card-period-button"
            aria-label={copy.aria.period}
          >
            <span>{copy.period}</span>
            <DisclosureCaret
              className={styles.caret}
              data-slot="transactions-card-caret"
              aria-hidden="true"
            />
          </button>
        </header>

        <div className={styles.content} data-slot="transactions-card-content">
          <div className={styles.columns} data-slot="transactions-card-columns">
            <span>{copy.columns.name}</span>
            <span>{copy.columns.amount}</span>
          </div>

          <ul
            className={styles["transaction-list"]}
            data-slot="transactions-card-list"
            aria-label={copy.aria.list}
          >
            {copy.items.map((item, index) => {
              const avatarIndex = `${(index % 7) + 1}`;
              const avatarImage = transactionAvatarImages[index % transactionAvatarImages.length];
              const toneClassName = item.amountTone === "positive" ? styles.positive : styles.negative;

              return (
                <li
                  key={`${item.name}-${index}`}
                  className={styles["transaction-item"]}
                  data-slot="transactions-card-item"
                >
                  <span
                    className={`${styles["transaction-avatar"]} ${styles[`transaction-avatar-${avatarIndex}` as keyof typeof styles]}`}
                    data-slot="transactions-card-avatar"
                    data-avatar-index={avatarIndex}
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${avatarImage})` }}
                  />

                  <div className={styles["transaction-main"]} data-slot="transactions-card-main">
                    <p className={styles["transaction-name"]} data-slot="transactions-card-name">
                      {item.name}
                    </p>
                    <p className={styles["transaction-date"]} data-slot="transactions-card-date">
                      {item.date}
                    </p>
                  </div>

                  <div className={styles["transaction-meta"]} data-slot="transactions-card-meta">
                    <p
                      className={`${styles["transaction-amount"]} ${toneClassName}`}
                      data-slot="transactions-card-amount"
                    >
                      {item.amount}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </section>
  );
}
