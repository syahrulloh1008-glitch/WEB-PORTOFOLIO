import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Global CSS ──────────────────────────────────────────────────────────────
const SECTION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

  :root {
    --bg: #050816;
    --cyan: #00FFFF;
    --purple: #A855F7;
    --pink: #FF00FF;
    --green: #00FF88;
  }

  @keyframes hologram-lift {
    0%   { box-shadow: 0 4px 24px rgba(0,255,255,0.15), 0 0 0 1px rgba(0,255,255,0.1); }
    100% { box-shadow: 0 24px 60px rgba(0,255,255,0.35), 0 0 40px rgba(168,85,247,0.2), 0 0 0 1px rgba(0,255,255,0.4); }
  }
  @keyframes seg-fill {
    from { opacity: 0.12; }
    to   { opacity: 1; }
  }
  @keyframes node-ping {
    0%   { transform: scale(1);   opacity: 0.8; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(1);   opacity: 0; }
  }
  @keyframes node-glow-pulse {
    0%,100% { box-shadow: 0 0 8px var(--cyan), 0 0 16px rgba(0,255,255,0.5); }
    50%     { box-shadow: 0 0 16px var(--cyan), 0 0 40px rgba(0,255,255,0.8), 0 0 60px rgba(0,255,255,0.3); }
  }
  @keyframes timeline-grow {
    from { height: 0; }
    to   { height: 100%; }
  }
  @keyframes scanline-pass {
    0%   { transform: translateY(-8px); opacity: 0; }
    20%  { opacity: 0.6; }
    80%  { opacity: 0.6; }
    100% { transform: translateY(120px); opacity: 0; }
  }
  @keyframes corner-pulse {
    0%,100% { opacity: 0.4; }
    50%     { opacity: 1; }
  }
  @keyframes label-flicker {
    0%,98%,100% { opacity: 1; }
    99% { opacity: 0.4; }
  }
  @keyframes gradient-border-spin {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    id: "networking",
    label: "NETWORKING",
    icon: "◈",
    accent: "#00FFFF",
    accentRgb: "0,255,255",
    skills: [
      { name: "Cisco IOS / IOS-XE", level: 92 },
      { name: "BGP / OSPF / EIGRP", level: 88 },
      { name: "MPLS / SD-WAN", level: 75 },
      { name: "Network Automation", level: 70 },
    ],
  },
  {
    id: "security",
    label: "SECURITY",
    icon: "⬡",
    accent: "#FF00FF",
    accentRgb: "255,0,255",
    skills: [
      { name: "Firewall / IDS/IPS", level: 85 },
      { name: "VPN / Zero Trust", level: 82 },
      { name: "Penetration Testing", level: 68 },
      { name: "SIEM / SOC Ops", level: 60 },
    ],
  },
  {
    id: "cloud",
    label: "CLOUD & INFRA",
    icon: "▲",
    accent: "#A855F7",
    accentRgb: "168,85,247",
    skills: [
      { name: "AWS / GCP", level: 78 },
      { name: "Docker / Kubernetes", level: 72 },
      { name: "Terraform / Ansible", level: 65 },
      { name: "Linux Administration", level: 90 },
    ],
  },
  {
    id: "dev",
    label: "DEV & TOOLS",
    icon: "◇",
    accent: "#00FF88",
    accentRgb: "0,255,136",
    skills: [
      { name: "Python / Bash", level: 80 },
      { name: "REST API / GraphQL", level: 70 },
      { name: "Git / CI-CD", level: 76 },
      { name: "Monitoring (Zabbix)", level: 83 },
    ],
  },
];

