import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Code, Download, Mail, MessageCircle, Send } from "lucide-react";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { certificates, groupInfo, projects, teamMembers, whatsappLink } from "./constants";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const navItems = [
  { label: "HOME", target: "section-home" },
  { label: "SCHOOL", target: "section-school" },
  { label: "TEAM", target: "section-team" },
  { label: "CERTIFICATE", target: "section-certificates" },
  { label: "PROJECT", target: "section-projects" },
  { label: "CONTACT", target: "section-contact" },
];

const bootText = ["> memuat data kelompok...", "> sinkronisasi anggota...", "> ACCESS_GRANTED", "> SYSTEM_READY"];

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --bg: #050816;
        --cyan: #00FFFF;
        --purple: #A855F7;
        --pink: #FF00FF;
        --green: #00FF88;
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
      @keyframes neon-pulse-cyan {
        0%,100% { text-shadow: 0 0 7px var(--cyan), 0 0 20px var(--cyan); }
        50% { text-shadow: 0 0 4px var(--cyan), 0 0 10px var(--cyan); }
      }
      @keyframes grid-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 60px; } }
      @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
      @keyframes corner-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
      @keyframes scanner-move { 0% { top: -4px; opacity: 0; } 8%,92% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
      @media (max-width: 860px) {
        body { padding-bottom: 76px; }
        .site-nav {
          top: auto !important;
          bottom: 0 !important;
          padding: 10px 10px 12px !important;
          border-top: 1px solid rgba(0,255,255,0.16) !important;
          border-bottom: none !important;
        }
        .nav-brand { display: none !important; }
        .nav-links {
          width: 100% !important;
          justify-content: space-between !important;
          gap: 2px !important;
        }
        .nav-links button {
          font-size: 9px !important;
          padding: 8px 4px !important;
        }
        .hero-grid, .two-col { grid-template-columns: 1fr !important; }
        .hero-section { min-height: auto !important; padding: 96px 18px 60px !important; }
        .hero-title { font-size: clamp(34px, 15vw, 58px) !important; overflow-wrap: anywhere !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState(Array.from({ length: 12 }, () => ({ x: -100, y: -100 })));
  const [hovering, setHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setHovering(document.elementFromPoint(e.clientX, e.clientY)?.closest("a,button") != null);
    };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      setPos({ ...posRef.current });
      setTrail((prev) => [posRef.current, ...prev.slice(0, 11)]);
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
        <div
          key={i}
          style={{
            position: "fixed",
            left: t.x,
            top: t.y,
            width: 6 - i * 0.4,
            height: 6 - i * 0.4,
            background: i === 0 ? "#00FFFF" : "#A855F7",
            borderRadius: "50%",
            opacity: 1 - i / 12,
            transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #00FFFF",
          }}
        />
      ))}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: hovering ? 40 : 20,
          height: hovering ? 40 : 20,
          border: `1px solid ${hovering ? "#FF00FF" : "#00FFFF"}`,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          transition: "width 0.2s, height 0.2s",
        }}
      />
    </div>
  );
};

const LoadingScreen = ({ onDone }) => {
  const [lines, setLines] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootText.length) {
        setLines((prev) => [...prev, bootText[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onDone, 700);
        }, 500);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#050816",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s",
      }}
    >
      <div style={{ fontFamily: "Orbitron", color: "#00FFFF", fontSize: 24, marginBottom: 20 }}>PORTOFOLIO KELOMPOK</div>
      <div style={{ textAlign: "left", width: 260, fontFamily: "monospace", fontSize: 12, color: "#A855F7" }}>
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const Corners = ({ accent }) => {
  const base = {
    position: "absolute",
    width: 12,
    height: 12,
    borderColor: accent,
    borderStyle: "solid",
    animation: "corner-pulse 2.5s ease-in-out infinite",
  };
  return (
    <>
      <div style={{ ...base, top: 0, left: 0, borderWidth: "1px 0 0 1px" }} />
      <div style={{ ...base, top: 0, right: 0, borderWidth: "1px 1px 0 0" }} />
      <div style={{ ...base, bottom: 0, left: 0, borderWidth: "0 0 1px 1px" }} />
      <div style={{ ...base, bottom: 0, right: 0, borderWidth: "0 1px 1px 0" }} />
    </>
  );
};

