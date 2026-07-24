import React, { useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";

type GridNode = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
  flashing: boolean;
  flashProgress: number;
  trailInfluence: number;
  lastTouched: number;
  jitterPhaseX: number;
  jitterPhaseY: number;
  opacity: number;
  noiseOffset1: number;
  noiseOffset2: number;
};

type ThemePalette = {
  nodeColor: string;
  flashColor: string;
  cloudDensity: number;
  cloudIntensity: number;
};

const CONFIG = {
  gridSpacing: 12,
  nodeSize: 1,
  flashFrequency: 24,
  flashDuration: 80,
  mouseTrailDensity: 0.3,
  mouseTrailDecay: 2500,
  mouseTrailWidth: 25,
  mouseJitterIntensity: 2.5,
  mouseJitterSpeed: 0.1,
  cloudScale: 0.0045,
  cloudFalloff: 0.5,
} as const;

const THEMES: Record<"light" | "dark", ThemePalette> = {
  light: {
    nodeColor: "#cccccc",
    flashColor: "#fa5902",
    cloudDensity: 0.4,
    cloudIntensity: 1,
  },
  dark: {
    nodeColor: "#5c6169",
    flashColor: "#fa5902",
    cloudDensity: 0.35,
    cloudIntensity: 0.85,
  },
};

function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function createNodes(width: number, height: number): GridNode[] {
  const nodes: GridNode[] = [];
  const spacing = CONFIG.gridSpacing;
  const numCols = Math.ceil(width / spacing);
  const numRows = Math.ceil(height / spacing);
  const spacingX = width / numCols;
  const spacingY = height / numRows;

  for (let y = spacingY / 2; y < height; y += spacingY) {
    for (let x = spacingX / 2; x < width; x += spacingX) {
      nodes.push({
        x,
        y,
        originalX: x,
        originalY: y,
        size: CONFIG.nodeSize,
        flashing: false,
        flashProgress: 0,
        trailInfluence: 0,
        lastTouched: 0,
        jitterPhaseX: Math.random() * Math.PI * 2,
        jitterPhaseY: Math.random() * Math.PI * 2,
        opacity: 0,
        noiseOffset1: Math.random() * 1000,
        noiseOffset2: Math.random() * 1000,
      });
    }
  }

  return nodes;
}

function nodeCloudOpacity(
  node: GridNode,
  cloudDensity: number,
  cloudIntensity: number,
) {
  const noise1 = Math.sin(node.noiseOffset1 * CONFIG.cloudScale);
  const noise2 = Math.sin(node.noiseOffset2 * CONFIG.cloudScale);
  const combined = (noise1 + noise2) / 2;
  const densityAdjusted = (combined + 1) / 2 - cloudDensity;
  const falloff = Math.max(0, densityAdjusted / CONFIG.cloudFalloff);
  return Math.min(1, falloff * cloudIntensity);
}

/**
 * Animated dot-grid hero background with mouse trail + flash accents.
 * Adapts node/flash colors for light and dark appearance; pauses offscreen.
 */
