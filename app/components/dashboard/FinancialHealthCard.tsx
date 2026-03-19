"use client";

import { useId } from "react";
import type { DashboardHealthCardViewModel } from "../../modules/dashboard/domain/dashboard.types";
import { DisclosureCaret } from "../DisclosureCaret";
import { useAnimatedNumber } from "./animatedMetrics";
import styles from "./FinancialHealthCard.module.css";

type FinancialHealthCardProps = {
  copy: DashboardHealthCardViewModel;
  componentId: string;
};

export function FinancialHealthCard({ copy, componentId }: FinancialHealthCardProps) {
  const gaugeGradientId = useId();
  const animatedPercent = useAnimatedNumber(copy.percent, {
    delay: 120,
    duration: 2_400,
  });
  const displayedPercent = Math.round(animatedPercent);
  const normalizedPercent = Math.min(100, Math.max(0, animatedPercent));
  const gaugeRadius = 48;
  const gaugeArcLength = Math.PI * gaugeRadius;
  const gaugeFilledLength = (gaugeArcLength * normalizedPercent) / 100;
  const gaugeAccentLength = gaugeFilledLength * 0.45;
  const gaugeProgressDasharray = `${gaugeFilledLength} ${gaugeArcLength}`;
  const gaugeAccentDasharray = `${gaugeAccentLength} ${gaugeArcLength}`;

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
          <svg
            className={styles.gauge}
            data-slot="financial-health-card-gauge"
            viewBox="0 0 120 72"
            aria-hidden="true"
          >
            <path
              className={styles["gauge-track"]}
              data-slot="financial-health-card-gauge-track"
              d="M12 60 A48 48 0 0 1 108 60"
              pathLength={gaugeArcLength}
            />
            <path
              className={styles["gauge-progress"]}
              data-slot="financial-health-card-gauge-progress"
              d="M12 60 A48 48 0 0 1 108 60"
              pathLength={gaugeArcLength}
              stroke={`url(#${gaugeGradientId})`}
              strokeDasharray={gaugeProgressDasharray}
            />
            <path
              className={styles["gauge-accent"]}
              data-slot="financial-health-card-gauge-accent"
              d="M12 60 A48 48 0 0 1 108 60"
              pathLength={gaugeArcLength}
              strokeDasharray={gaugeAccentDasharray}
            />
            <defs>
              <linearGradient id={gaugeGradientId} x1="12" y1="60" x2="108" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d7e95a" />
                <stop offset="45%" stopColor="#95cb4f" />
                <stop offset="100%" stopColor="#95cb4f" />
              </linearGradient>
            </defs>
          </svg>
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
