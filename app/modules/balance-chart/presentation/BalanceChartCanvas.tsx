"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3-array";
import { format } from "d3-format";
import { useId, useMemo, useState, type CSSProperties } from "react";
import type { BalanceChartViewModel } from "../domain/balance-chart.types";
import styles from "./BalanceChart.module.css";

type BalanceChartCanvasProps = {
  width: number;
  height: number;
  copy: BalanceChartViewModel;
  locale: string;
};

type BarDatum = {
  day: string;
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
  { incomeAmount: 520, savingsAmount: 0, expensesAmount: 180 },
  { incomeAmount: 480, savingsAmount: 0, expensesAmount: 130 },
  { incomeAmount: 620, savingsAmount: 0, expensesAmount: 200 },
  { incomeAmount: 700, savingsAmount: 240, expensesAmount: 460 },
  { incomeAmount: 810, savingsAmount: 0, expensesAmount: 210 },
  { incomeAmount: 940, savingsAmount: 0, expensesAmount: 280 },
  { incomeAmount: 1100, savingsAmount: 0, expensesAmount: 310 },
] as const;

const margin = { top: 6, right: 8, bottom: 40, left: 34 };
const amountScaleFactor = 40;
const barCornerRadius = 3;
const stackGap = 5;
const yTickStep = 10;

const colors = {
  savings: "#F3A712",
  income: "#29335C",
  expenses: "#534D41",
  axis: "#534D41",
};

const yTickFormat = format("~d");
const chartFontSizeSmall = 12;

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BalanceChartCanvas({
  width,
  height,
  copy,
  locale,
}: BalanceChartCanvasProps) {
  const [hovered, setHovered] = useState<HoveredBar | null>(null);
  const clipPathPrefix = useId().replace(/:/g, "");
  const data = useMemo<BarDatum[]>(
    () =>
      copy.days.map((day, index) => {
        const source = baseSeries[index] ?? baseSeries[baseSeries.length - 1];
        return {
          day,
          amount: {
            income: source.incomeAmount,
            savings: source.savingsAmount,
            expenses: source.expensesAmount,
          },
        };
      }),
    [copy.days],
  );

  const toChartUnits = (value: number) => value / amountScaleFactor;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const highestPositive =
    max(data, (datum) => toChartUnits(datum.amount.income + datum.amount.savings)) ?? 20;
  const lowestNegative =
    min(data, (datum) => -toChartUnits(datum.amount.expenses)) ?? -5;
  const domainTop =
    Math.ceil(Math.max(30, highestPositive + 8) / yTickStep) * yTickStep;
  const domainBottom =
    Math.floor(Math.min(-10, lowestNegative - 4) / yTickStep) * yTickStep;

  const xScale = scaleBand<string>({
    domain: data.map((datum) => datum.day),
    range: [0, xMax],
    padding: 0.34,
  });

  const yScale = scaleLinear<number>({
    domain: [domainBottom, domainTop],
    range: [yMax, 0],
  });

  const ticks = Array.from(
    { length: Math.round((domainTop - domainBottom) / yTickStep) + 1 },
    (_, index) => domainBottom + index * yTickStep,
  );

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

          {data.map((datum, index) => {
            const x = xScale(datum.day);
            if (x === undefined) {
              return null;
            }

            const positiveClipPathId = `${clipPathPrefix}-positive-${datum.day}`;
            const barWidth = xScale.bandwidth();
            const isHovered = hovered?.datum.day === datum.day;
            const incomeValue = toChartUnits(datum.amount.income);
            const savingsValue = toChartUnits(datum.amount.savings);
            const expensesValue = toChartUnits(datum.amount.expenses);
            const positiveTotal = incomeValue + savingsValue;
            const zeroY = yScale(0);
            const positiveTopY = yScale(positiveTotal);
            const incomeTopY = yScale(incomeValue);
            const expensesBottomY = yScale(-expensesValue);
            const hasSavings = savingsValue > 0;
            const hasIncome = incomeValue > 0;
            const hasExpenses = expensesValue > 0;
            const hasPositiveStack = positiveTotal > 0;
            const sharedGapOffset = hasPositiveStack && hasExpenses ? stackGap / 2 : 0;
            const positiveBottomY = zeroY - sharedGapOffset;
            const expensesTopY = zeroY + sharedGapOffset;
            const positiveHeight = Math.max(0, positiveBottomY - positiveTopY);
            const expensesHeight = Math.max(0, expensesBottomY - expensesTopY);
            const savingsHeight = Math.max(0, incomeTopY - positiveTopY);
            const incomeHeight = Math.max(0, positiveBottomY - incomeTopY);

            return (
              <g
                key={datum.day}
                className={styles["chart-bar-group"]}
                data-slot="balance-chart-bar-group"
                style={{ "--bar-index": `${index}` } as CSSProperties}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={() =>
                  setHovered({
                    datum,
                    left: margin.left + x + barWidth + 8,
                    top: margin.top + positiveTopY - 8,
                  })
                }
              >
                {hasPositiveStack ? (
                  <rect
                    className={styles["chart-bar-ghost"]}
                    x={x}
                    y={positiveTopY}
                    width={barWidth}
                    height={positiveHeight}
                    rx={barCornerRadius}
                  />
                ) : null}

                {hasExpenses ? (
                  <rect
                    className={styles["chart-bar-ghost"]}
                    x={x}
                    y={expensesTopY}
                    width={barWidth}
                    height={expensesHeight}
                    rx={barCornerRadius}
                  />
                ) : null}

                {isHovered && hasPositiveStack ? (
                  <>
                    <defs>
                      <clipPath id={positiveClipPathId}>
                        <rect
                          x={x}
                          y={positiveTopY}
                          width={barWidth}
                          height={positiveHeight}
                          rx={barCornerRadius}
                        />
                      </clipPath>
                    </defs>

                    <g clipPath={`url(#${positiveClipPathId})`}>
                      {hasIncome ? (
                        <rect
                          className={styles["chart-bar-income"]}
                          x={x}
                          y={incomeTopY}
                          width={barWidth}
                          height={incomeHeight}
                        />
                      ) : null}

                      {hasSavings ? (
                        <rect
                          className={styles["chart-bar-savings"]}
                          x={x}
                          y={positiveTopY}
                          width={barWidth}
                          height={savingsHeight}
                        />
                      ) : null}
                    </g>
                  </>
                ) : null}

                {isHovered && hasExpenses ? (
                  <rect
                    className={styles["chart-bar-expenses"]}
                    x={x}
                    y={expensesTopY}
                    width={barWidth}
                    height={expensesHeight}
                    rx={barCornerRadius}
                  />
                ) : null}
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

      {hovered ? (
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
              <strong>{formatCurrency(hovered.datum.amount.savings, locale)}</strong>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.income}`} />
              <span>{copy.legend.income}</span>
              <strong>{formatCurrency(hovered.datum.amount.income, locale)}</strong>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.expenses}`} />
              <span>{copy.legend.expenses}</span>
              <strong>{formatCurrency(hovered.datum.amount.expenses, locale)}</strong>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
