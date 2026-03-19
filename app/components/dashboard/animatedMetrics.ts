"use client";

import { useEffect, useState } from "react";

type AnimationOptions = {
  delay?: number;
  duration?: number;
};

type NumberTemplate = {
  decimals: number;
  decimalSeparator: string;
  groupSeparator: string;
  prefix: string;
  suffix: string;
};

type ParsedFormattedNumber = {
  template: NumberTemplate;
  value: number;
};

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function useAnimatedNumber(target: number, options: AnimationOptions = {}) {
  const { delay = 0, duration = 1_000 } = options;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      setValue(target);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frameId = 0;
    let timeoutId = 0;
    const animationStart = performance.now();

    setValue(0);

    const animate = (now: number) => {
      const elapsed = now - animationStart;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setValue(target * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [delay, duration, target]);

  return value;
}

export function parseFormattedNumber(label: string): ParsedFormattedNumber | null {
  const match = label.match(/-?[\d.,]+/);

  if (!match || !match[0]) {
    return null;
  }

  const rawNumber = match[0];
  const prefix = label.slice(0, match.index ?? 0);
  const suffix = label.slice((match.index ?? 0) + rawNumber.length);
  const lastDot = rawNumber.lastIndexOf(".");
  const lastComma = rawNumber.lastIndexOf(",");
  const separatorIndex = Math.max(lastDot, lastComma);
  const separatorChar = separatorIndex >= 0 ? rawNumber[separatorIndex] : "";
  const digitsAfterSeparator = separatorIndex >= 0 ? rawNumber.length - separatorIndex - 1 : 0;
  const hasDecimalSeparator =
    separatorIndex >= 0 && digitsAfterSeparator > 0 && digitsAfterSeparator <= 2;
  const decimalSeparator = hasDecimalSeparator ? separatorChar : "";
  const decimals = hasDecimalSeparator ? digitsAfterSeparator : 0;
  const groupSeparator = rawNumber.includes(",") && decimalSeparator !== "," ? "," : rawNumber.includes(".") && decimalSeparator !== "." ? "." : "";
  const withoutGrouping =
    groupSeparator.length > 0 ? rawNumber.split(groupSeparator).join("") : rawNumber;
  const normalizedNumber =
    decimalSeparator.length > 0 ? withoutGrouping.replace(decimalSeparator, ".") : withoutGrouping;
  const value = Number(normalizedNumber);

  if (Number.isNaN(value)) {
    return null;
  }

  return {
    value,
    template: {
      decimals,
      decimalSeparator,
      groupSeparator,
      prefix,
      suffix,
    },
  };
}

export function formatNumberFromTemplate(value: number, template: NumberTemplate) {
  const absoluteValue = Math.abs(value);
  const roundedValue =
    template.decimals > 0 ? absoluteValue.toFixed(template.decimals) : Math.round(absoluteValue).toString();
  const [integerPart, decimalPart = ""] = roundedValue.split(".");
  const groupedInteger =
    template.groupSeparator.length > 0
      ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, template.groupSeparator)
      : integerPart;
  const decimalSuffix =
    template.decimals > 0 ? `${template.decimalSeparator}${decimalPart}` : "";
  const sign = value < 0 ? "-" : "";

  return `${template.prefix}${sign}${groupedInteger}${decimalSuffix}${template.suffix}`;
}
