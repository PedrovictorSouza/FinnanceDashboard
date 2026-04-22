"use client";

import { ParentSize } from "@visx/responsive";
import type { BalanceChartViewModel } from "../domain/balance-chart.types";
import { BalanceChartCanvas } from "./BalanceChartCanvas";

type BalanceChartCanvasSurfaceProps = {
  copy: BalanceChartViewModel;
  locale: string;
};

export function BalanceChartCanvasSurface({
  copy,
  locale,
}: BalanceChartCanvasSurfaceProps) {
  return (
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
  );
}
