import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

  @keyframes scanner-move {
    0%   { top: -4px; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes neon-btn-pulse {
    0%,100% { box-shadow: 0 0 8px currentColor, 0 0 16px rgba(0,255,255,0.3); }
    50%      { box-shadow: 0 0 16px currentColor, 0 0 40px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.2); }
  }
  @keyframes card-corner-blink {
    0%,100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }
  @keyframes cert-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes lightbox-in {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes grid-bg-scroll {
    0%   { background-position: 0 0; }
    100% { background-position: 0 80px; }
  }
  @keyframes badge-flicker {
    0%,97%,100% { opacity: 1; }
    98%          { opacity: 0.5; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TECH_COLORS = {
  React:       { color: "#61DAFB", rgb: "97,218,251" },
  Python:      { color: "#FFD43B", rgb: "255,212,59" },
  Mikrotik:    { color: "#FF6B35", rgb: "255,107,53" },
  "Node.js":   { color: "#68A063", rgb: "104,160,99" },
  Docker:      { color: "#2496ED", rgb: "36,150,237" },
  Cisco:       { color: "#1BA0D7", rgb: "27,160,215" },
  Ansible:     { color: "#EE0000", rgb: "238,0,0" },
  AWS:         { color: "#FF9900", rgb: "255,153,0" },
  Zabbix:      { color: "#CC0000", rgb: "204,0,0" },
  BGP:         { color: "#A855F7", rgb: "168,85,247" },
  Linux:       { color: "#FCC624", rgb: "252,198,36" },
  Grafana:     { color: "#F46800", rgb: "244,104,0" },
  FastAPI:     { color: "#009688", rgb: "0,150,136" },
  PostgreSQL:  { color: "#336791", rgb: "51,103,145" },
  Terraform:   { color: "#7B42BC", rgb: "123,66,188" },
  OSPF:        { color: "#00FF88", rgb: "0,255,136" },
};

const PROJECTS = [
  {
    title: "NET-MONITOR PRO",
    subtitle: "Real-time Network Observability",
    accent: "#00FFFF", accentRgb: "0,255,255",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    desc: "Dashboard monitoring jaringan real-time dengan alerting otomatis, topology map interaktif, dan analisis trafik berbasis ML untuk anomaly detection.",
    tech: ["Python", "Grafana", "Zabbix", "Linux"],
    demo: "#", github: "#",
    status: "LIVE",
  },
  {
    title: "SD-WAN ORCHESTRATOR",
    subtitle: "Multi-site WAN Automation",
    accent: "#A855F7", accentRgb: "168,85,247",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    desc: "Platform orkestrasi SD-WAN untuk manajemen 50+ site secara terpusat. Otomasi provisioning, failover cerdas, dan QoS policy engine berbasis intent.",
    tech: ["Cisco", "Python", "Ansible", "BGP"],
    demo: "#", github: "#",
    status: "BETA",
  },
  {
    title: "NETOPS API GATEWAY",
    subtitle: "Network-as-Code REST API",
    accent: "#FF00FF", accentRgb: "255,0,255",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    desc: "RESTful API layer di atas infrastruktur jaringan. Memungkinkan dev team melakukan provisioning VLAN, firewall rules, dan routing config via HTTP request.",
    tech: ["FastAPI", "Python", "Docker", "PostgreSQL"],
    demo: "#", github: "#",
    status: "LIVE",
  },
  {
    title: "INFRASTRUKTUR AS CODE",
    subtitle: "Multi-Cloud IaC Boilerplate",
    accent: "#00FF88", accentRgb: "0,255,136",
    img: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
    desc: "Template Terraform & Ansible untuk deployment infrastruktur multi-cloud (AWS + GCP) yang idempotent, dengan pipeline CI/CD terintegrasi dan secret management.",
    tech: ["Terraform", "AWS", "Ansible", "Linux"],
    demo: "#", github: "#",
    status: "OPEN SOURCE",
  },
  {
    title: "MIKROTIK AUTOMATION",
    subtitle: "RouterOS Mass Config Tool",
    accent: "#FFD43B", accentRgb: "255,212,59",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    desc: "Tool Python untuk konfigurasi massal perangkat Mikrotik via RouterOS API. Mendukung bulk VLAN, hotspot, dan firewall rule deployment ke ratusan device sekaligus.",
    tech: ["Python", "Mikrotik", "OSPF", "Linux"],
    demo: "#", github: "#",
    status: "LIVE",
  },
  {
    title: "REACT NETDASH",
    subtitle: "Frontend for Network Ops",
    accent: "#61DAFB", accentRgb: "97,218,251",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80",
    desc: "Dashboard React untuk tim Network Operations Center (NOC). Menampilkan status perangkat, trafik real-time, dan tiket insiden dalam satu antarmuka terintegrasi.",
    tech: ["React", "Node.js", "Docker", "Grafana"],
    demo: "#", github: "#",
    status: "LIVE",
  },
];

const CERTIFICATES = [
  {
    title: "CCNA",
    subtitle: "Cisco Certified Network Associate",
    issuer: "Cisco Systems",
    year: "2022",
    accent: "#00FFFF", accentRgb: "0,255,255",
    id: "CSCO-1234567",
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80",
  },
  {
    title: "AWS SAA",
    subtitle: "Solutions Architect Associate",
    issuer: "Amazon Web Services",
    year: "2023",
    accent: "#FF9900", accentRgb: "255,153,0",
    id: "AWS-SAA-0987654",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
  },
  {
    title: "MTCNA",
    subtitle: "MikroTik Certified Network Associate",
    issuer: "MikroTik",
    year: "2021",
    accent: "#FF6B35", accentRgb: "255,107,53",
    id: "MTK-MTCNA-55678",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
  },
  {
    title: "CKA",
    subtitle: "Certified Kubernetes Administrator",
    issuer: "CNCF / Linux Foundation",
    year: "2023",
    accent: "#326CE5", accentRgb: "50,108,229",
    id: "LF-CKA-112233",
    img: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=500&q=80",
  },
  {
    title: "CEH",
    subtitle: "Certified Ethical Hacker",
    issuer: "EC-Council",
    year: "2022",
    accent: "#A855F7", accentRgb: "168,85,247",
    id: "ECC-CEH-778899",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Corners({ accent }) {
  const s = (pos) => ({
    position: "absolute", width: 10, height: 10,
    borderColor: accent, borderStyle: "solid", opacity: 0.7,
    animation: "card-corner-blink 3s ease-in-out infinite",
    ...pos,
  });
  return (
    <>
      <div style={s({ top: 0, left: 0, borderWidth: "1px 0 0 1px" })} />
      <div style={s({ top: 0, right: 0, borderWidth: "1px 1px 0 0" })} />
      <div style={s({ bottom: 0, left: 0, borderWidth: "0 0 1px 1px" })} />
      <div style={s({ bottom: 0, right: 0, borderWidth: "0 1px 1px 0" })} />
    </>
  );
}
function StatusBadge({ status, accent, accentRgb }) {
  return (
    <div style={{
      position: "absolute", top: 12, right: 12, zIndex: 4,
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 9, letterSpacing: "0.2em",
      padding: "3px 10px", borderRadius: 2,
      border: `1px solid rgba(${accentRgb},0.6)`,
      color: accent, background: `rgba(${accentRgb},0.12)`,
      boxShadow: `0 0 8px rgba(${accentRgb},0.3)`,
      animation: "badge-flicker 7s infinite",
    }}>
      ● {status}
    </div>
  );
}

function TechBadge({ name }) {
  const t = TECH_COLORS[name] || { color: "#fff", rgb: "255,255,255" };
  return (
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 9, letterSpacing: "0.1em",
      padding: "3px 9px", borderRadius: 2,
      border: `1px solid rgba(${t.rgb},0.35)`,
      color: t.color,
      background: `rgba(${t.rgb},0.07)`,
      boxShadow: `0 0 6px rgba(${t.rgb},0.2)`,
      whiteSpace: "nowrap",
    }}>
      {name}
    </span>
  );
}

// ─── Scanner Effect Image ─────────────────────────────────────────────────────
function ScannedImage({ src, accent, accentRgb }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{
        position: "relative", overflow: "hidden",
        width: "100%", height: 190,
        background: "#0a0f1e",
      }}
    >
      {/* Image */}
      <img
        src={src} alt=""
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: `brightness(0.55) saturate(0.6) hue-rotate(${accent === "#00FFFF" ? "160deg" : accent === "#A855F7" ? "260deg" : "0deg"})`,
          transition: "filter 0.4s, transform 0.6s",
          transform: active ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* CRT horizontal lines overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Neon tint overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, rgba(${accentRgb},0.08), transparent 60%)`,
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Scanner beam */}
      {active && (
        <div style={{
          position: "absolute", left: 0, right: 0, height: 3, zIndex: 3,
          background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.9), transparent)`,
          boxShadow: `0 0 12px rgba(${accentRgb},0.8), 0 0 24px rgba(${accentRgb},0.4)`,
          animation: "scanner-move 1.8s linear infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Grid lines on hover */}
      {active && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(${accentRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.04) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          animation: "grid-bg-scroll 3s linear infinite",
        }} />
      )}
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      style={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        background: `linear-gradient(160deg, rgba(${proj.accentRgb},0.04), #080d1e)`,
        border: `1px solid rgba(${proj.accentRgb},0.18)`,
        boxShadow: `0 4px 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(${proj.accentRgb},0.03)`,
        display: "flex", flexDirection: "column",
      }}
    >
      <StatusBadge status={proj.status} accent={proj.accent} accentRgb={proj.accentRgb} />
      <Corners accent={proj.accent} />

      <ScannedImage src={proj.img} accent={proj.accent} accentRgb={proj.accentRgb} />

      <div style={{ padding: "20px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 14, fontWeight: 700, letterSpacing: "0.08em",
            color: proj.accent,
            textShadow: `0 0 10px rgba(${proj.accentRgb},0.5)`,
            marginBottom: 3,
          }}>{proj.title}</h3>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9, letterSpacing: "0.2em",
            color: "rgba(200,200,230,0.4)",
          }}>{proj.subtitle}</div>
        </div>

        {/* Desc */}
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 12, lineHeight: 1.65,
          color: "rgba(200,200,230,0.6)",
          flex: 1, marginBottom: 14,
        }}>{proj.desc}</p>

        {/* Tech badges */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
          {proj.tech.map(t => <TechBadge key={t} name={t} />)}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <NeonButton href={proj.demo} accent={proj.accent} accentRgb={proj.accentRgb} label="OPEN PROJECT" icon="▶" filled />
          <NeonButton href={proj.github} accent={proj.accent} accentRgb={proj.accentRgb} label="GITHUB" icon="⌥" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Neon Button ──────────────────────────────────────────────────────────────
function NeonButton({ href, accent, accentRgb, label, icon, filled }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.96 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      style={{
        flex: filled ? "1 1 auto" : "0 0 auto",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "9px 16px",
        fontFamily: "'Orbitron', monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
        textDecoration: "none",
        borderRadius: 2,
        cursor: "none",
        border: `1px solid rgba(${accentRgb},${hover ? 0.9 : 0.4})`,
        background: filled
          ? hover ? `rgba(${accentRgb},0.2)` : `rgba(${accentRgb},0.08)`
          : "transparent",
        color: hover ? accent : `rgba(${accentRgb},0.7)`,
        boxShadow: hover
          ? `0 0 16px rgba(${accentRgb},0.5), 0 0 32px rgba(${accentRgb},0.2), inset 0 0 12px rgba(${accentRgb},0.1)`
          : "none",
        transition: "all 0.25s",
        animation: hover && filled ? `neon-btn-pulse 1.2s ease-in-out infinite` : "none",
      }}
    >
      <span style={{ fontSize: 10 }}>{icon}</span>
      {label}
    </motion.a>
  );
}

