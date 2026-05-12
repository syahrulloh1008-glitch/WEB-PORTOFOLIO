import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Typewriter Hook ────────────────────────────────────────────────────────
function useTypewriter(text, startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    let dir = 1;
    let pause = 0;
    let timer;

    function tick() {
      if (pause > 0) { pause--; timer = setTimeout(tick, 80); return; }
      if (dir === 1) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { dir = -1; pause = 40; }
        timer = setTimeout(tick, 65);
      } else {
        setDisplayed(text.slice(0, i - 1));
        i--;
        if (i <= 0) { dir = 1; pause = 20; }
        timer = setTimeout(tick, 35);
      }
    }
    tick();
    return () => clearTimeout(timer);
  }, [started, text]);

  return { displayed, started };
}

// ─── Particle System ────────────────────────────────────────────────────────
const PARTICLE_COLORS = ["#00FFFF", "#A855F7", "#FF00FF", "#ffffff"];
const PARTICLE_COUNT = 30;

function ParticleLayer() {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 55 + Math.random() * 35,
      size: 1.5 + Math.random() * 3,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      duration: 6 + Math.random() * 10,
      delay: -Math.random() * 10,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}44`,
            animation: `particle-float ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Retro Grid ─────────────────────────────────────────────────────────────
function RetroGrid() {
  return (
    <div className="absolute bottom-0 left-[-20%] right-[-20%] h-[55%] overflow-hidden">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transformOrigin: "top center",
          animation: "retro-grid-move 2.5s linear infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #050816 0%, transparent 40%, transparent 70%, #050816 100%)",
        }}
      />
    </div>
  );
}

