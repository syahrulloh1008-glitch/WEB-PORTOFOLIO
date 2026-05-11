import { useState, useEffect, useRef, useCallback } from "react";
import SkillsExperience from "./sections/SkillsExperience/SkillsExperience";
import ProjectsCertificates from "./sections/ProjectsCertificates/ProjectsCertificates";
import ContactSection from "./sections/ContactSection/ContactSection";
import ScrollProgressBar from "./components/ScrollProgressBar";
import useMechanicalSound from "./hooks/useMechanicalSound";
// ─── Google Fonts Loader ───────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

// ─── Global CSS & Cyberpunk Animations ──────────────────────────────────────
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --bg: #050816;
        --cyan: #00FFFF;
        --purple: #A855F7;
        --pink: #FF00FF;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg);
        color: #e0e0ff;
        font-family: 'Rajdhani', sans-serif;
        overflow-x: hidden;
        cursor: none !important;
      }
      button, a { cursor: none !important; }
      h1,h2,h3 { font-family: 'Orbitron', sans-serif; letter-spacing: 0.05em; }

      @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
      @keyframes flicker { 0%,100% { opacity:1; } 92%,96% { opacity:0.85; } 94% { opacity:0.6; } }
      @keyframes neon-pulse-cyan {
        0%,100% { text-shadow: 0 0 7px var(--cyan), 0 0 20px var(--cyan); }
        50% { text-shadow: 0 0 4px var(--cyan), 0 0 10px var(--cyan); }
      }
      @keyframes grid-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 60px; } }
      @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ─── Custom Cursor Component ────────────────────────────────────────────────
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState(Array.from({ length: 12 }, () => ({ x: -100, y: -100 })));
  const [hovering, setHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(el?.closest("a,button") != null);
    };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      setPos({ ...posRef.current });
      setTrail(prev => [posRef.current, ...prev.slice(0, 11)]);
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 99999 }}>
      {trail.map((t, i) => (
        <div key={i} style={{
          position: "fixed", left: t.x, top: t.y,
          width: 6 - i * 0.4, height: 6 - i * 0.4,
          background: i === 0 ? "#00FFFF" : "#A855F7",
          borderRadius: "50%", opacity: 1 - i / 12,
          transform: "translate(-50%,-50%)",
          boxShadow: `0 0 10px #00FFFF`,
        }} />
      ))}
      <div style={{
        position: "fixed", left: pos.x, top: pos.y,
        width: hovering ? 40 : 20, height: hovering ? 40 : 20,
        border: `1px solid ${hovering ? "#FF00FF" : "#00FFFF"}`,
        borderRadius: "50%", transform: "translate(-50%,-50%)",
        transition: "width 0.2s, height 0.2s",
      }} />
    </div>
  );
};

// ─── Loading Screen Component ───────────────────────────────────────────────
const LoadingScreen = ({ onDone }) => {
  const [lines, setLines] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const bootText = ["> memuat konten...", "> portofolio...", "> ACCESS_GRANTED", "> SYSTEM_READY"];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootText.length) {
        setLines(prev => [...prev, bootText[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onDone, 700);
        }, 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000, background: "#050816",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1, transition: "opacity 0.7s",
    }}>
      <div style={{ fontFamily: "Orbitron", color: "#00FFFF", fontSize: 24, marginBottom: 20 }}>PORTOFOLIO WEB</div>
      <div style={{ textAlign: "left", width: 200, fontFamily: "monospace", fontSize: 12, color: "#A855F7" }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

// ─── Navbar Component ───────────────────────────────────────────────────────
const Navbar = () => (
  <nav style={{
    position: "fixed", top: 0, width: "100%", padding: "20px 40px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    zIndex: 1000, background: "rgba(5,8,22,0.7)", backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0,255,255,0.1)"
  }}>
    <div style={{ fontFamily: "Orbitron", fontWeight: 900, color: "#00FFFF" }}>PORTOFOLIO</div>
    <div style={{ display: "flex", gap: 30, fontSize: 12, fontWeight: 600 }}>
      {["HOME", "SKILLS", "PROJECTS", "CONTACT"].map(item => (
        <span key={item} style={{ cursor: "none", color: "rgba(224,224,255,0.7)" }}>{item}</span>
      ))}
    </div>
  </nav>
);

// ─── Hero Section Component ─────────────────────────────────────────────────
const Hero = () => (
  <section style={{
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", position: "relative",
    textAlign: "center", padding: 20, overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: "50px 50px", animation: "grid-scroll 5s linear infinite", zIndex: 0
    }} />
    
    <div style={{ position: "relative", zIndex: 1 }}>
      <h1 style={{
        fontSize: "clamp(40px, 10vw, 80px)", color: "#00FFFF",
        animation: "neon-pulse-cyan 2s infinite, fadeInUp 0.8s both"
      }}>
        SYAHRUL <span style={{ color: "#A855F7" }}>RAMADHAN</span>
      </h1>
      <p style={{
        fontSize: 18, color: "rgba(224,224,255,0.6)", marginTop: 10,
        animation: "fadeInUp 0.8s 0.3s both"
      }}>
        Network Engineer & Future Tech Architect
      </p>
      <button style={{
        marginTop: 40, padding: "12px 30px", background: "transparent",
        border: "1px solid #FF00FF", color: "#FF00FF", fontFamily: "Orbitron",
        fontSize: 12, animation: "fadeInUp 0.8s 0.6s both"
      }}>
        INITIATE CONNECTION
      </button>
    </div>
  </section>
);

// ─── Main App Component ─────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <FontLoader />
      <GlobalStyle />
      <CustomCursor />
      
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}>
        <Navbar />
        <Hero />
        <SkillsExperience />
        <ProjectsCertificates />
        <div id="section-contact">
  <ContactSection />
</div>
        <footer style={{ padding: 40, textAlign: "center", fontSize: 10, color: "rgba(0,255,255,0.3)" }}>
          ◈ PORTOFOLIO WEB  ◈
        </footer>
      </div>
    </>
  );
}