export const AnimatedDotGrid = () => {
  const { appearance } = useTheme();
  const themeKey = appearance === "dark" ? "dark" : "light";
  const palette = THEMES[themeKey];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GridNode[]>([]);
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseMoveRef = useRef(0);
  const animationFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const flashCounterRef = useRef(0);
  const fpsRef = useRef(60);
  const paletteRef = useRef(palette);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  paletteRef.current = palette;

  // Size canvas to wrapper; rebuild the node grid on resize
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const { width, height } = wrapper.getBoundingClientRect();
      if (width === canvas.width && height === canvas.height) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
      nodesRef.current = createNodes(width, height);
      lastTimeRef.current = 0;
      flashCounterRef.current = 0;
      setIsInitialized(false);
      requestAnimationFrame(() => setIsInitialized(true));
    };

    const debouncedUpdate = debounce(updateDimensions, 250);

    if (document.readyState === "complete") {
      updateDimensions();
    } else {
      window.addEventListener("load", updateDimensions);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === wrapperRef.current) {
          debouncedUpdate();
        }
      }
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener("load", updateDimensions);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Track pointer relative to the canvas for trail + jitter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      lastMouseMoveRef.current = Date.now();
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = null;
      lastMouseMoveRef.current = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Pause the loop when the hero leaves the viewport
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "50px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (
      !isInitialized ||
      !canvasRef.current ||
      !dimensions.width ||
      !dimensions.height ||
      !isVisible
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!nodesRef.current.length) {
      nodesRef.current = createNodes(dimensions.width, dimensions.height);
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (deltaTime > 0) {
        fpsRef.current = 0.9 * fpsRef.current + 0.1 * (1000 / deltaTime);
      }

      const { nodeColor, flashColor, cloudDensity, cloudIntensity } =
        paletteRef.current;
      const nodes = nodesRef.current;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      if (!reducedMotion) {
        const flashesPerFrame = CONFIG.flashFrequency / fpsRef.current;
        flashCounterRef.current += flashesPerFrame;
        let nodesToFlash = Math.floor(flashCounterRef.current);
        flashCounterRef.current -= nodesToFlash;
        nodesToFlash = Math.min(nodesToFlash, nodes.length / 10);

        for (let i = 0; i < nodesToFlash; i++) {
          const node = nodes[Math.floor(Math.random() * nodes.length)];
          if (!node.flashing) {
            node.flashing = true;
            node.flashProgress = 0;
          }
        }
      }

      const mousePosition = mousePositionRef.current;
      const isMouseMoving = Date.now() - lastMouseMoveRef.current < 100;

      // Ease nodes back toward their grid homes when not jittering
      for (const node of nodes) {
        if (node.x !== node.originalX || node.y !== node.originalY) {
          node.x = node.x * 0.9 + node.originalX * 0.1;
          node.y = node.y * 0.9 + node.originalY * 0.1;
          if (
            Math.abs(node.x - node.originalX) < 0.1 &&
            Math.abs(node.y - node.originalY) < 0.1
          ) {
            node.x = node.originalX;
            node.y = node.originalY;
          }
        }
      }

      if (!reducedMotion && mousePosition && isMouseMoving) {
        const nearby: number[] = [];
        const trailWidth = CONFIG.mouseTrailWidth;

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = mousePosition.x - node.originalX;
          const dy = mousePosition.y - node.originalY;
          if (Math.hypot(dx, dy) < trailWidth) {
            nearby.push(i);
          }
        }

        for (let i = nearby.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nearby[i], nearby[j]] = [nearby[j], nearby[i]];
        }

        const affectCount = Math.floor(nearby.length * CONFIG.mouseTrailDensity);
        for (let i = 0; i < affectCount; i++) {
          const node = nodes[nearby[i]];
          node.trailInfluence = 1;
          node.lastTouched = timestamp;
          node.jitterPhaseX += CONFIG.mouseJitterSpeed * (0.5 + Math.random());
          node.jitterPhaseY += CONFIG.mouseJitterSpeed * (0.5 + Math.random());
          node.x =
            node.originalX +
            Math.sin(node.jitterPhaseX) * CONFIG.mouseJitterIntensity;
          node.y =
            node.originalY +
            Math.cos(node.jitterPhaseY) * CONFIG.mouseJitterIntensity;
        }
      }

      for (const node of nodes) {
        node.opacity = nodeCloudOpacity(node, cloudDensity, cloudIntensity);

        if (node.trailInfluence > 0) {
          const timeSinceTouch = timestamp - node.lastTouched;
          node.trailInfluence = Math.max(
            0,
            Math.pow(1 - timeSinceTouch / CONFIG.mouseTrailDecay, 2),
          );
          if (node.trailInfluence <= 0.01) {
            node.trailInfluence = 0;
          }
        }

        ctx.beginPath();

        if (node.flashing) {
          const flashIntensity = Math.sin(
            (node.flashProgress / CONFIG.flashDuration) * Math.PI,
          );
          ctx.fillStyle = flashColor;
          ctx.globalAlpha = flashIntensity;
          node.flashProgress += 1;
          if (node.flashProgress >= CONFIG.flashDuration) {
            node.flashing = false;
            node.flashProgress = 0;
          }
        } else if (node.trailInfluence > 0) {
          ctx.fillStyle = flashColor;
          const baseOpacity = 0.5;
          ctx.globalAlpha =
            baseOpacity + (1 - baseOpacity) * node.trailInfluence;
        } else {
          ctx.fillStyle = nodeColor;
          ctx.globalAlpha = node.opacity;
        }

        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, dimensions.width, dimensions.height, isVisible]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          opacity: isInitialized ? 1 : 0,
          transition: "opacity 1s ease",
          // Soft bottom fade into the page surface behind the hero
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />
    </div>
  );
};
