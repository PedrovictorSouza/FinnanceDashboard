import styles from "./BalanceChart.module.css";

const placeholderBars = [52, 44, 60, 72, 54, 66, 78];

export function BalanceChartCanvasFallback() {
  return (
    <div
      className={styles["chart-placeholder"]}
      data-slot="balance-chart-placeholder"
      aria-hidden="true"
    >
      <div className={styles["chart-placeholder-grid"]}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles["chart-placeholder-bars"]}>
        {placeholderBars.map((height, index) => (
          <span
            key={height + index}
            className={styles["chart-placeholder-bar"]}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