const EXPERIENCES = [
  {
    period: "2023 — PRESENT",
    role: "SENIOR NETWORK ENGINEER",
    company: "TechCorp Indonesia",
    location: "Surabaya, ID",
    accent: "#00FFFF",
    accentRgb: "0,255,255",
    tags: ["Cisco", "SD-WAN", "BGP", "Python"],
    desc: "Merancang dan mengelola infrastruktur jaringan enterprise untuk 500+ node. Mengimplementasikan SD-WAN dan otomasi jaringan berbasis Python, menurunkan downtime sebesar 40%.",
  },
  {
    period: "2021 — 2023",
    role: "NETWORK ADMINISTRATOR",
    company: "PT Digital Nusantara",
    location: "Jakarta, ID",
    accent: "#A855F7",
    accentRgb: "168,85,247",
    tags: ["OSPF", "Firewall", "Linux", "Zabbix"],
    desc: "Mengelola topologi multi-site dengan OSPF redistribution. Deployment firewall next-gen dan sistem monitoring proaktif di 8 cabang regional.",
  },
  {
    period: "2019 — 2021",
    role: "JUNIOR NETWORK TECH",
    company: "ISP Nusantara Net",
    location: "Surabaya, ID",
    accent: "#FF00FF",
    accentRgb: "255,0,255",
    tags: ["VLAN", "MPLS", "Mikrotik", "BGP"],
    desc: "Konfigurasi dan troubleshooting jaringan ISP. Pengelolaan VLAN, routing MPLS, dan dukungan pelanggan enterprise untuk koneksi dedicated 10Gbps.",
  },
  {
    period: "2017 — 2019",
    role: "IT SUPPORT SPECIALIST",
    company: "Startup FinTech X",
    location: "Malang, ID",
    accent: "#00FF88",
    accentRgb: "0,255,136",
    tags: ["LAN/WAN", "VPN", "Windows Server", "VMware"],
    desc: "Membangun infrastruktur IT dari nol untuk startup 80 karyawan. Instalasi server, setup VPN site-to-site, dan virtualisasi menggunakan VMware ESXi.",
  },
];

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ target, inView, accent }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 18);
    return () => clearInterval(timer);
  }, [inView, target]);
  return (
    <span style={{ color: accent, fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
      {val}%
    </span>
  );
}

// ─── Segmented Progress Bar ──────────────────────────────────────────────────
function SegmentBar({ level, accent, accentRgb, inView }) {
  const TOTAL = 20;
  const filled = Math.round((level / 100) * TOTAL);
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: TOTAL }).map((_, i) => {
        const active = i < filled;
        const delay = inView ? `${i * 35}ms` : "0ms";
        return (
          <div
            key={i}
            style={{
              width: i % 5 === 4 ? 5 : 8,
              height: 10,
              background: active
                ? accent
                : `rgba(${accentRgb},0.08)`,
              boxShadow: active ? `0 0 6px ${accent}, 0 0 12px rgba(${accentRgb},0.4)` : "none",
              borderRadius: 1,
              opacity: active ? 1 : 0.3,
              transition: active
                ? `opacity 0.25s ${delay}, box-shadow 0.25s ${delay}, background 0.25s ${delay}`
                : "none",
              animation: inView && active ? `seg-fill 0.3s ${delay} both` : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Corner Decoration ───────────────────────────────────────────────────────
function Corners({ accent }) {
  const s = { position: "absolute", width: 10, height: 10, borderColor: accent, borderStyle: "solid", opacity: 0.6, animation: "corner-pulse 2.5s ease-in-out infinite" };
  return (
    <>
      <div style={{ ...s, top: 0, left: 0, borderWidth: "1px 0 0 1px" }} />
      <div style={{ ...s, top: 0, right: 0, borderWidth: "1px 1px 0 0" }} />
      <div style={{ ...s, bottom: 0, left: 0, borderWidth: "0 0 1px 1px" }} />
      <div style={{ ...s, bottom: 0, right: 0, borderWidth: "0 1px 1px 0" }} />
    </>
  );
}

// ─── Skill Card ──────────────────────────────────────────────────────────────
function SkillCard({ group, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, rotateX: 3, rotateY: -2, scale: 1.02 }}
      style={{
        position: "relative",
        padding: "28px 24px",
        borderRadius: 4,
        background: `linear-gradient(135deg, rgba(${group.accentRgb},0.05) 0%, rgba(5,8,22,0.9) 60%, rgba(${group.accentRgb},0.03) 100%)`,
        border: `1px solid rgba(${group.accentRgb},0.2)`,
        backdropFilter: "blur(12px)",
        cursor: "default",
        transition: "box-shadow 0.3s",
        transformStyle: "preserve-3d",
        perspective: 800,
        boxShadow: `inset 0 0 40px rgba(${group.accentRgb},0.04), 0 4px 24px rgba(0,0,0,0.5)`,
      }}
      onHoverStart={(e) => {
        e.target.style && (e.target.style.animation = "hologram-lift 0.3s forwards");
      }}
    >
      {/* Gradient border overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 4, pointerEvents: "none",
        background: `linear-gradient(135deg, rgba(${group.accentRgb},0.3), transparent 40%, transparent 60%, rgba(${group.accentRgb},0.15))`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
        padding: 1,
      }} />

      <Corners accent={group.accent} />

      {/* Scanline effect */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", borderRadius: 4, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, rgba(${group.accentRgb},0.4), transparent)`,
          animation: "scanline-pass 4s linear infinite",
        }} />
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{
          fontSize: 20, color: group.accent,
          textShadow: `0 0 10px ${group.accent}, 0 0 20px rgba(${group.accentRgb},0.5)`,
          animation: "label-flicker 6s infinite",
        }}>
          {group.icon}
        </span>
        <div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.25em", color: group.accent,
            textShadow: `0 0 8px rgba(${group.accentRgb},0.6)`,
          }}>
            {group.label}
          </div>
          <div style={{
            width: 40, height: 1, marginTop: 4,
            background: `linear-gradient(90deg, ${group.accent}, transparent)`,
          }} />
        </div>
      </div>

      {/* Skills list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {group.skills.map((sk) => (
          <div key={sk.name}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 6,
            }}>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600,
                color: "rgba(224,224,255,0.8)", letterSpacing: "0.06em",
              }}>
                {sk.name}
              </span>
              <AnimatedNumber target={sk.level} inView={inView} accent={group.accent} />
            </div>
            <SegmentBar
              level={sk.level}
              accent={group.accent}
              accentRgb={group.accentRgb}
              inView={inView}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Timeline Node ───────────────────────────────────────────────────────────
function TimelineNode({ exp, index, isLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", gap: 24, position: "relative" }}
    >
      {/* Node column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
        {/* Node */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            background: exp.accent,
            boxShadow: `0 0 8px ${exp.accent}, 0 0 20px rgba(${exp.accentRgb},0.6)`,
            animation: inView ? `node-glow-pulse 2s ${index * 0.3}s ease-in-out infinite` : "none",
            position: "relative", zIndex: 2,
          }} />
          {/* Ping ring */}
          {inView && (
            <div style={{
              position: "absolute", inset: -4,
              borderRadius: "50%",
              border: `1px solid ${exp.accent}`,
              animation: `node-ping 2s ${index * 0.3}s ease-out infinite`,
            }} />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div style={{
            width: 1, flex: 1, marginTop: 6,
            background: `linear-gradient(to bottom, rgba(${exp.accentRgb},0.5), rgba(${exp.accentRgb},0.05))`,
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : 44, flex: 1 }}>
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            position: "relative",
            padding: "20px 24px",
            borderRadius: 4,
            background: `linear-gradient(135deg, rgba(${exp.accentRgb},0.04), rgba(5,8,22,0.85))`,
            border: `1px solid rgba(${exp.accentRgb},0.18)`,
            backdropFilter: "blur(8px)",
          }}
        >
          <Corners accent={exp.accent} />

          {/* Period */}
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: "0.2em",
            color: `rgba(${exp.accentRgb},0.7)`,
            marginBottom: 8,
          }}>
            {exp.period} · {exp.location}
          </div>

          {/* Role */}
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 14, fontWeight: 700, letterSpacing: "0.08em",
            color: "#fff",
            textShadow: `0 0 12px rgba(${exp.accentRgb},0.5)`,
            marginBottom: 4,
          }}>
            {exp.role}
          </div>

          {/* Company */}
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13, fontWeight: 600, letterSpacing: "0.1em",
            color: exp.accent, marginBottom: 12,
          }}>
            ▸ {exp.company}
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13, lineHeight: 1.6,
            color: "rgba(200,200,230,0.65)",
            marginBottom: 14,
          }}>
            {exp.desc}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {exp.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, letterSpacing: "0.1em",
                padding: "3px 10px",
                border: `1px solid rgba(${exp.accentRgb},0.3)`,
                borderRadius: 2,
                color: `rgba(${exp.accentRgb},0.8)`,
                background: `rgba(${exp.accentRgb},0.06)`,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 48, textAlign: "center" }}
    >
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10, letterSpacing: "0.4em",
        color: `rgba(${accent === "#00FFFF" ? "0,255,255" : "168,85,247"},0.6)`,
        marginBottom: 12,
      }}>
        {eyebrow}
      </div>
      <h2 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900,
        letterSpacing: "0.08em", color: "#fff",
        textShadow: `0 0 20px rgba(${accent === "#00FFFF" ? "0,255,255" : "168,85,247"},0.4)`,
        marginBottom: 16,
      }}>
        {title}
      </h2>
      <div style={{
        width: 80, height: 1, margin: "0 auto",
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 10px ${accent}`,
      }} />
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SkillsExperience({ profile }) {
  useEffect(() => {
    if (document.getElementById("skills-exp-css")) return;
    const el = document.createElement("style");
    el.id = "skills-exp-css";
    el.textContent = SECTION_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const skillGroups = profile?.skills || SKILL_GROUPS;
  const experiences = profile?.experiences || EXPERIENCES;
  const stats = profile?.stats || [
    { label: "CERTIFICATIONS", value: "3+", accent: "#00FFFF" },
    { label: "PROJECTS DONE", value: "20+", accent: "#A855F7" },
    { label: "YEARS ACTIVE", value: "7+", accent: "#FF00FF" },
    { label: "UPTIME SLA", value: "99.9%", accent: "#00FF88" },
  ];

  return (
    <div style={{ background: "#050816", color: "#e0e0ff" }}>

      {/* ── SKILLS SECTION ── */}
      <section style={{
        padding: "100px 24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <SectionHeader
          eyebrow="// TECHNICAL_STACK.json"
          title="SKILL MATRIX"
          accent="#00FFFF"
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {skillGroups.map((group, i) => (
            <SkillCard key={group.id} group={group} index={i} />
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 60,
            padding: "24px 40px",
            border: "1px solid rgba(0,255,255,0.1)",
            borderRadius: 4,
            background: "rgba(0,255,255,0.02)",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 28, fontWeight: 900,
                color: stat.accent,
                textShadow: `0 0 20px ${stat.accent}`,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 9, letterSpacing: "0.25em",
                color: "rgba(200,200,230,0.4)",
                marginTop: 4,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Divider */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)",
        margin: "0 10%",
      }} />

      {/* ── EXPERIENCE SECTION ── */}
      <section style={{
        padding: "100px 24px",
        maxWidth: 800,
        margin: "0 auto",
      }}>
        <SectionHeader
          eyebrow="// career_timeline.log"
          title="EXPERIENCE LOG"
          accent="#A855F7"
        />

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {experiences.map((exp, i) => (
            <TimelineNode
              key={i}
              exp={exp}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
