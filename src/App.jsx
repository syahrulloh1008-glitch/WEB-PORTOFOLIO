import { useState, useEffect, useRef } from "react";
import SkillsExperience from "./sections/SkillsExperience/SkillsExperience";
import ProjectsCertificates from "./sections/ProjectsCertificates/ProjectsCertificates";
import ContactSection from "./sections/ContactSection/ContactSection";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { defaultProfile, profiles } from "./constants";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
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

      @media (max-width: 768px) {
        body { padding-bottom: 116px; }
        .site-nav {
          top: auto !important;
          bottom: 0 !important;
          padding: 10px 12px 12px !important;
          border-top: 1px solid rgba(0,255,255,0.16) !important;
          border-bottom: none !important;
        }
        .nav-brand { display: none !important; }
        .nav-shell {
          width: 100% !important;
          flex-direction: column-reverse !important;
          gap: 8px !important;
        }
        .nav-links {
          width: 100% !important;
          justify-content: space-around !important;
          gap: 4px !important;
        }
        .nav-links button {
          font-size: 10px !important;
          padding: 8px 6px !important;
        }
        .profile-switcher {
          width: 100% !important;
        }
        .profile-switcher > button {
          width: 100% !important;
          min-width: 0 !important;
          text-align: center !important;
          padding: 8px 12px !important;
        }
        .profile-menu {
          position: fixed !important;
          left: 12px !important;
          right: 12px !important;
          bottom: 104px !important;
          top: auto !important;
          width: auto !important;
        }
        .hero-section {
          min-height: auto !important;
          padding: 52px 18px 48px !important;
        }
        .hero-grid {
          grid-template-columns: 1fr !important;
          gap: 28px !important;
          text-align: center !important;
        }
        .hero-title {
          font-size: clamp(34px, 16vw, 58px) !important;
          overflow-wrap: anywhere !important;
        }
        .hero-copy {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .photo-card {
          max-width: 260px !important;
          padding: 12px !important;
          justify-self: center !important;
        }
      }

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
const ProfileSwitcher = ({ activeProfile, onProfileChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-switcher" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={{
          padding: "9px 14px",
          background: "rgba(0,255,255,0.06)",
          border: "1px solid rgba(0,255,255,0.35)",
          color: "#00FFFF",
          fontFamily: "Orbitron",
          fontSize: 10,
          letterSpacing: "0.12em",
          borderRadius: 2,
          boxShadow: "0 0 14px rgba(0,255,255,0.12)",
          cursor: "none",
          minWidth: 160,
          textAlign: "left",
        }}
      >
        PROFILE: {activeProfile.shortName.toUpperCase()} <span style={{ float: "right" }}>{open ? "X" : "+"}</span>
      </button>

      {open && (
        <div
          className="profile-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 220,
            padding: 8,
            background: "rgba(5,8,22,0.96)",
            border: "1px solid rgba(168,85,247,0.45)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55), 0 0 24px rgba(168,85,247,0.18)",
            backdropFilter: "blur(12px)",
            zIndex: 1002,
          }}
        >
          {profiles.map((profile) => {
            const active = profile.id === activeProfile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onProfileChange(profile);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginBottom: 4,
                  background: active ? "rgba(0,255,255,0.14)" : "transparent",
                  border: `1px solid ${active ? "rgba(0,255,255,0.5)" : "rgba(255,255,255,0.06)"}`,
                  color: active ? "#00FFFF" : "rgba(224,224,255,0.72)",
                  fontFamily: "Rajdhani",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "left",
                  letterSpacing: "0.08em",
                  cursor: "none",
                }}
              >
                {profile.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const navItems = [
  { label: "HOME", target: "section-home" },
  { label: "SKILLS", target: "section-skills" },
  { label: "PROJECTS", target: "section-projects" },
  { label: "CONTACT", target: "section-contact" },
];

const Navbar = ({ activeProfile, onProfileChange }) => (
  <nav className="site-nav" style={{
    position: "fixed", top: 0, width: "100%", padding: "20px 40px",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
    zIndex: 1000, background: "rgba(5,8,22,0.7)", backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0,255,255,0.1)"
  }}>
    <div className="nav-brand" style={{ fontFamily: "Orbitron", fontWeight: 900, color: "#00FFFF" }}>PORTOFOLIO</div>
    <div className="nav-shell" style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <div className="nav-links" style={{ display: "flex", gap: 24, fontSize: 12, fontWeight: 600 }}>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => scrollToSection(item.target)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(224,224,255,0.7)",
              fontFamily: "Rajdhani",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "none",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ProfileSwitcher activeProfile={activeProfile} onProfileChange={onProfileChange} />
    </div>
  </nav>
);

// ─── Hero Section Component ─────────────────────────────────────────────────
const Hero = ({ profile }) => (
  <section className="hero-section" style={{
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center", position: "relative",
    textAlign: "left", padding: "120px 24px 80px", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: "50px 50px", animation: "grid-scroll 5s linear infinite", zIndex: 0
    }} />
    
    <div className="hero-grid" style={{
      position: "relative",
      zIndex: 1,
      width: "min(1100px, 100%)",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) 340px",
      gap: 36,
      alignItems: "center",
    }}>
      <div>
      <h1 className="hero-title" style={{
        fontSize: "clamp(42px, 7vw, 82px)", color: "#00FFFF",
        lineHeight: 1.18,
        maxWidth: 650,
        animation: "neon-pulse-cyan 2s infinite, fadeInUp 0.8s both"
      }}>
        {profile.name}
      </h1>
      <p className="hero-copy" style={{
        fontSize: 18, color: "rgba(224,224,255,0.6)", marginTop: 10,
        animation: "fadeInUp 0.8s 0.3s both"
      }}>
        {profile.role}
      </p>
      <p style={{
        maxWidth: 620,
        marginTop: 18,
        color: "rgba(224,224,255,0.72)",
        fontSize: 16,
        lineHeight: 1.7,
        animation: "fadeInUp 0.8s 0.45s both",
      }}>
        {profile.about}
      </p>
      <button
        type="button"
        onClick={() => scrollToSection("section-contact")}
        style={{
        marginTop: 40, padding: "12px 30px", background: "transparent",
        border: "1px solid #FF00FF", color: "#FF00FF", fontFamily: "Orbitron",
        fontSize: 12, animation: "fadeInUp 0.8s 0.6s both", cursor: "none"
      }}>
        INITIATE CONNECTION
      </button>
      </div>

      <div className="photo-card" style={{
        position: "relative",
        border: "1px solid rgba(0,255,255,0.28)",
        background: "linear-gradient(145deg, rgba(0,255,255,0.06), rgba(5,8,22,0.92))",
        boxShadow: "0 0 36px rgba(0,255,255,0.12)",
        padding: 14,
        borderRadius: 4,
        animation: "fadeInUp 0.8s 0.35s both",
        width: "100%",
        maxWidth: 320,
        justifySelf: "center",
      }}>
        <div style={{
          aspectRatio: "4 / 5",
          border: "1px solid rgba(168,85,247,0.45)",
          background: profile.photoUrl
            ? `url(${profile.photoUrl}) center / cover`
            : "radial-gradient(circle at 35% 20%, rgba(0,255,255,0.28), transparent 35%), linear-gradient(145deg, rgba(168,85,247,0.25), rgba(5,8,22,0.95))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00FFFF",
          fontFamily: "Orbitron",
          fontSize: 56,
          fontWeight: 900,
          textShadow: "0 0 18px rgba(0,255,255,0.8)",
        }}>
          {!profile.photoUrl && profile.shortName.slice(0, 2).toUpperCase()}
        </div>
        <div style={{
          marginTop: 14,
          fontFamily: "Share Tech Mono, monospace",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "rgba(0,255,255,0.55)",
          textAlign: "center",
        }}>
          ABOUT_CARD // FOTO PROFIL
        </div>
      </div>
    </div>
  </section>
);

// ─── Main App Component ─────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeProfile, setActiveProfile] = useState(defaultProfile);

  return (
    <>
      <FontLoader />
      <GlobalStyle />
      <ScrollProgressBar />
      <CustomCursor />
      
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}>
        <Navbar activeProfile={activeProfile} onProfileChange={setActiveProfile} />
        <div id="section-home">
          <Hero profile={activeProfile} />
        </div>
        <div id="section-skills">
          <SkillsExperience profile={activeProfile} />
        </div>
        <div id="section-projects">
          <ProjectsCertificates profile={activeProfile} />
        </div>
        <div id="section-contact">
          <ContactSection profile={activeProfile} />
        </div>
        <footer style={{ padding: 40, textAlign: "center", fontSize: 10, color: "rgba(0,255,255,0.3)" }}>
          ◈ PORTOFOLIO WEB  ◈
        </footer>
      </div>
    </>
  );
}