const SectionHeader = ({ eyebrow, title, accent = "#00FFFF", accentRgb = "0,255,255" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ marginBottom: 42, textAlign: "center" }}
    >
      <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: 10, letterSpacing: "0.4em", color: `rgba(${accentRgb},0.55)`, marginBottom: 12 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#fff", textShadow: `0 0 20px rgba(${accentRgb},0.4)`, marginBottom: 16 }}>
        {title}
      </h2>
      <div style={{ width: 80, height: 1, margin: "0 auto", background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 10px ${accent}` }} />
    </motion.div>
  );
};

const Navbar = () => (
  <nav
    className="site-nav"
    style={{
      position: "fixed",
      top: 0,
      width: "100%",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 24,
      zIndex: 1000,
      background: "rgba(5,8,22,0.7)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(0,255,255,0.1)",
    }}
  >
    <button
      type="button"
      onClick={() => scrollToSection("section-home")}
      className="nav-brand"
      style={{ fontFamily: "Orbitron", fontWeight: 900, color: "#00FFFF", background: "transparent", border: "none", fontSize: 18 }}
    >
      PORTOFOLIO
    </button>
    <div className="nav-links" style={{ display: "flex", gap: 20, fontSize: 12, fontWeight: 600, flexWrap: "wrap", justifyContent: "flex-end" }}>
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
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  </nav>
);

const Hero = () => (
  <section
    id="section-home"
    className="hero-section"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "130px 24px 80px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        animation: "grid-scroll 5s linear infinite",
      }}
    />
    <div className="hero-grid" style={{ position: "relative", zIndex: 1, width: "min(1120px, 100%)", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 36, alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: "Share Tech Mono, monospace", color: "rgba(0,255,255,0.55)", letterSpacing: "0.35em", fontSize: 11, marginBottom: 18 }}>
          // {groupInfo.groupName}
        </div>
        <h1 className="hero-title" style={{ fontSize: "clamp(42px, 7vw, 82px)", color: "#00FFFF", lineHeight: 1.12, maxWidth: 760, animation: "neon-pulse-cyan 2s infinite, fadeInUp 0.8s both" }}>
          {groupInfo.title}
        </h1>
        <p style={{ fontSize: 24, color: "#A855F7", fontFamily: "Orbitron", marginTop: 14, textShadow: "0 0 18px rgba(168,85,247,0.55)" }}>{groupInfo.groupName}</p>
        <p style={{ maxWidth: 700, marginTop: 20, color: "rgba(224,224,255,0.72)", fontSize: 17, lineHeight: 1.7 }}>{groupInfo.tagline}</p>
        <button
          type="button"
          onClick={() => scrollToSection("section-team")}
          style={{ marginTop: 38, padding: "13px 30px", background: "transparent", border: "1px solid #FF00FF", color: "#FF00FF", fontFamily: "Orbitron", fontSize: 12 }}
        >
          VIEW TEAM MEMBER
        </button>
      </div>
      <div style={{ position: "relative", border: "1px solid rgba(0,255,255,0.24)", borderRadius: 4, padding: 22, background: "linear-gradient(145deg, rgba(0,255,255,0.06), rgba(5,8,22,0.92))", boxShadow: "0 0 40px rgba(0,255,255,0.12)" }}>
        <Corners accent="#00FFFF" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {groupInfo.identity.map((item) => (
            <div key={item.label} style={{ minHeight: 110, border: "1px solid rgba(168,85,247,0.24)", padding: 16, background: "rgba(168,85,247,0.04)" }}>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: 9, letterSpacing: "0.24em", color: "rgba(224,224,255,0.42)", marginBottom: 10 }}>{item.label}</div>
              <div style={{ fontFamily: "Orbitron", fontSize: 18, color: "#00FFFF", lineHeight: 1.35 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const AboutSchool = () => (
  <section id="section-school" style={{ padding: "96px 24px", maxWidth: 1120, margin: "0 auto" }}>
    <SectionHeader eyebrow="// about_school.data" title="ABOUT SCHOOL" accent="#A855F7" accentRgb="168,85,247" />
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 24, alignItems: "stretch" }}>
      <Panel accent="#A855F7" accentRgb="168,85,247">
        <div style={{ fontFamily: "Share Tech Mono, monospace", color: "rgba(168,85,247,0.7)", letterSpacing: "0.25em", fontSize: 10, marginBottom: 14 }}>SCHOOL_NODE</div>
        <h3 style={{ color: "#fff", fontSize: 24, marginBottom: 12 }}>{groupInfo.school.name}</h3>
        <p style={{ color: "#00FFFF", fontFamily: "Orbitron", fontSize: 14 }}>{groupInfo.school.program}</p>
      </Panel>
      <Panel accent="#00FFFF" accentRgb="0,255,255">
        <p style={{ color: "rgba(224,224,255,0.72)", fontSize: 17, lineHeight: 1.8 }}>{groupInfo.school.description}</p>
      </Panel>
    </div>
  </section>
);

const Panel = ({ children, accent = "#00FFFF", accentRgb = "0,255,255" }) => (
  <div style={{ position: "relative", padding: 28, border: `1px solid rgba(${accentRgb},0.18)`, borderRadius: 4, background: `linear-gradient(145deg, rgba(${accentRgb},0.045), rgba(5,8,22,0.92))`, boxShadow: `0 10px 38px rgba(0,0,0,0.35), inset 0 0 38px rgba(${accentRgb},0.035)` }}>
    <Corners accent={accent} />
    {children}
  </div>
);

const TeamSection = () => (
  <section id="section-team" style={{ padding: "96px 24px", maxWidth: 1220, margin: "0 auto" }}>
    <SectionHeader eyebrow="// team_member.list" title="TEAM MEMBER" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
      {teamMembers.map((member, index) => (
        <TeamCard key={member.id} member={member} index={index} />
      ))}
    </div>
  </section>
);

const TeamCard = ({ member, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.55 }}
      whileHover={{ y: -8 }}
      style={{ position: "relative", borderRadius: 4, overflow: "hidden", border: `1px solid rgba(${member.accentRgb},0.22)`, background: `linear-gradient(160deg, rgba(${member.accentRgb},0.05), #080d1e)`, boxShadow: "0 4px 30px rgba(0,0,0,0.48)" }}
    >
      <Corners accent={member.accent} />
      <div style={{ position: "relative", height: 260, overflow: "hidden", background: "#0a0f1e" }}>
        <img src={member.photoUrl} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72) saturate(0.85)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, #080d1e 0%, rgba(${member.accentRgb},0.08) 55%, transparent 100%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, rgba(${member.accentRgb},0.95), transparent)`, boxShadow: `0 0 16px rgba(${member.accentRgb},0.7)`, animation: "scanner-move 2.8s linear infinite" }} />
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 17, color: member.accent, textShadow: `0 0 10px rgba(${member.accentRgb},0.5)`, marginBottom: 5 }}>{member.name}</h3>
        <p style={{ color: "rgba(224,224,255,0.62)", fontWeight: 600, marginBottom: 14 }}>{member.role}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {member.skills.map((skill) => (
            <span key={skill} style={{ fontFamily: "Share Tech Mono, monospace", fontSize: 9, color: `rgba(${member.accentRgb},0.82)`, border: `1px solid rgba(${member.accentRgb},0.32)`, padding: "4px 8px", borderRadius: 2, background: `rgba(${member.accentRgb},0.06)` }}>
              {skill}
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          <IconLink href={whatsappLink(member.whatsapp, `Halo ${member.name}, saya melihat portfolio kelompok kamu.`)} label="WA" icon={<MessageCircle size={16} />} accent={member.accent} accentRgb={member.accentRgb} />
          <IconLink href={member.instagram} label="IG" icon={<Camera size={16} />} accent={member.accent} accentRgb={member.accentRgb} />
          <IconLink href={member.github} label="GH" icon={<Code size={16} />} accent={member.accent} accentRgb={member.accentRgb} />
          <IconLink href={member.cv} label="CV" icon={<Download size={16} />} accent={member.accent} accentRgb={member.accentRgb} download />
        </div>
      </div>
    </motion.article>
  );
};

const IconLink = ({ href, label, icon, accent, accentRgb, download = false }) => (
  <a
    href={href}
    target={download ? undefined : "_blank"}
    rel={download ? undefined : "noopener noreferrer"}
    download={download}
    style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, textDecoration: "none", color: accent, border: `1px solid rgba(${accentRgb},0.34)`, background: `rgba(${accentRgb},0.06)`, fontFamily: "Share Tech Mono, monospace", fontSize: 9 }}
    title={label}
  >
    {icon}
    <span>{label}</span>
  </a>
);

