import React, { useEffect, useRef } from "react";
import { Button } from "@telegraph/button";

type ButtonRootProps = React.ComponentProps<typeof Button.Root>;
type ButtonTextProps = React.ComponentProps<typeof Button.Text>;

export interface AgentDeeplinkButtonProps
  extends Omit<
    ButtonRootProps,
    "as" | "href" | "target" | "rel" | "variant" | "children"
  > {
  text?: string;
  prompt?: string;
  autoSubmit?: boolean;
  textProps?: ButtonTextProps;
}

const GRID_SIZE = 3;
const CANVAS_SIZE = 16;
const CELL_SIZE = 4;
const CELL_GAP = 1;
const GRID_OFFSET =
  (CANVAS_SIZE - (GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP)) / 2;

type GridCell = {
  opacity: number;
  targetOpacity: number;
  nextChangeAt: number;
};

const createCell = (): GridCell => ({
  opacity: 0.2 + Math.random() * 0.8,
  targetOpacity: 0.2 + Math.random() * 0.8,
  nextChangeAt: performance.now() + 150 + Math.random() * 600,
});

const AgentGridIcon = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, createCell);
    let frameId = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      cells.forEach((cell, index) => {
        if (time >= cell.nextChangeAt) {
          cell.targetOpacity = 0.15 + Math.random() * 0.85;
          cell.nextChangeAt = time + 180 + Math.random() * 900;
        }

        cell.opacity += (cell.targetOpacity - cell.opacity) * 0.1;

        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const x = GRID_OFFSET + col * (CELL_SIZE + CELL_GAP);
        const y = GRID_OFFSET + row * (CELL_SIZE + CELL_GAP);

        ctx.fillStyle = `rgba(255, 255, 255, ${cell.opacity})`;
        ctx.beginPath();
        ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 0.75);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: "block",
        flexShrink: 0,
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
      }}
    />
  );
};

export const AgentDeeplinkButton = ({
  text = "Try in Knock",
  prompt,
  autoSubmit = true,
  textProps = {},
  ...rest
}: AgentDeeplinkButtonProps) => {
  const params = new URLSearchParams();

  if (prompt) {
    params.set("q", prompt);
  }

  if (autoSubmit === false) {
    params.set("autoSubmit", "false");
  }

  const queryString = params.toString();
  const href = `https://dashboard.knock.app/~/agents${
    queryString ? `?${queryString}` : ""
  }`;

  return (
    <Button.Root
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="solid"
      color="accent"
      mt="4"
      {...rest}
    >
      <AgentGridIcon />
      <Button.Text size="2" {...textProps}>
        {text}
      </Button.Text>
    </Button.Root>
  );
};