// ─── Certificate Lightbox ─────────────────────────────────────────────────────
function Lightbox({ cert, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(2,4,14,0.93)",
          backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            maxWidth: 600, width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid rgba(${cert.accentRgb},0.4)`,
            boxShadow: `0 0 60px rgba(${cert.accentRgb},0.3), 0 0 120px rgba(${cert.accentRgb},0.1)`,
            background: "#080d1e",
          }}
        >
          <Corners accent={cert.accent} />

          <img src={cert.img} alt={cert.title} style={{
            width: "100%", display: "block",
            filter: `brightness(0.7) saturate(0.7)`,
          }} />

          {/* Overlay info */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "24px 24px 20px",
            background: `linear-gradient(to top, rgba(5,8,22,0.97) 60%, transparent)`,
          }}>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 18, fontWeight: 900,
              color: cert.accent,
              textShadow: `0 0 16px rgba(${cert.accentRgb},0.7)`,
              marginBottom: 4,
            }}>{cert.title}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "rgba(220,220,255,0.7)", marginBottom: 8 }}>
              {cert.subtitle}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: `rgba(${cert.accentRgb},0.6)` }}>
                ISSUER: {cert.issuer}
              </span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(200,200,230,0.35)" }}>
                ID: {cert.id}
              </span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(200,200,230,0.35)" }}>
                {cert.year}
              </span>
            </div>
          </div>

          {/* Close btn */}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            width: 28, height: 28,
            border: `1px solid rgba(${cert.accentRgb},0.4)`,
            borderRadius: 2, background: "rgba(5,8,22,0.8)",
            color: cert.accent, fontSize: 12,
            fontFamily: "'Orbitron', monospace",
            cursor: "none", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Certificate Card ─────────────────────────────────────────────────────────
function CertCard({ cert, onClick, isCenter }) {
  return (
    <motion.div
      onClick={() => onClick(cert)}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0,
        width: 220,
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid rgba(${cert.accentRgb},${isCenter ? 0.5 : 0.2})`,
        background: `linear-gradient(145deg, rgba(${cert.accentRgb},0.06), #070b18)`,
        boxShadow: isCenter
          ? `0 0 30px rgba(${cert.accentRgb},0.25), 0 0 60px rgba(${cert.accentRgb},0.1)`
          : `0 4px 20px rgba(0,0,0,0.4)`,
        cursor: "none",
        position: "relative",
        animation: `cert-float ${3 + Math.random()}s ease-in-out infinite`,
        transition: "box-shadow 0.3s, border-color 0.3s",
      }}
    >
      <Corners accent={cert.accent} />

      {/* Image */}
      <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
        <img src={cert.img} alt="" style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "brightness(0.5) saturate(0.5)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, rgba(${cert.accentRgb},0.15), transparent 60%)`,
        }} />
        {/* Magnify hint */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0, transition: "opacity 0.3s",
          background: `rgba(${cert.accentRgb},0.08)`,
          fontSize: 22, color: cert.accent,
        }}
          className="cert-magnify"
        >
          ⊕
        </div>
      </div>

      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 13, fontWeight: 700,
          color: cert.accent,
          textShadow: `0 0 8px rgba(${cert.accentRgb},0.5)`,
          marginBottom: 4,
        }}>{cert.title}</div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 11, color: "rgba(200,200,230,0.55)",
          lineHeight: 1.4, marginBottom: 8,
        }}>{cert.subtitle}</div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9, letterSpacing: "0.15em",
          color: `rgba(${cert.accentRgb},0.5)`,
        }}>
          {cert.issuer} · {cert.year}
        </div>
      </div>

      {/* Click hint */}
      <div style={{
        position: "absolute", bottom: 10, right: 12,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 8, letterSpacing: "0.15em",
        color: `rgba(${cert.accentRgb},0.35)`,
      }}>
        CLICK TO EXPAND
      </div>
    </motion.div>
  );
}

