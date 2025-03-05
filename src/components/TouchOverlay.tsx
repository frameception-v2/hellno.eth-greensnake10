"use client";

import { useRef, useEffect } from "react";
import { cn } from "~/lib/utils";
import type { Direction } from "~/lib/InputHandler";

type TouchOverlayProps = {
  onSwipe: (direction: Direction) => void;
  className?: string;
};

export default function TouchOverlay({ onSwipe, className }: TouchOverlayProps) {
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 30; // Minimum distance in pixels to consider a swipe

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartPos.current) return;

    const touchEndPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEndPos.x - touchStartPos.current.x;
    const dy = touchEndPos.y - touchStartPos.current.y;
    
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    let direction: Direction = null;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? "right" : "left";
    } else {
      direction = dy > 0 ? "down" : "up";
    }

    onSwipe(direction);
    touchStartPos.current = null;
  };

  useEffect(() => {
    const overlay = document.getElementById("touch-overlay");
    
    overlay?.addEventListener("touchstart", handleTouchStart);
    overlay?.addEventListener("touchmove", handleTouchMove, { passive: false });
    overlay?.addEventListener("touchend", handleTouchEnd);

    return () => {
      overlay?.removeEventListener("touchstart", handleTouchStart);
      overlay?.removeEventListener("touchmove", handleTouchMove);
      overlay?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

  return (
    <div
      id="touch-overlay"
      className={cn(
        "absolute inset-0 z-50 touch-none select-none opacity-0",
        className
      )}
    />
  );
}
