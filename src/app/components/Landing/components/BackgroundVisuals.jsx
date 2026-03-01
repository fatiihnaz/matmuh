import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const BackgroundVisuals = React.memo(() => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeGraph, setActiveGraph] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const { functionPaths, mathCodeNodes } = useMemo(() => {
    const width = 1600;
    const height = 1000;
    const points = 300;
    const nodeCount = isMobile ? 12 : 24;
    const cols = isMobile ? 2 : 6;
    const rows = Math.ceil(nodeCount / cols);

    let sine = "",
      gauss = "",
      cubic = "",
      damped = "";

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const nx = (i / points) * 2 - 1;

      const sineFreq = isMobile ? 6 : 3;
      const ySin =
        height / 2 + Math.sin(nx * Math.PI * sineFreq) * (isMobile ? 200 : 180);
      sine += `${i === 0 ? "M" : "L"} ${x} ${ySin} `;

      const sigma = isMobile ? 0.04 : 0.08;
      const yGauss = height / 2 - Math.exp(-(nx * nx) / sigma) * 280 + 120;
      gauss += `${i === 0 ? "M" : "L"} ${x} ${yGauss} `;

      const cubicFactor = isMobile ? 4.5 : 1.0;
      const yCubic = height / 2 - Math.pow(nx * cubicFactor, 3) * 300;
      cubic += `${i === 0 ? "M" : "L"} ${x} ${yCubic} `;

      const dampedFreq = isMobile ? 12 : 8;
      const decayRate = isMobile ? 4 : 3;
      const yDamped =
        height / 2 +
        Math.exp(-Math.abs(nx) * decayRate) *
          Math.cos(nx * Math.PI * dampedFreq) *
          250;
      damped += `${i === 0 ? "M" : "L"} ${x} ${yDamped} `;
    }

    const paths = [
      { id: "sine", d: sine, stroke: "#626D9E", sw: isMobile ? 3 : 1.5 },
      { id: "gauss", d: gauss, stroke: "#AD976F", sw: isMobile ? 4 : 2 },
      { id: "damped", d: damped, stroke: "#8E99C2", sw: isMobile ? 3 : 1.5 },
      { id: "cubic", d: cubic, stroke: "#4A5585", sw: isMobile ? 3 : 1.5 },
    ];

    const symbols = [
      "∂²u/∂t² = c²∇²u",
      "∮_C E · dl = -dΦ_B/dt",
      "O(n log n)",
      "∫_a^b f(x)dx = F(b) - F(a)",
      "d/dx [∫_a^x f(t)dt] = f(x)",
      "∇×B = μ₀J + μ₀ε₀(∂E/∂t)",
      "e^{iπ} + 1 = 0",
      "λ",
      "μ",
      "σ²",
      "∫_(-∞)^∞ e^{-x²} dx = √π",
      "y'' + p(x)y' + q(x)y = 0",
      "lim_{h→0} [f(x+h)-f(x)]/h",
      "w^T x + b = 0",
      "L = ∫ √(1 + (dy/dx)²) dx",
      "P(A|B) = [P(B|A)P(A)] / P(B)",
      "L(y, ŷ) = −Σ y log(ŷ)",
      "softmax(z)ᵢ = eᶻⁱ / Σ eᶻʲ",
      "ReLU(x) = max(0, x)",
      "E[X] = Σ x P(X=x)",
      "Var(X) = E[X²] − (E[X])²",
      "β̂ = (XᵀX)⁻¹Xᵀy",
      "MSE = (1/n) Σ (y - ŷ)²",
      "∇²ϕ = 0",
      "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)",
      "lim_{n→∞} (1 + 1/n)ⁿ = e",
      "K(x, y) = exp(−γ ||x - y||²)",
      "Cov(X, Y) = E[(X-μₓ)(Y-μᵧ)]",
      "det(A - λI) = 0",
      "Tr(A) = Σ aᵢᵢ",
      "C(n,k) = n! / (k!(n-k)!)",
    ];

    const nodes = Array.from({ length: nodeCount }).map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      const vw =
        typeof window !== "undefined"
          ? window.innerWidth
          : isMobile
          ? 390
          : 1200;
      const vh =
        typeof window !== "undefined"
          ? window.innerHeight
          : isMobile
          ? 844
          : 1000;

      let fontSize = isMobile ? 10 + Math.random() * 2 : 14 + Math.random() * 6;
      let estimatedWidthPx = symbol.length * fontSize * 0.6;
      const cellWidthPx = vw / cols;
      const maxAllowedWidthPx = cellWidthPx * 0.8;

      if (estimatedWidthPx > maxAllowedWidthPx) {
        fontSize = Math.max(
          8,
          fontSize * (maxAllowedWidthPx / estimatedWidthPx)
        );
        estimatedWidthPx = symbol.length * fontSize * 0.6;
      }

      const cellWidthPct = 100 / cols;
      const cellHeightPct = 100 / rows;
      const estimatedWidthPct = (estimatedWidthPx / vw) * 100;
      const estimatedHeightPct = (fontSize / vh) * 100;

      const paddingPctX = 2;
      const paddingPctY = 2;

      const safeMaxLeft = Math.max(
        0,
        cellWidthPct - estimatedWidthPct - paddingPctX * 2
      );
      const safeMaxTop = Math.max(
        0,
        cellHeightPct - estimatedHeightPct - paddingPctY * 2
      );

      const left =
        col * cellWidthPct + paddingPctX + Math.random() * safeMaxLeft;
      const top =
        row * cellHeightPct + paddingPctY + Math.random() * safeMaxTop;

      return {
        id: `node-${i}-${Math.random().toString(36).slice(2, 6)}`,
        left: `${left}%`,
        top: `${top}%`,
        symbol,
        fontSize,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 10,
      };
    });

    return { functionPaths: paths, mathCodeNodes: nodes };
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGraph((prev) => (prev + 1) % functionPaths.length);
    }, 9500);
    return () => clearInterval(interval);
  }, [functionPaths.length]);

  return (
    <>
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <svg
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMid slice"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="blueprint-grid-small"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              x="800"
              y="500"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#626D9E"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </pattern>
            <pattern
              id="blueprint-grid-large"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
              x="800"
              y="500"
            >
              <rect
                width="100"
                height="100"
                fill="url(#blueprint-grid-small)"
              />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#626D9E"
                strokeWidth="1.2"
                opacity="0.7"
              />
            </pattern>
          </defs>
          <rect width="1600" height="1000" fill="url(#blueprint-grid-large)" />
        </svg>
      </div>

      {mathCodeNodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute whitespace-nowrap text-primary-300/60"
          style={{
            left: node.left,
            top: node.top,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: `${node.fontSize}px`,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 0.5, 0],
            y: [0, -15, -30],
            scale: [0.9, 1, 0.9],
          }}
          transition={{
            duration: node.duration,
            delay: node.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            times: [0, 0.5, 1],
          }}
        >
          {node.symbol}
        </motion.div>
      ))}

      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] opacity-60"
      >
        <motion.line
          x1="0"
          y1="500"
          x2="1600"
          y2="500"
          stroke="#626D9E"
          strokeWidth="1.5"
          strokeDasharray="6,6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.line
          x1="800"
          y1="0"
          x2="800"
          y2="1000"
          stroke="#626D9E"
          strokeWidth="1.5"
          strokeDasharray="6,6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.path
          key={functionPaths[activeGraph].id}
          d={functionPaths[activeGraph].d}
          fill="none"
          stroke={functionPaths[activeGraph].stroke}
          strokeWidth={functionPaths[activeGraph].width}
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
      </svg>
    </>
  );
});

export default BackgroundVisuals;