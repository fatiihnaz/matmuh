"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search } from "lucide-react";

export default function Hero() {
  const containerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGraph, setActiveGraph] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { stiffness: 150, damping: 30, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const planeRotateX = useTransform(smoothMouseY, [-1, 1], [5, -5]);
  const planeRotateY = useTransform(smoothMouseX, [-1, 1], [-5, 5]);
  const planeTranslateZ = useTransform(smoothMouseY, [-1, 1], [-40, 40]);

  const { functionPaths, mathCodeNodes } = useMemo(() => {
    const width = 1600;
    const height = 1000;
    const points = 300;

    let sine = "",
      gauss = "",
      cubic = "",
      damped = "";

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const nx = (i / points) * 2 - 1;

      const ySin = height / 2 + Math.sin(nx * Math.PI * 3) * 180;
      sine += `${i === 0 ? "M" : "L"} ${x} ${ySin} `;

      const yGauss = height / 2 - Math.exp(-(nx * nx) / 0.08) * 250 + 120;
      gauss += `${i === 0 ? "M" : "L"} ${x} ${yGauss} `;

      const yCubic = height / 2 - Math.pow(nx, 3) * 300;
      cubic += `${i === 0 ? "M" : "L"} ${x} ${yCubic} `;

      const yDamped =
        height / 2 +
        Math.exp(-Math.abs(nx) * 3) * Math.cos(nx * Math.PI * 8) * 250;
      damped += `${i === 0 ? "M" : "L"} ${x} ${yDamped} `;
    }

    const paths = [
      { id: "sine", d: sine, stroke: "#626D9E", width: 1.5 },
      { id: "gauss", d: gauss, stroke: "#AD976F", width: 2 },
      { id: "damped", d: damped, stroke: "#8E99C2", width: 1.5 },
      { id: "cubic", d: cubic, stroke: "#4A5585", width: 1.5 },
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

    const nodes = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 12,
      fontSize: 10 + Math.random() * 10,
    }));

    return { functionPaths: paths, mathCodeNodes: nodes };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGraph((prev) => (prev + 1) % functionPaths.length);
    }, 9500);
    return () => clearInterval(interval);
  }, [functionPaths.length]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative w-full h-[60vh] min-h-[450px] sm:h-[70vh] sm:min-h-[600px] md:h-[80vh] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1D2445]"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        className="absolute inset-0 origin-center pointer-events-none z-0"
        style={{
          rotateX: planeRotateX,
          rotateY: planeRotateY,
          z: planeTranslateZ,
          transformStyle: "preserve-3d",
        }}
      >
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
            <rect
              width="1600"
              height="1000"
              fill="url(#blueprint-grid-large)"
            />
          </svg>
        </div>

        {mathCodeNodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute whitespace-nowrap text-[#626D9E]"
            style={{
              left: node.left,
              top: node.top,
              fontFamily: "var(--font-mono, monospace)",
              fontSize: `${node.fontSize}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -40],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: node.duration,
              delay: node.delay,
              ease: "linear",
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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <motion.div className="relative flex items-center justify-center w-[96vw] max-w-none aspect-[2.38] drop-shadow-[0_0_30px_rgba(29,36,69,0.5)]">
            <svg
              viewBox="0 0 368.25 154.79"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute w-full h-full overflow-visible z-0"
            >
              <motion.rect
                x=".5"
                y=".5"
                width="367.25"
                height="153.79"
                stroke="#3D4775"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M333.86,77.4c0,26.38-19.75,48.15-45.28,51.33-2.12.27-4.28.41-6.47.41H89.43c-2.9,0-5.74-.24-8.51-.7-24.52-4.06-43.23-25.37-43.23-51.04s18.71-46.99,43.23-51.05c2.77-.46,5.61-.7,8.51-.7h192.68c2.19,0,4.35.14,6.47.41,25.53,3.18,45.28,24.95,45.28,51.34Z"
                stroke="#626D9E"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M240.07,54.42h-107.91c-12.69,0-22.98,10.29-22.98,22.98s10.29,22.98,22.98,22.98h107.91c12.69,0,22.98-10.29,22.98-22.98s-10.29-22.98-22.98-22.98Z"
                stroke="#AD976F"
                strokeWidth="1.5"
                opacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 1.2 }}
              />
              <motion.polyline
                points="184.07 1.06 83.65 152.54 83.65 1.06 184.07 152.54 184.07 1.06 285.18 153.74 285.18 1.06 184.07 152.54"
                stroke="#3D4775"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 5, ease: "easeInOut", delay: 1.8 }}
              />
              <motion.line
                x1="37.69"
                y1="77.4"
                x2=".5"
                y2="77.4"
                stroke="#626D9E"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <motion.line
                x1="333.86"
                y1="77.4"
                x2="367.75"
                y2="77.4"
                stroke="#626D9E"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            </svg>

            <motion.div
              className="absolute w-[22%] max-w-[400px] aspect-square flex items-center justify-center z-20 overflow-visible pointer-events-none"
              animate={{
                filter: isHovered
                  ? "drop-shadow(0 0 6px #0D112B) drop-shadow(0 0 35px rgba(173,151,111,0.9))"
                  : "drop-shadow(0 0 4px #0D112B) drop-shadow(0 0 20px rgba(173,151,111,0.6))",
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 51.1 53.5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
              >
                <motion.path
                  d="M39.1489 26.458L51.1163 18.6097L36.774 18.7488L41.2827 5.16729L29.6771 13.6929L25.5025 0L21.3557 13.7856L9.74085 5.18584L14.3237 18.8138L0 18.6282L11.6519 26.792L0.0927704 35.1042L14.4721 34.863L9.8429 48.4445L21.4763 39.6128L25.4932 53.5469L29.8163 39.6777L41.2177 48.528L36.3287 34.798L50.9864 35.1598L39.1489 26.458ZM45.6521 20.3259L37.7759 25.4468L35.1877 23.545L36.2174 20.4465L45.6521 20.3259ZM38.3418 9.23989L35.1506 18.7674L31.2264 18.8045L30.1781 15.372L38.3418 9.23989ZM25.4932 5.73319L28.2392 14.7412L25.4375 16.8006L22.7565 14.8154L25.4932 5.73319ZM13.0342 9.70374L20.8454 15.4648L19.8157 18.8787L16.0307 18.8323L13.0342 9.70374ZM5.71463 20.4465H14.8896L15.975 23.6842L13.1826 25.688L5.71463 20.4465ZM5.25078 33.4065L13.062 27.7661L16.1513 29.9276L15.0473 33.1653L5.25078 33.4065ZM13.1826 43.8431L16.3554 34.8444L20.0847 34.7795L20.9846 37.9151L13.1826 43.8431ZM25.586 47.7023L22.9327 38.5181L25.6602 36.4493L28.2949 38.4903L25.586 47.7023ZM28.8051 36.7369L25.688 34.3435L22.4411 36.8111L21.3464 33.0168L16.9676 33.1282L18.3128 29.2968L14.5834 26.6807L17.849 24.315L16.578 20.4558H21.0681L22.2555 16.5038L25.5025 18.8972L28.7587 16.4481L30.0018 20.53L34.5847 20.4651L33.3323 24.1944L36.3102 26.4023L32.5994 28.8236L33.9074 32.7571L30.0482 32.5437L28.8051 36.7369ZM37.3863 43.305L30.3636 37.9244L31.3748 34.6682L34.5476 34.7424L37.3863 43.305ZM35.6422 32.8591L34.4548 29.5287L37.6646 27.4228L45.7356 33.425L35.6422 32.8591Z"
                  stroke="#AD976F"
                  strokeWidth="0.8"
                  fillRule="evenodd"
                  initial={{ pathLength: 0, fill: "rgba(173,151,111,0)" }}
                  animate={{ pathLength: 1, fill: "rgba(173,151,111,0.2)" }}
                  transition={{
                    pathLength: { duration: 4, ease: "easeInOut", delay: 2.5 },
                    fill: { duration: 2, delay: 5 },
                  }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(29,36,69,0.2)_0%,rgba(29,36,69,0.95)_100%)] pointer-events-none" />

      <motion.div
        className="relative z-[100] flex flex-col items-center px-4 w-full max-w-7xl sm:-mt-12"
        initial={{ opacity: 0, translateZ: 100 }}
        animate={{ opacity: 1, translateZ: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="text-center flex flex-col items-center w-full px-2">
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 sm:gap-6 mb-2 w-full max-w-full sm:max-w-none"
          >
            <div className="flex-shrink-0 w-2 h-2 rotate-45 bg-[#AD976F]" />
            <h1 className="text-[1.35rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase text-center break-words max-w-[80vw] sm:max-w-none">
              YILDIZ TEKNİK ÜNİVERSİTESİ
            </h1>
            <div className="flex-shrink-0 w-2 h-2 rotate-45 bg-[#AD976F]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 mt-4 sm:mt-6 w-full"
          >
            <span className="text-[#AD976F]/60 font-light text-2xl sm:text-4xl leading-none select-none">
              [
            </span>
            <h2 className="text-[1.05rem] sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[#AD976F] tracking-[0.15em] uppercase text-center">
              MATEMATİK MÜHENDİSLİĞİ
            </h2>
            <span className="text-[#AD976F]/60 font-light text-2xl sm:text-4xl leading-none select-none">
              ]
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="hidden sm:block w-full max-w-2xl pointer-events-auto mt-12 sm:mt-16"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-[#AD976F]/10 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 focus-within:shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aramak için yazınız..."
                className="w-full py-2.5 sm:py-3 px-6 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent font-medium"
              />
              <button className="px-5 text-slate-400 hover:text-[#1D2445] transition-colors border-l border-slate-100">
                <Search size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
