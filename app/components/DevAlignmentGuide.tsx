"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DevAlignmentGuide.module.css";

type GuideOrientation = "horizontal" | "vertical";

type Guide = {
  orientation: GuideOrientation;
  position: number;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;

  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

function getViewportMidpoint(orientation: GuideOrientation) {
  if (typeof window === "undefined") {
    return 0;
  }

  const size = orientation === "horizontal" ? window.innerHeight : window.innerWidth;
  return Math.max(0, Math.round(size / 2));
}

function clampGuidePosition(orientation: GuideOrientation, rawPosition: number) {
  if (typeof window === "undefined") {
    return 0;
  }

  const maxSize = orientation === "horizontal" ? window.innerHeight : window.innerWidth;
  return Math.max(0, Math.min(Math.round(rawPosition), Math.max(0, maxSize - 1)));
}

export function DevAlignmentGuide() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [placementOrientation, setPlacementOrientation] = useState<GuideOrientation | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);
  const placementOrientationRef = useRef<GuideOrientation | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    placementOrientationRef.current = placementOrientation;
  }, [placementOrientation]);

  function startPlacement(orientation: GuideOrientation) {
    const initialPosition =
      guide?.orientation === orientation ? guide.position : getViewportMidpoint(orientation);

    setIsPanelOpen(true);
    setPlacementOrientation(orientation);
    setPreviewPosition(initialPosition);
  }

  function stopPlacement() {
    isDraggingRef.current = false;
    setPlacementOrientation(null);
    setPreviewPosition(null);
  }

  function clearGuide() {
    stopPlacement();
    setGuide(null);
  }

  function togglePanel() {
    setIsPanelOpen((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        stopPlacement();
      }

      return nextValue;
    });
  }

  function updatePreview(clientX: number, clientY: number) {
    const orientation = placementOrientationRef.current;

    if (!orientation) {
      return;
    }

    const rawPosition = orientation === "horizontal" ? clientY : clientX;
    setPreviewPosition(clampGuidePosition(orientation, rawPosition));
  }

  function commitGuide(clientX: number, clientY: number) {
    const orientation = placementOrientationRef.current;

    if (!orientation) {
      return;
    }

    const rawPosition = orientation === "horizontal" ? clientY : clientX;
    const position = clampGuidePosition(orientation, rawPosition);
    setGuide({ orientation, position });
    stopPlacement();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        stopPlacement();
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const isShiftOnly =
        event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey;

      if (!isShiftOnly) {
        return;
      }

      if (key === "g") {
        event.preventDefault();
        togglePanel();
        return;
      }

      if (key === "h") {
        event.preventDefault();
        startPlacement("horizontal");
        return;
      }

      if (key === "v") {
        event.preventDefault();
        startPlacement("vertical");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guide]);

  useEffect(() => {
    if (!guide) {
      return;
    }

    function handleResize() {
      setGuide((currentGuide) => {
        if (!currentGuide) {
          return currentGuide;
        }

        return {
          ...currentGuide,
          position: clampGuidePosition(currentGuide.orientation, currentGuide.position),
        };
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [guide]);

  const isPlacing = placementOrientation !== null;
  const visibleGuide =
    isPlacing && placementOrientation && previewPosition !== null
      ? { orientation: placementOrientation, position: previewPosition }
      : guide;

  const guideClassName =
    visibleGuide?.orientation === "horizontal"
      ? `${styles.guide} ${styles["guide-horizontal"]}`
      : `${styles.guide} ${styles["guide-vertical"]}`;

  const guideStyle =
    visibleGuide?.orientation === "horizontal"
      ? { top: `${visibleGuide.position}px` }
      : { left: `${visibleGuide?.position ?? 0}px` };

  return (
    <div className={styles.root}>
      {visibleGuide ? <div className={guideClassName} style={guideStyle} /> : null}

      {isPlacing ? (
        <div
          className={`${styles["placement-overlay"]} ${
            placementOrientation === "horizontal"
              ? styles["placement-horizontal"]
              : styles["placement-vertical"]
          }`}
          onPointerMove={(event) => {
            updatePreview(event.clientX, event.clientY);
          }}
          onPointerDown={(event) => {
            isDraggingRef.current = true;
            updatePreview(event.clientX, event.clientY);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            if (!isDraggingRef.current) {
              return;
            }

            commitGuide(event.clientX, event.clientY);
          }}
          onPointerCancel={() => {
            stopPlacement();
          }}
        >
          <div className={styles["placement-hint"]}>
            Arraste no viewport e solte para posicionar a guia. Pressione Esc para cancelar.
          </div>
        </div>
      ) : null}

      {isPanelOpen ? (
        <aside className={styles.panel} aria-label="Painel de guias de alinhamento">
          <div className={styles["panel-header"]}>
            <div>
              <h2 className={styles["panel-title"]}>Guias de alinhamento</h2>
              <p className={styles["panel-copy"]}>
                Crie uma guia simples sobre o viewport para checar alinhamento durante o
                desenvolvimento.
              </p>
            </div>

            <button
              type="button"
              className={styles["close-button"]}
              onClick={() => {
                stopPlacement();
                setIsPanelOpen(false);
              }}
              aria-label="Fechar painel de guias"
            >
              ×
            </button>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles["action-button"]} ${
                placementOrientation === "horizontal" ? styles["action-button-active"] : ""
              }`}
              onClick={() => startPlacement("horizontal")}
            >
              Guia horizontal
            </button>

            <button
              type="button"
              className={`${styles["action-button"]} ${
                placementOrientation === "vertical" ? styles["action-button-active"] : ""
              }`}
              onClick={() => startPlacement("vertical")}
            >
              Guia vertical
            </button>

            <button type="button" className={styles["clear-button"]} onClick={clearGuide}>
              Limpar guia
            </button>
          </div>

          <p className={styles.status}>
            {isPlacing
              ? "Modo de posicionamento ativo."
              : guide
                ? `Guia ${guide.orientation === "horizontal" ? "horizontal" : "vertical"} ativa.`
                : "Nenhuma guia ativa."}
          </p>

          <ul className={styles["shortcut-list"]}>
            <li>Shift + G abre ou fecha o painel</li>
            <li>Shift + H inicia uma guia horizontal</li>
            <li>Shift + V inicia uma guia vertical</li>
            <li>Esc cancela o posicionamento atual</li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
