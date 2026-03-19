"use client";

import { useRef, type PointerEvent } from "react";
import type { DashboardWalletPanelViewModel } from "../modules/dashboard/domain/dashboard.types";
import styles from "./WalletPanel.module.css";

type WalletPanelProps = {
  copy: DashboardWalletPanelViewModel;
};

export function WalletPanel({ copy }: WalletPanelProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    dragRef.current.isDragging = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.scrollLeft = carousel.scrollLeft;
    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !dragRef.current.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragRef.current.startX;
    carousel.scrollLeft = dragRef.current.scrollLeft - deltaX;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  return (
    <article className={`motion-enter-soft ${styles["wallet-panel"]}`} data-slot="wallet-panel">
      <header className={styles["wallet-header"]} data-slot="wallet-header">
        <div className={styles["wallet-heading"]} data-slot="wallet-heading">
          <div className={styles["wallet-heading-copy"]} data-slot="wallet-heading-copy">
            <h2 className={styles["wallet-title"]} data-slot="wallet-title">
              {copy.title}
            </h2>
            <p className={styles["wallet-subtitle"]} data-slot="wallet-subtitle">
              {copy.subtitle}
            </p>
          </div>
          <button
            type="button"
            className={styles["wallet-add-btn"]}
            data-slot="wallet-add-button"
            aria-label={copy.aria.addCard}
          >
            <span className={styles["wallet-add-btn-full"]}>{copy.addCard}</span>
            <span className={styles["wallet-add-btn-short"]}>Add cartão</span>
          </button>
        </div>
      </header>

      <section
        className={styles["wallet-carousel"]}
        data-slot="wallet-carousel"
        aria-label={copy.aria.carousel}
      >
        <div
          ref={carouselRef}
          className={styles["wallet-carousel-main"]}
          data-slot="wallet-carousel-main"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {copy.slides.map((slide) => (
            <section key={slide} className={styles["wallet-slide"]} data-slot="wallet-slide">
              <p data-slot="wallet-slide-label">{slide}</p>
            </section>
          ))}
        </div>
      </section>

      <ul
        className={`${styles["wallet-shortcuts"]} ${styles["wallet-shortcuts-primary"]}`}
        data-slot="wallet-shortcuts-primary"
        aria-label={copy.aria.primaryShortcuts}
      >
        {copy.primaryShortcuts.map((item) => (
          <li key={item} data-slot="wallet-shortcut-entry">
            <button
              type="button"
              className={`${styles["wallet-shortcut-item"]} ${styles["wallet-shortcut-item-primary"]}`}
              data-slot="wallet-shortcut-item-primary"
            >
              <span
                className={`${styles["wallet-shortcut-image"]} ${styles["wallet-shortcut-image-primary"]} upload-area`}
                data-slot="wallet-shortcut-image-primary"
                aria-hidden="true"
              />
              <span className={styles["wallet-shortcut-text"]} data-slot="wallet-shortcut-text">
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles["wallet-secondary-group"]} data-slot="wallet-secondary-group">
        <p className={styles["wallet-secondary-title"]} data-slot="wallet-secondary-title">
          {copy.quickPaymentLabel}
        </p>

        <ul
          className={`${styles["wallet-shortcuts"]} ${styles["wallet-shortcuts-secondary"]}`}
          data-slot="wallet-shortcuts-secondary"
          aria-label={copy.aria.secondaryShortcuts}
        >
          {copy.secondaryShortcuts.map((item) => (
            <li key={item} data-slot="wallet-shortcut-entry">
              <button
                type="button"
                className={`${styles["wallet-shortcut-item"]} ${styles["wallet-shortcut-item-secondary"]}`}
                data-slot="wallet-shortcut-item-secondary"
              >
                <span
                  className={`${styles["wallet-shortcut-image"]} ${styles["wallet-shortcut-image-secondary"]} upload-area`}
                  data-slot="wallet-shortcut-image-secondary"
                  aria-hidden="true"
                />
                <span className={styles["wallet-shortcut-text"]} data-slot="wallet-shortcut-text">
                  {item}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
