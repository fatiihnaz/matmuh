"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  DESKTOP_FIELD,
  MOBILE_FIELD,
  buildSymbolNodes,
  buildCurvePaths,
  createNode,
  pickCell,
} from "./heroField";

const DESKTOP_NODES = buildSymbolNodes(DESKTOP_FIELD);
const MOBILE_NODES = buildSymbolNodes(MOBILE_FIELD);

const DESKTOP_CURVES = buildCurvePaths({ mobile: false });
const MOBILE_CURVES = buildCurvePaths({ mobile: true });

const GRID_MAJOR = "rgba(98,109,158,0.49)";
const GRID_MINOR = "rgba(98,109,158,0.28)";

const gridLine = (dir, color, half) =>
  `linear-gradient(to ${dir}, transparent calc(50% - ${half}px), ${color} calc(50% - ${half}px) calc(50% + ${half}px), transparent calc(50% + ${half}px))`;

const BLUEPRINT_GRID = {
  backgroundImage: [
    gridLine("right", GRID_MAJOR, 0.75),
    gridLine("bottom", GRID_MAJOR, 0.75),
    gridLine("right", GRID_MINOR, 0.3),
    gridLine("bottom", GRID_MINOR, 0.3),
  ].join(", "),
  backgroundSize: "125px 125px, 125px 125px, 25px 25px, 25px 25px",
  backgroundPosition: "center",
};

const SymbolField = React.memo(function SymbolField({
  field,
  nodes,
  className,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const taken = new Array(field.cols * field.rows).fill(false);
    nodes.forEach((node) => {
      taken[node.cell] = true;
    });

    const respawn = (event) => {
      const el = event.target;
      if (el.dataset.cell === undefined) return;

      const previous = Number(el.dataset.cell);
      const cell = pickCell(Math.random, taken);
      taken[previous] = false;
      taken[cell] = true;

      const next = createNode(Math.random, field, cell);
      el.dataset.cell = cell;
      el.textContent = next.symbol;
      el.style.left = next.left;
      el.style.top = next.top;
      el.style.fontSize = next.fontSize;
    };

    root.addEventListener("animationiteration", respawn);
    return () => root.removeEventListener("animationiteration", respawn);
  }, [field, nodes]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {nodes.map((node) => (
        <div
          key={node.id}
          data-cell={node.cell}
          className={`mm-float absolute whitespace-nowrap ${field.tone}`}
          style={{
            left: node.left,
            top: node.top,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: node.fontSize,
            "--mm-dur": node.duration,
            "--mm-delay": node.delay,
          }}
        >
          {node.symbol}
        </div>
      ))}
    </div>
  );
});

function CurveLayer({ curves, activeGraph, reducedMotion, className }) {
  const curve = curves[activeGraph];

  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118vw] h-[118vh] opacity-60 ${className}`}
    >
      <line
        x1="0"
        y1="500"
        x2="1600"
        y2="500"
        stroke="#626D9E"
        strokeWidth="1.5"
        strokeDasharray="6,6"
        opacity="0.5"
      />
      <line
        x1="800"
        y1="0"
        x2="800"
        y2="1000"
        stroke="#626D9E"
        strokeWidth="1.5"
        strokeDasharray="6,6"
        opacity="0.5"
      />
      {reducedMotion ? (
        <path
          d={curve.d}
          fill="none"
          stroke={curve.stroke}
          strokeWidth={curve.sw}
          opacity="0.6"
        />
      ) : (
        <motion.path
          key={curve.id}
          d={curve.d}
          fill="none"
          stroke={curve.stroke}
          strokeWidth={curve.sw}
          initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            pathOffset: [0, 0, 0, 1],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 9,
            times: [0, 0.4, 0.7, 1],
            ease: "easeInOut",
          }}
        />
      )}
    </svg>
  );
}

const BackgroundVisuals = React.memo(function BackgroundVisuals({
  active = true,
  reducedMotion = false,
}) {
  const [activeGraph, setActiveGraph] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) return;

    let timer;
    const tick = () => {
      setActiveGraph((prev) => (prev + 1) % DESKTOP_CURVES.length);
      timer = setTimeout(tick, 9500);
    };
    timer = setTimeout(tick, 9500);

    return () => clearTimeout(timer);
  }, [active, reducedMotion]);

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={BLUEPRINT_GRID}
      />

      <SymbolField
        field={DESKTOP_FIELD}
        nodes={DESKTOP_NODES}
        className="hidden md:block"
      />
      <SymbolField
        field={MOBILE_FIELD}
        nodes={MOBILE_NODES}
        className="md:hidden"
      />

      <CurveLayer
        curves={DESKTOP_CURVES}
        activeGraph={activeGraph}
        reducedMotion={reducedMotion}
        className="hidden md:block"
      />
      <CurveLayer
        curves={MOBILE_CURVES}
        activeGraph={activeGraph}
        reducedMotion={reducedMotion}
        className="md:hidden"
      />
    </>
  );
});

export default BackgroundVisuals;
