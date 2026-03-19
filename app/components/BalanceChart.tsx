"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3-array";
import { format } from "d3-format";
import { useMemo, useState } from "react";
import { languageLocales, type DashboardDictionary, type LanguageCode } from "../lib/i18n";
import styles from "./BalanceChart.module.css";

type BalanceChartCopy = DashboardDictionary["chart"];

type BalanceChartProps = {
  copy: BalanceChartCopy;
  language: LanguageCode;
};

type BarDatum = {
  day: string;
  visual: {
    income: number;
    savings: number;
    expenses: number;
  };
  amount: {
    income: number;
    savings: number;
    expenses: number;
  };
};

type HoveredBar = {
  datum: BarDatum;
  left: number;
  top: number;
};

const baseSeries = [
  { income: 11, savings: 0, expenses: -3, incomeAmount: 520, savingsAmount: 0, expensesAmount: 180 },
  { income: 9, savings: 0, expenses: -2, incomeAmount: 480, savingsAmount: 0, expensesAmount: 130 },
  { income: 14, savings: 0, expenses: -3, incomeAmount: 620, savingsAmount: 0, expensesAmount: 200 },
  { income: 14, savings: 6, expenses: -4, incomeAmount: 700, savingsAmount: 240, expensesAmount: 460 },
  { income: 18, savings: 0, expenses: -3, incomeAmount: 810, savingsAmount: 0, expensesAmount: 210 },
  { income: 20, savings: 0, expenses: -5, incomeAmount: 940, savingsAmount: 0, expensesAmount: 280 },
  { income: 24, savings: 0, expenses: -5, incomeAmount: 1100, savingsAmount: 0, expensesAmount: 310 },
] as const;

const margin = { top: 6, right: 8, bottom: 40, left: 34 };
const ghostPositive = 22;
const ghostNegative = -4;
const laneGap = 6;
const laneMinFillHeight = 3;

const colors = {
  savings: "#E5EA42",
  income: "#9BD95A",
  expenses: "#F3B56C",
  ghost: "#D8D8D8",
  axis: "#333333",
  grid: "#CBCBCB",
};

const yTickFormat = format("~d");
const chartFontSizeSmall = 12;

