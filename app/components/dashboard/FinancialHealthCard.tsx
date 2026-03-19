"use client";

import type { DashboardHealthCardViewModel } from "../../modules/dashboard/domain/dashboard.types";
import { DisclosureCaret } from "../DisclosureCaret";
import { useAnimatedNumber } from "./animatedMetrics";
import styles from "./FinancialHealthCard.module.css";

type FinancialHealthCardProps = {
  copy: DashboardHealthCardViewModel;
  componentId: string;
};

export function FinancialHealthCard({ copy, componentId }: FinancialHealthCardProps) {
  const animatedPercent = useAnimatedNumber(copy.percent, {
    delay: 330,
    duration: 1_020,
  });
  const displayedPercent = Math.round(animatedPercent);
  const normalizedPercent = Math.min(100, Math.max(0, animatedPercent));
  const healthGaugeDeg = normalizedPercent * 1.8;
  const accentSplitDeg = Math.max(0, healthGaugeDeg * 0.45);

  return (
    <section
      className="dashboard-slot dashboard-health-slot"
      data-component={componentId}
      data-slot="dashboard-health-slot"
    >
      <article className={`motion-enter-soft ${styles.card}`} data-slot="financial-health-card">
        <header className={styles.header} data-slot="financial-health-card-header">
          <div data-slot="financial-health-card-heading">
            <h2 className={styles.title} data-slot="financial-health-card-title">
              {copy.title}
            </h2>
            <p className={styles.subtitle} data-slot="financial-health-card-subtitle">
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            className={styles["period-btn"]}
            data-slot="financial-health-card-period-button"
            aria-label={copy.aria.period}
          >
            <span>{copy.period}</span>
            <DisclosureCaret
              className={styles.caret}
              data-slot="financial-health-card-caret"
              aria-hidden="true"
            />
          </button>
        </header>

        <div className={styles.summary} data-slot="financial-health-card-summary">
          <h1 className={styles.value} data-slot="financial-health-card-value">
            {copy.value}
          </h1>
          <p className={styles.growth} data-slot="financial-health-card-growth">
            <span className={styles["growth-icon"]} data-slot="financial-health-card-growth-icon" aria-hidden="true" />
            <span>{copy.change}</span>
          </p>
        </div>

        <div
          className={styles["gauge-wrap"]}
          data-slot="financial-health-card-gauge-wrap"
          aria-label={copy.aria.gauge}
        >
          <div
            className={styles.gauge}
            data-slot="financial-health-card-gauge"
            style={{
              background: `conic-gradient(
                from 180deg at 50% 100%,
                #d7e95a 0deg ${accentSplitDeg}deg,
                #95cb4f ${accentSplitDeg}deg ${healthGaugeDeg}deg,
                #e3e3e3 ${healthGaugeDeg}deg 180deg
              )`,
            }}
          />
          <h1 className={styles.percent} data-slot="financial-health-card-percent">
            {displayedPercent}%
          </h1>
          <div className={styles["gauge-center"]} data-slot="financial-health-card-gauge-center">
            <p className={styles["percent-label"]} data-slot="financial-health-card-percent-label">
              {copy.percentLabel}
            </p>
          </div>
        </div>

        <p className={styles.note} data-slot="financial-health-card-note">
          {copy.note}
        </p>
      </article>
    </section>
  );
}
