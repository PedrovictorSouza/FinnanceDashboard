"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { DisclosureCaret } from "../../../components/DisclosureCaret";
import type { BalanceChartViewModel } from "../domain/balance-chart.types";
import { BalanceChartCanvasFallback } from "./BalanceChartCanvasFallback";
import styles from "./BalanceChart.module.css";

type BalanceChartProps = {
  copy: BalanceChartViewModel;
  locale: string;
};

const LazyBalanceChartCanvasSurface = dynamic(
  () =>
    import("./BalanceChartCanvasSurface").then(
      ({ BalanceChartCanvasSurface }) => BalanceChartCanvasSurface,
    ),
  {
    loading: () => <BalanceChartCanvasFallback />,
  },
);

export function BalanceChart({ copy, locale }: BalanceChartProps) {
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [shouldLoadCanvas, setShouldLoadCanvas] = useState(false);

  useEffect(() => {
    const canvasViewport = canvasViewportRef.current;

    if (!canvasViewport) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoadCanvas(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setShouldLoadCanvas(true);
        observer.disconnect();
      },
      {
        rootMargin: "160px 0px",
      },
    );

    observer.observe(canvasViewport);

    return () => observer.disconnect();
  }, []);

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
            <span className={styles.icon} aria-hidden="true">
              <img src="/icons/ui/arrow.svg" alt="" />
            </span>
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

      <div
        ref={canvasViewportRef}
        className={styles["balance-canvas"]}
        data-slot="balance-chart-canvas"
      >
        {shouldLoadCanvas ? (
          <LazyBalanceChartCanvasSurface copy={copy} locale={locale} />
        ) : (
          <BalanceChartCanvasFallback />
        )}
      </div>
    </article>
  );
}
