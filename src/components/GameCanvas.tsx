"use client";

import { useEffect, useRef, useState, createContext, useContext, useImperativeHandle, forwardRef } from "react";

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

export type CanvasHandle = {
  render: (drawFrame: (ctx: CanvasRenderingContext2D) => void) => void;
};

export default forwardRef<CanvasHandle, { children?: React.ReactNode }>(function GameCanvas({ children }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);

  const animationFrameId = useRef<number>();
  const lastFrameTime = useRef(performance.now());

  useImperativeHandle(ref, () => ({
    render: (drawFrame: (ctx: CanvasRenderingContext2D) => void) => {
      const bufferCanvas = bufferCanvasRef.current;
      const displayCanvas = displayCanvasRef.current;
      if (!bufferCanvas || !displayCanvas) return;

      // Render to buffer
      const bufferCtx = bufferCanvas.getContext('2d');
      if (!bufferCtx) return;
      
      bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
      drawFrame(bufferCtx);

      // Copy to display
      const displayCtx = displayCanvas.getContext('2d');
      if (!displayCtx) return;
      
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(bufferCanvas, 0, 0);
    }
  }));

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

    // Scale both canvas contexts
    [displayCanvas, bufferCanvas].forEach(canvas => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.resetTransform();
        ctx.scale(scale, scale);
      }
    });
  }, []);

  }, [bufferCanvasRef, displayCanvasRef]);

  // Set up animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime.current >= 16) { // ~60fps
        renderFrame();
        lastFrameTime.current = timestamp;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
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
          className="absolute top-0 left-0 w-full h-full"
          style={{ visibility: "hidden" }} // Offscreen buffer
        />
        {children}
      </div>
    </CanvasContext.Provider>
  );
}
