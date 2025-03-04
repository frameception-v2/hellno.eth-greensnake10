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

  useEffect(() => {
    const updateCanvasSize = () => {
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

      // Scale drawing context
      const ctx = displayCanvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
      }
    };

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
  }, []);

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
