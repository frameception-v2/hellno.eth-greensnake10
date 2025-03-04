"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";

type CanvasContextType = {
  displayCanvas: HTMLCanvasElement | null;
  bufferCanvas: HTMLCanvasElement | null;
};

const CanvasContext = createContext<CanvasContextType>({
  displayCanvas: null,
  bufferCanvas: null,
});

export function useCanvasContext() {
  return useContext(CanvasContext);
}

export default function GameCanvas({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);

  const animationFrameId = useRef<number>();
  const lastFrameTime = useRef(performance.now());

  const renderFrame = useCallback(() => {
    if (!displayCanvasRef.current || !bufferCanvasRef.current) return;
    
    const bufferCtx = bufferCanvasRef.current.getContext('2d');
    const displayCtx = displayCanvasRef.current.getContext('2d');
    
    if (!bufferCtx || !displayCtx) return;

    // Clear buffers
    bufferCtx.clearRect(0, 0, bufferCanvasRef.current.width, bufferCanvasRef.current.height);
    displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);

    // Custom drawing operations would go here
    bufferCtx.fillStyle = '#c026d3';
    bufferCtx.fillRect(0, 0, bufferCanvasRef.current.width, bufferCanvasRef.current.height);

    // Copy buffer to display
    displayCtx.drawImage(bufferCanvasRef.current, 0, 0);
  }, []);

  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current || !displayCanvasRef.current || !bufferCanvasRef.current) return;

    const container = containerRef.current;
    const displayCanvas = displayCanvasRef.current;
    const bufferCanvas = bufferCanvasRef.current;
    
    const size = Math.min(container.clientWidth, container.clientHeight);
    const scale = window.devicePixelRatio || 1;

    // Set canvas dimensions
    [displayCanvas, bufferCanvas].forEach(canvas => {
      canvas.width = size * scale;
      canvas.height = size * scale;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    });

    // Reset scale for proper buffer operations
    const ctx = displayCanvas.getContext("2d");
    if (ctx) {
      ctx.resetTransform();
      ctx.scale(scale, scale);
    }
  }, []);

  }, [renderFrame]);

  useEffect(() => {
    // Initial size update
    updateCanvasSize();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateCanvasSize);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updateCanvasSize]);

  return (
    <CanvasContext.Provider value={{
      displayCanvas: displayCanvasRef.current,
      bufferCanvas: bufferCanvasRef.current
    }}>
      <div 
        ref={containerRef}
        className="relative w-full h-full bg-neutral-100 dark:bg-neutral-900"
        style={{ paddingTop: "100%" }} // Maintain 1:1 aspect ratio
      >
        <canvas
          ref={displayCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        <canvas
          ref={bufferCanvasRef}
          className="hidden" // Offscreen buffer
        />
        {children}
      </div>
    </CanvasContext.Provider>
  );
}
