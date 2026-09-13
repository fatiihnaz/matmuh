"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPAN = Math.sqrt(3);
const SAMPLES = 1200;
const K_MAX = 45;
const K_REVEAL = 30;
const BASE = -0.5;
const CAP = 1.2;
const SHIFT = -1.775;

const LETTERS = [
  [[-2.4, BASE], [-2.4, CAP]],
  [[1.95, CAP], [2.5, 0.35]],
  [[3.05, CAP], [2.5, 0.35]],
  [[2.5, 0.35], [2.5, BASE]],
  [[3.4, CAP], [4.5, CAP]],
  [[3.95, CAP], [3.95, BASE]],
  [[4.85, CAP], [4.85, BASE], [5.95, BASE], [5.95, CAP]],
];

const DOTS = [
  [5.1, 1.5],
  [5.7, 1.5],
];

const curve = (x, k) =>
  Math.cbrt(x) ** 2 + 0.9 * Math.sin(k * x) * Math.sqrt(Math.max(0, 3 - x * x));

const clamp = (value) => Math.min(K_MAX, Math.max(0, value));

export const revealAt = (k) =>
  Math.min(1, Math.max(0, (k - K_REVEAL) / (K_MAX - K_REVEAL)));

function paint(canvas, unit, k, alpha, axes, lift) {
  const { clientWidth: width, clientHeight: height } = canvas;
  if (!width || !height) return;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const reveal = revealAt(k);
  const cx = width / 2 + SHIFT * unit * reveal;
  const cy = height / 2 + lift * unit;
  const px = (u) => cx + u * unit;
  const py = (v) => cy - v * unit;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (axes) {
    const across = ctx.createLinearGradient(0, 0, width, 0);
    across.addColorStop(0, "rgba(173,151,111,0)");
    across.addColorStop(0.5, "rgba(173,151,111,0.32)");
    across.addColorStop(1, "rgba(173,151,111,0)");
    ctx.strokeStyle = across;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    const down = ctx.createLinearGradient(0, 0, 0, height);
    down.addColorStop(0, "rgba(173,151,111,0)");
    down.addColorStop(0.5, "rgba(173,151,111,0.32)");
    down.addColorStop(1, "rgba(173,151,111,0)");
    ctx.strokeStyle = down;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i <= SAMPLES; i++) {
    const x = -SPAN + (2 * SPAN * i) / SAMPLES;
    const dx = px(x);
    const dy = py(curve(x, k));
    if (i === 0) ctx.moveTo(dx, dy);
    else ctx.lineTo(dx, dy);
  }
  ctx.strokeStyle = `rgba(173,151,111,${alpha})`;
  ctx.lineWidth = unit / 45;
  ctx.stroke();

  if (reveal <= 0) return;

  ctx.strokeStyle = `rgba(173,151,111,${alpha * reveal})`;
  ctx.fillStyle = `rgba(173,151,111,${alpha * reveal})`;
  ctx.lineWidth = unit / 28;

  for (const stroke of LETTERS) {
    ctx.beginPath();
    stroke.forEach(([u, v], index) => {
      if (index === 0) ctx.moveTo(px(u), py(v));
      else ctx.lineTo(px(u), py(v));
    });
    ctx.stroke();
  }

  for (const [u, v] of DOTS) {
    ctx.beginPath();
    ctx.arc(px(u), py(v), unit / 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function useHeart(unit, dragSpan, alpha, axes, lift = 0) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [k, setK] = useState(0);
  const [live, setLive] = useState(false);

  const draw = useCallback(() => {
    if (canvasRef.current) paint(canvasRef.current, unit, k, alpha(live, k), axes, lift);
  }, [unit, k, live, alpha, axes, lift]);

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const handlers = {
    onPointerDown: (event) => {
      dragRef.current = { x: event.clientX, k };
      event.currentTarget.setPointerCapture(event.pointerId);
      setLive(true);
    },
    onPointerMove: (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      setK(clamp(drag.k + ((event.clientX - drag.x) / dragSpan) * K_MAX));
    },
    onPointerUp: (event) => {
      const drag = dragRef.current;
      dragRef.current = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      setLive(false);
      if (drag && Math.abs(drag.k - k) < 0.5) setK(0);
    },
    onPointerEnter: () => setLive(true),
    onPointerLeave: () => !dragRef.current && setLive(false),
  };

  return { canvasRef, k, live, handlers };
}

export default function HeartCurve() {
  const { canvasRef, k, live, handlers } = useHeart(
    56,
    300,
    (isLive, value) => (isLive || value > 0 ? 0.9 : 0.55),
  );

  const lifted = k > 0;
  const reveal = revealAt(k);

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 hidden overflow-hidden lg:block ${
          lifted || live ? "z-20" : "z-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-primary-500 transition-opacity duration-300 motion-reduce:transition-none"
          style={{ opacity: (k / K_MAX) * 0.72 }}
        />

        <canvas ref={canvasRef} className="absolute inset-0 size-full" />

        <span
          className="absolute left-1/2 top-1/2 -mt-40 font-mono text-[10px] text-secondary-500/60 transition-opacity duration-200 motion-reduce:transition-none"
          style={{
            opacity: live ? 1 - reveal : 0,
            transform: `translateX(calc(-50% + ${SHIFT * 56 * reveal}px))`,
          }}
        >
          k = {k.toFixed(1)}
        </span>
      </div>

      <div
        aria-hidden
        {...handlers}
        onPointerCancel={handlers.onPointerUp}
        className={`absolute z-30 hidden cursor-ew-resize touch-none lg:block ${
          lifted
            ? "inset-0"
            : "left-1/2 top-1/2 h-32 w-64 -translate-x-1/2 -translate-y-1/2"
        }`}
      />
    </>
  );
}

export function HeartMark() {
  const { canvasRef, handlers } = useHeart(28, 150, () => 0.75, true, 0.355);

  return (
    <div
      aria-hidden
      {...handlers}
      onPointerCancel={handlers.onPointerUp}
      className="relative z-10 mt-6 h-32 w-full max-w-xs shrink-0 touch-pan-y select-none lg:hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