// ─── Certificate Slider ────────────────────────────────────────────────────────
function CertSlider({ certificates = CERTIFICATES }) {
  const [selected, setSelected] = useState(null);
  const constraintsRef = useRef(null);
  const CARD_W = 236; // 220 + 16 gap

  return (
    <>
      {selected && <Lightbox cert={selected} onClose={() => setSelected(null)} />}

      <div style={{ position: "relative" }}>
        {/* Fade edges */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: "linear-gradient(90deg, #050816, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: "linear-gradient(270deg, #050816, transparent)",
          pointerEvents: "none",
        }} />

        {/* Drag container */}
        <div ref={constraintsRef} style={{ overflow: "hidden", padding: "16px 0 24px" }}>
          <motion.div
            drag="x"
            dragConstraints={{
              left: Math.min(0, -(CARD_W * certificates.length - window.innerWidth + 120)),
              right: 0,
            }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 30 }}
            style={{
              display: "flex", gap: 16,
              paddingLeft: 40,
              cursor: "grab",
              width: "max-content",
            }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {certificates.map((cert, i) => (
              <CertCard
                key={i}
                cert={cert}
                isCenter={i === 2}
                onClick={setSelected}
              />
            ))}
          </motion.div>
        </div>

        {/* Drag hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            textAlign: "center",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9, letterSpacing: "0.3em",
            color: "rgba(0,255,255,0.25)",
            marginTop: 4,
          }}
        >
          ← DRAG TO EXPLORE · CLICK TO MAGNIFY →
        </motion.div>
      </div>
    </>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, accent, accentRgb }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ marginBottom: 48, textAlign: "center" }}
    >
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10, letterSpacing: "0.4em",
        color: `rgba(${accentRgb},0.55)`,
        marginBottom: 12,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900,
        letterSpacing: "0.08em", color: "#fff",
        textShadow: `0 0 20px rgba(${accentRgb},0.4)`,
        marginBottom: 16,
      }}>{title}</h2>
      <div style={{
        width: 80, height: 1, margin: "0 auto",
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 10px ${accent}`,
      }} />
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ProjectsCertificates({ profile }) {
  useEffect(() => {
    if (document.getElementById("proj-cert-css")) return;
    const el = document.createElement("style");
    el.id = "proj-cert-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const projects = profile?.projects || PROJECTS;
  const certificates = profile?.certificates || CERTIFICATES;

  return (
    <div style={{ background: "#050816", color: "#e0e0ff" }}>

      {/* ── PROJECTS ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="// projects.portfolio"
          title="PROJECT ARCHIVE"
          accent="#00FFFF"
          accentRgb="0,255,255"
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {projects.map((proj, i) => (
            <ProjectCard key={i} proj={proj} index={i} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{
        height: 1, margin: "0 8%",
        background: "linear-gradient(90deg, transparent, rgba(255,0,255,0.25), transparent)",
      }} />

      {/* ── CERTIFICATES ── */}
      <section style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeader
            eyebrow="// certifications.verified"
            title="CREDENTIAL VAULT"
            accent="#A855F7"
            accentRgb="168,85,247"
          />
        </div>
        <CertSlider certificates={certificates} />
      </section>
    </div>
  );
}