const CertificatesSection = () => (
  <section id="section-certificates" style={{ padding: "96px 24px", maxWidth: 1220, margin: "0 auto" }}>
    <SectionHeader eyebrow="// certificates.owner" title="SERTIFIKAT" accent="#A855F7" accentRgb="168,85,247" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
      {certificates.map((cert) => (
        <Panel key={`${cert.owner}-${cert.title}`} accent={cert.accent} accentRgb={cert.accentRgb}>
          <div style={{ height: 140, margin: "-10px -10px 18px", overflow: "hidden", border: `1px solid rgba(${cert.accentRgb},0.18)` }}>
            <img src={cert.img} alt={cert.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(0.7)" }} />
          </div>
          <h3 style={{ color: cert.accent, fontSize: 15, marginBottom: 8 }}>{cert.title}</h3>
          <p style={{ color: "rgba(224,224,255,0.72)", marginBottom: 10 }}>Owner: {cert.owner}</p>
          <p style={{ fontFamily: "Share Tech Mono, monospace", color: `rgba(${cert.accentRgb},0.56)`, fontSize: 10 }}>{cert.issuer} / {cert.year}</p>
        </Panel>
      ))}
    </div>
  </section>
);

const ProjectsSection = () => (
  <section id="section-projects" style={{ padding: "96px 24px", maxWidth: 1220, margin: "0 auto" }}>
    <SectionHeader eyebrow="// projects.owner_link" title="KARYA DAN PROJECT" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      {projects.map((project) => (
        <article key={project.title} style={{ position: "relative", overflow: "hidden", border: `1px solid rgba(${project.accentRgb},0.2)`, borderRadius: 4, background: `linear-gradient(160deg, rgba(${project.accentRgb},0.05), #080d1e)`, boxShadow: "0 4px 30px rgba(0,0,0,0.48)" }}>
          <Corners accent={project.accent} />
          <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
            <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.56) saturate(0.7)" }} />
            <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "Share Tech Mono, monospace", color: project.accent, fontSize: 9, border: `1px solid rgba(${project.accentRgb},0.6)`, padding: "4px 10px", background: `rgba(${project.accentRgb},0.12)` }}>{project.status}</div>
          </div>
          <div style={{ padding: 20 }}>
            <h3 style={{ color: project.accent, fontSize: 15, marginBottom: 6 }}>{project.title}</h3>
            <p style={{ color: "rgba(224,224,255,0.5)", fontFamily: "Share Tech Mono, monospace", fontSize: 10, marginBottom: 12 }}>OWNER: {project.owner}</p>
            <p style={{ color: "rgba(224,224,255,0.66)", lineHeight: 1.65, marginBottom: 14 }}>{project.desc}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
              {project.tech.map((tech) => (
                <span key={tech} style={{ fontFamily: "Share Tech Mono, monospace", fontSize: 9, color: `rgba(${project.accentRgb},0.82)`, border: `1px solid rgba(${project.accentRgb},0.32)`, padding: "4px 8px", background: `rgba(${project.accentRgb},0.06)` }}>{tech}</span>
              ))}
            </div>
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: project.accent, border: `1px solid rgba(${project.accentRgb},0.45)`, padding: "11px 14px", fontFamily: "Orbitron", fontSize: 10 }}>
              <Code size={15} /> GITHUB LINK
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const ContactSection = () => {
  const text = "Halo, saya ingin menghubungi perwakilan kelompok portfolio.";
  return (
    <section id="section-contact" style={{ padding: "96px 24px 70px", maxWidth: 1120, margin: "0 auto" }}>
      <SectionHeader eyebrow="// contact_us.channel" title="CONTACT US" accent="#00FF88" accentRgb="0,255,136" />
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <Panel accent="#00FF88" accentRgb="0,255,136">
          <div style={{ fontFamily: "Share Tech Mono, monospace", color: "rgba(0,255,136,0.65)", letterSpacing: "0.25em", fontSize: 10, marginBottom: 16 }}>REPRESENTATIVE</div>
          <h3 style={{ color: "#fff", fontSize: 22, marginBottom: 12 }}>{groupInfo.contact.representative}</h3>
          <p style={{ color: "rgba(224,224,255,0.68)", lineHeight: 1.7 }}>Hubungi perwakilan kelompok untuk pertanyaan tentang website, project, sertifikat, atau kerja sama.</p>
        </Panel>
        <Panel accent="#00FFFF" accentRgb="0,255,255">
          <ContactRow icon={<Mail size={18} />} label="EMAIL" value={groupInfo.contact.email} href={`mailto:${groupInfo.contact.email}`} />
          <ContactRow icon={<MessageCircle size={18} />} label="WHATSAPP" value={groupInfo.contact.whatsapp} href={whatsappLink(groupInfo.contact.whatsapp, text)} />
          <a href={whatsappLink(groupInfo.contact.whatsapp, text)} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#00FFFF", textDecoration: "none", border: "1px solid rgba(0,255,255,0.5)", padding: "14px 18px", fontFamily: "Orbitron", fontSize: 11 }}>
            <Send size={15} /> SEND MESSAGE
          </a>
        </Panel>
      </div>
    </section>
  );
};

const ContactRow = ({ icon, label, value, href }) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ display: "flex", gap: 14, alignItems: "center", color: "inherit", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid rgba(0,255,255,0.1)" }}>
    <span style={{ color: "#00FFFF" }}>{icon}</span>
    <span>
      <span style={{ display: "block", fontFamily: "Share Tech Mono, monospace", fontSize: 9, letterSpacing: "0.25em", color: "rgba(0,255,255,0.48)", marginBottom: 3 }}>{label}</span>
      <span style={{ color: "rgba(224,224,255,0.82)", fontWeight: 700 }}>{value}</span>
    </span>
  </a>
);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <FontLoader />
      <GlobalStyle />
      <ScrollProgressBar />
      <CustomCursor />
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}>
        <Navbar />
        <Hero />
        <AboutSchool />
        <TeamSection />
        <CertificatesSection />
        <ProjectsSection />
        <ContactSection />
        <footer style={{ padding: 40, textAlign: "center", fontSize: 10, color: "rgba(0,255,255,0.3)", borderTop: "1px solid rgba(0,255,255,0.08)" }}>
          PORTOFOLIO KELOMPOK / REACT + GITHUB PAGES
        </footer>
      </div>
    </>
  );
}
