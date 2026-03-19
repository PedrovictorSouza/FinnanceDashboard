import type { ComponentPropsWithoutRef } from "react";
import styles from "./SidebarIconFrame.module.css";

type SidebarIconFrameProps = ComponentPropsWithoutRef<"span"> & {
  size?: "main" | "sub";
  src?: string;
};

export function SidebarIconFrame({
  size = "main",
  className,
  children,
  src,
  ...props
}: SidebarIconFrameProps) {
  const sizeClassName = size === "sub" ? styles.sub : styles.main;
  const mergedClassName = [styles.frame, sizeClassName, className].filter(Boolean).join(" ");
  const iconSize = size === "sub" ? 10 : 12;

  return (
    <span className={mergedClassName} {...props}>
      {src ? <img src={src} alt="" width={iconSize} height={iconSize} /> : children}
    </span>
  );
}
