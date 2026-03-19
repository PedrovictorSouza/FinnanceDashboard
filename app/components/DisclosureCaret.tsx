import type { ComponentPropsWithoutRef } from "react";

type DisclosureCaretProps = ComponentPropsWithoutRef<"svg">;

export function DisclosureCaret(props: DisclosureCaretProps) {
  return (
    <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
