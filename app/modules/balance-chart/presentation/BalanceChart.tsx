"use client";

import { ParentSize } from "@visx/responsive";
import { DisclosureCaret } from "../../../components/DisclosureCaret";
import type { BalanceChartViewModel } from "../domain/balance-chart.types";
import { BalanceChartCanvas } from "./BalanceChartCanvas";
import styles from "./BalanceChart.module.css";

type BalanceChartProps = {
  copy: BalanceChartViewModel;
  locale: string;
};

export function BalanceChart({ copy, locale }: BalanceChartProps) {
  return (
    <article className={`motion-enter-soft ${styles["balance-chart"]}`} data-slot="balance-chart">
      <header className={styles["balance-chart-header"]} data-slot="balance-chart-header">
        <div className={styles["balance-summary"]} data-slot="balance-chart-summary">
          <p className={styles["balance-total"]} data-slot="balance-chart-total">
            {copy.total}
          </p>
        </div>

        <div className={styles["balance-controls"]} data-slot="balance-chart-controls">
          <button
            type="button"
            className={styles["range-btn"]}
            data-slot="balance-chart-range-button"
            aria-label={copy.aria.range}
          >
            <span>{copy.rangeLabel}</span>
            <DisclosureCaret
              className={styles.caret}
              data-slot="balance-chart-caret"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className={styles["icon-btn"]}
            data-slot="balance-chart-controls-button"
            aria-label={copy.aria.controls}
          >
            <span aria-hidden="true">|||</span>
          </button>
        </div>

        <p className={styles["balance-overview"]} data-slot="balance-chart-overview">
          {copy.subtitle}
        </p>

        <div
          className={styles["balance-legend"]}
          data-slot="balance-chart-legend"
          aria-label={copy.aria.legend}
        >
          <span>
            <i className={`${styles.dot} ${styles.savings}`} />
            {copy.legend.savings}
          </span>
          <span>
            <i className={`${styles.dot} ${styles.income}`} />
            {copy.legend.income}
          </span>
          <span>
            <i className={`${styles.dot} ${styles.expenses}`} />
            {copy.legend.expenses}
          </span>
        </div>
      </header>

      <div className={styles["balance-canvas"]} data-slot="balance-chart-canvas">
        <ParentSize initialSize={{ width: 640, height: 220 }}>
          {({ width, height }) => (
            <BalanceChartCanvas
              width={Math.max(width, 240)}
              height={Math.max(height, 170)}
              copy={copy}
              locale={locale}
            />
          )}
        </ParentSize>
      </div>
    </article>
  );
}