// ─── Circuit SVG Lines ──────────────────────────────────────────────────────
function CircuitLines() {
  const lines = [
    { points: "30,80 30,140 90,140 90,200", color: "#00FFFF", delay: "0s", dur: "3.2s", dashDur: "4s" },
    { points: "90,200 90,240 150,240 150,300 210,300", color: "#00FFFF", delay: "0.8s", dur: "3.2s", dashDur: "4s" },
    { points: "620,120 620,180 560,180 560,260", color: "#A855F7", delay: "1s", dur: "4s", dashDur: "5s" },
    { points: "560,260 560,310 500,310 500,380", color: "#A855F7", delay: "1.8s", dur: "4s", dashDur: "5s" },
    { points: "70,400 130,400 130,460 200,460", color: "#FF00FF", delay: "0.5s", dur: "5s", dashDur: "6s" },
    { points: "610,380 550,380 550,440 480,440 480,500", color: "#00FFFF", delay: "2s", dur: "3.8s", dashDur: "5.5s" },
    { points: "320,30 320,70 280,70 280,110", color: "#A855F7", delay: "0.7s", dur: "4.5s", dashDur: "6s" },
    { points: "400,540 400,500 450,500 450,450 510,450", color: "#FF00FF", delay: "1.5s", dur: "3.5s", dashDur: "5s" },
  ];

  const nodes = [
    { cx: 90, cy: 200, r: 3, color: "#00FFFF", delay: "0s", dur: "3.2s" },
    { cx: 560, cy: 260, r: 3, color: "#A855F7", delay: "1s", dur: "4s" },
    { cx: 480, cy: 500, r: 3, color: "#00FFFF", delay: "2s", dur: "3.8s" },
    { cx: 280, cy: 110, r: 2.5, color: "#A855F7", delay: "0.7s", dur: "4.5s" },
  ];

  const rings = [
    { cx: 30, cy: 80, r: 4, color: "#00FFFF", delay: "0s", dur: "3.2s" },
    { cx: 620, cy: 120, r: 4, color: "#A855F7", delay: "1s", dur: "4s" },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 680 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <style>{`
        @keyframes circuit-pulse {
          0%,100% { stroke-opacity: 0.12; }
          50% { stroke-opacity: 0.65; }
        }
        @keyframes circuit-fill-pulse {
          0%,100% { opacity: 0.12; }
          50% { opacity: 0.55; }
        }
        @keyframes circuit-dash {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0;   }
        }
      `}</style>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {lines.map((l, i) => (
          <polyline
            key={i}
            points={l.points}
            stroke={l.color}
            strokeWidth="1"
            strokeDasharray="8,4"
            style={{
              animation: `circuit-pulse ${l.dur} ${l.delay} ease-in-out infinite,
                          circuit-dash ${l.dashDur} ${l.delay} linear infinite`,
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx} cy={n.cy} r={n.r}
            fill={n.color}
            style={{
              animation: `circuit-fill-pulse ${n.dur} ${n.delay} ease-in-out infinite`,
            }}
          />
        ))}
        {rings.map((r, i) => (
          <circle
            key={i}
            cx={r.cx} cy={r.cy} r={r.r}
            fill="none"
            stroke={r.color}
            strokeWidth="1"
            style={{
              animation: `circuit-fill-pulse ${r.dur} ${r.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

// ─── Scroll Indicator ────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5"
      style={{ x: "-50%" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      >
        <div
          className="w-6 h-9 rounded-xl relative"
          style={{ border: "2px solid rgba(0,255,255,0.4)" }}
        >
          <motion.div
            className="absolute top-1.5 left-1/2 w-0.5 h-2 rounded-full"
            style={{ background: "rgba(0,255,255,0.7)", x: "-50%" }}
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </motion.div>
      <span
        style={{
          fontFamily: "'Rajdhani', monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(0,255,255,0.35)",
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

// ─── Status Dot ─────────────────────────────────────────────────────────────
function StatusDot() {
  return (
    <span className="relative inline-block w-2 h-2 rounded-full mr-2 align-middle"
      style={{ background: "#00FFFF" }}>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "#00FFFF",
          animation: "dot-ping 1.5s ease-out infinite",
        }}
      />
    </span>
  );
}

// ─── Global CSS (injected once) ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes retro-grid-move {
    from { transform: perspective(400px) rotateX(55deg) translateY(0); }
    to   { transform: perspective(400px) rotateX(55deg) translateY(60px); }
  }
  @keyframes particle-float {
    0%   { transform: translateY(0)     scale(1);   opacity: 0;   }
    20%  {                                           opacity: 1;   }
    80%  {                                           opacity: 0.6; }
    100% { transform: translateY(-320px) scale(0.3); opacity: 0;   }
  }
  @keyframes cursor-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes dot-ping {
    0%   { transform: scale(1);   opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
`;

// ─── Hero Section ────────────────────────────────────────────────────────────
const TAGLINE = "Computer Network Engineer | Future Tech Architect";
const BADGES = [
  { label: "CISCO CERTIFIED",  style: { border: "1px solid rgba(0,255,255,0.35)",  color: "rgba(0,255,255,0.7)",  background: "rgba(0,255,255,0.05)"  } },
  { label: "NETWORK ARCHITECT", style: { border: "1px solid rgba(168,85,247,0.35)", color: "rgba(168,85,247,0.7)", background: "rgba(168,85,247,0.05)" } },
  { label: "CLOUD ENGINEER",   style: { border: "1px solid rgba(255,0,255,0.35)",  color: "rgba(255,0,255,0.7)",  background: "rgba(255,0,255,0.05)"  } },
];

export default function Hero() {
  const { displayed, started } = useTypewriter(TAGLINE, 1200);

  useEffect(() => {
    if (document.getElementById("hero-global-css")) return;
    const el = document.createElement("style");
    el.id = "hero-global-css";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050816" }}
    >
      <RetroGrid />
      <ParticleLayer />
      <CircuitLines />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[15%] w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[20%] left-[38%] w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,0,255,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 11, letterSpacing: "0.4em",
            color: "rgba(0,255,255,0.55)",
            marginBottom: 20,
          }}
        >
          <StatusDot />
          AVAILABLE FOR HIRE · INDONESIA
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(8px)" }}
          animate={{ opacity: 1, letterSpacing: "0.08em", filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(38px, 7vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#fff",
            textShadow: "0 0 7px #00FFFF, 0 0 18px #00FFFF, 0 0 40px rgba(0,255,255,0.6), 0 0 80px rgba(0,255,255,0.25), 0 0 2px #fff",
            marginBottom: 8,
          }}
        >
          JOHN{" "}
          <span style={{
            color: "#A855F7",
            textShadow: "0 0 7px #A855F7, 0 0 18px #A855F7, 0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.25)",
          }}>
            DOE
          </span>
        </motion.h1>

        {/* Typewriter tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: started ? 1 : 0, y: started ? 0 : 12 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(14px, 2.5vw, 20px)",
            fontWeight: 500,
            color: "rgba(224,224,255,0.75)",
            letterSpacing: "0.08em",
            height: 32,
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#00FFFF" }}>{displayed}</span>
          <span style={{
            display: "inline-block",
            color: "#00FFFF",
            animation: "cursor-blink 0.8s step-end infinite",
            marginLeft: 2,
          }}>|</span>
        </motion.div>

        {/* Badges */}
        <motion.div
          className="flex gap-3 justify-center flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{ marginBottom: 44 }}
        >
          {BADGES.map((b) => (
            <span
              key={b.label}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 11,
                letterSpacing: "0.15em",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 2,
                ...b.style,
              }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ y: -3, boxShadow: "0 0 40px rgba(0,255,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              padding: "13px 28px",
              background: "linear-gradient(135deg, rgba(0,255,255,0.18), rgba(168,85,247,0.18))",
              border: "1px solid #00FFFF",
              color: "#00FFFF",
              borderRadius: 2,
              boxShadow: "0 0 18px rgba(0,255,255,0.25)",
              cursor: "pointer",
            }}
          >
            VIEW PORTFOLIO
          </motion.button>
          <motion.button
            whileHover={{ y: -3, borderColor: "#FF00FF", color: "#FF00FF", boxShadow: "0 0 20px rgba(255,0,255,0.3)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              padding: "13px 28px",
              background: "transparent",
              border: "1px solid rgba(255,0,255,0.4)",
              color: "rgba(255,0,255,0.8)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            CONTACT ME
          </motion.button>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
