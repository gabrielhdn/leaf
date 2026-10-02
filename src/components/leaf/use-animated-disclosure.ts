"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function useAnimatedDisclosure() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef<number | null>(null);
  const previousOpacityRef = useRef(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const previousHeight = previousHeightRef.current;
    previousHeightRef.current = null;

    if (!panel || previousHeight === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = panel.animate(
      [
        { height: `${previousHeight}px`, opacity: previousOpacityRef.current },
        { height: open ? `${panel.getBoundingClientRect().height}px` : "0px", opacity: open ? 1 : 0 },
      ],
      { duration: 300, easing: "ease-in-out" },
    );

    return () => animation.cancel();
  }, [open]);

  const toggle = useCallback(() => {
    const panel = panelRef.current;
    previousHeightRef.current = panel?.getBoundingClientRect().height ?? null;
    previousOpacityRef.current = panel ? Number(window.getComputedStyle(panel).opacity) : 0;
    setOpen((value) => !value);
  }, []);

  return { open, panelRef, toggle };
}