function formatCurrency(value: number, language: LanguageCode) {
  return new Intl.NumberFormat(languageLocales[language], {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function BalanceChartSvg({
  width,
  height,
  copy,
  language,
}: {
  width: number;
  height: number;
  copy: BalanceChartCopy;
  language: LanguageCode;
}) {
  const [hovered, setHovered] = useState<HoveredBar | null>(null);
  const data = useMemo<BarDatum[]>(
    () =>
      copy.days.map((day, index) => {
        const source = baseSeries[index] ?? baseSeries[baseSeries.length - 1];
        return {
          day,
          visual: {
            income: source.income,
            savings: source.savings,
            expenses: source.expenses,
          },
          amount: {
            income: source.incomeAmount,
            savings: source.savingsAmount,
            expenses: source.expensesAmount,
          },
        };
      }),
    [copy.days],
  );

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const highestPositive = max(data, (d) => d.visual.income + d.visual.savings) ?? 20;
  const lowestNegative = min(data, (d) => d.visual.expenses) ?? -5;
  const domainTop = Math.max(30, highestPositive + 8);
  const domainBottom = Math.min(-10, lowestNegative - 4);

  const xScale = scaleBand<string>({
    domain: data.map((d) => d.day),
    range: [0, xMax],
    padding: 0.34,
  });

  const yScale = scaleLinear<number>({
    domain: [domainBottom, domainTop],
    range: [yMax, 0],
    nice: true,
  });

  const ticks = [domainBottom, -10, 0, 10, 20, 30].filter(
    (tick, index, arr) =>
      tick >= domainBottom &&
      tick <= domainTop &&
      arr.indexOf(tick) === index,
  );
  const laneAreaTop = yScale(ghostPositive);
  const laneAreaBottom = yScale(ghostNegative);
  const laneAreaHeight = Math.max(0, laneAreaBottom - laneAreaTop);
  const laneHeight = Math.max(2, (laneAreaHeight - laneGap * 2) / 3);
  const savingsLaneTop = laneAreaTop;
  const incomeLaneTop = savingsLaneTop + laneHeight + laneGap;
  const expensesLaneTop = incomeLaneTop + laneHeight + laneGap;
  const maxIncome = Math.max(1, max(data, (d) => d.visual.income) ?? 1);
  const maxSavings = Math.max(1, max(data, (d) => d.visual.savings) ?? 1);
  const maxExpenses = Math.max(1, max(data, (d) => Math.abs(d.visual.expenses)) ?? 1);

  const toLaneFillHeight = (value: number, laneMax: number) => {
    if (value <= 0) {
      return 0;
    }

    return Math.max(
      laneMinFillHeight,
      Math.min(laneHeight, (value / laneMax) * laneHeight),
    );
  };

  return (
    <div className={styles["chart-area-inner"]} data-slot="balance-chart-area">
      <svg width={width} height={height} data-slot="balance-chart-svg" aria-label={copy.aria.chart}>
        <Group left={margin.left} top={margin.top}>
          {ticks.map((tick) => (
            <line
              key={`grid-${tick}`}
              className={styles["chart-grid-line"]}
              x1={0}
              x2={xMax}
              y1={yScale(tick)}
              y2={yScale(tick)}
            />
          ))}

          {data.map((datum) => {
            const x = xScale(datum.day);
            if (x === undefined) {
              return null;
            }

            const barWidth = xScale.bandwidth();
            const isHovered = hovered?.datum.day === datum.day;
            const savingsFillHeight = toLaneFillHeight(Math.max(0, datum.visual.savings), maxSavings);
            const incomeFillHeight = toLaneFillHeight(Math.max(0, datum.visual.income), maxIncome);
            const expensesFillHeight = toLaneFillHeight(Math.max(0, Math.abs(datum.visual.expenses)), maxExpenses);

            return (
              <g
                key={datum.day}
                className={styles["chart-bar-group"]}
                data-slot="balance-chart-bar-group"
                onMouseLeave={() => setHovered(null)}
                onMouseMove={() =>
                  setHovered({
                    datum,
                    left: margin.left + x + barWidth + 8,
                    top: margin.top + savingsLaneTop - 8,
                  })
                }
              >
                <rect
                  className={styles["chart-bar-ghost"]}
                  x={x}
                  y={savingsLaneTop}
                  width={barWidth}
                  height={laneHeight}
                  rx={7}
                />
                <rect
                  className={styles["chart-bar-ghost"]}
                  x={x}
                  y={incomeLaneTop}
                  width={barWidth}
                  height={laneHeight}
                  rx={7}
                />
                <rect
                  className={styles["chart-bar-ghost"]}
                  x={x}
                  y={expensesLaneTop}
                  width={barWidth}
                  height={laneHeight}
                  rx={7}
                />

                {isHovered && savingsFillHeight > 0 && (
                  <rect
                    className={styles["chart-bar-savings"]}
                    x={x}
                    y={savingsLaneTop + laneHeight - savingsFillHeight}
                    width={barWidth}
                    height={savingsFillHeight}
                    rx={7}
                  />
                )}

                {isHovered && incomeFillHeight > 0 && (
                  <rect
                    className={styles["chart-bar-income"]}
                    x={x}
                    y={incomeLaneTop + laneHeight - incomeFillHeight}
                    width={barWidth}
                    height={incomeFillHeight}
                    rx={7}
                  />
                )}

                {isHovered && expensesFillHeight > 0 && (
                  <rect
                    className={styles["chart-bar-expenses"]}
                    x={x}
                    y={expensesLaneTop + laneHeight - expensesFillHeight}
                    width={barWidth}
                    height={expensesFillHeight}
                    rx={7}
                  />
                )}
              </g>
            );
          })}

          <AxisLeft
            scale={yScale}
            tickValues={ticks}
            hideTicks
            hideAxisLine
            tickLabelProps={() => ({
              fill: colors.axis,
              fontSize: chartFontSizeSmall,
              textAnchor: "end",
              dx: -6,
              dy: 3,
            })}
            tickFormat={(value) => yTickFormat(value as number)}
          />

          <AxisBottom
            top={yMax}
            scale={xScale}
            hideTicks
            hideAxisLine
            tickLabelProps={() => ({
              fill: colors.axis,
              fontSize: chartFontSizeSmall,
              textAnchor: "middle",
              dy: 10,
            })}
          />
        </Group>
      </svg>

      {hovered && (
        <div
          className={styles["chart-tooltip"]}
          data-slot="balance-chart-tooltip"
          style={{ left: hovered.left, top: hovered.top }}
        >
          <p className={styles["chart-tooltip-date"]} data-slot="balance-chart-tooltip-date">
            {copy.tooltipDate}
          </p>
          <ul>
            <li>
              <span className={`${styles.dot} ${styles.savings}`} />
              <span>{copy.legend.savings}</span>
              <strong>{formatCurrency(hovered.datum.amount.savings, language)}</strong>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.income}`} />
              <span>{copy.legend.income}</span>
              <strong>{formatCurrency(hovered.datum.amount.income, language)}</strong>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.expenses}`} />
              <span>{copy.legend.expenses}</span>
              <strong>{formatCurrency(hovered.datum.amount.expenses, language)}</strong>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export function BalanceChart({ copy, language }: BalanceChartProps) {
  return (
    <article className={styles["balance-chart"]} data-slot="balance-chart">
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
            <span className={styles.caret} data-slot="balance-chart-caret" aria-hidden="true">
              v
            </span>
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
          {({ width, height }) => {
            const safeWidth = Math.max(width, 240);
            const safeHeight = Math.max(height, 170);

            return (
              <BalanceChartSvg
                width={safeWidth}
                height={safeHeight}
                copy={copy}
                language={language}
              />
            );
          }}
        </ParentSize>
      </div>
    </article>
  );
}
