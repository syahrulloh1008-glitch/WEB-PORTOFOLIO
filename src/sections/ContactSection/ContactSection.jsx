import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Code, Camera, Briefcase, Mail, Send, Terminal, Wifi, MessageCircle } from "lucide-react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

  @keyframes electric-pulse {
    0%,85%,100% { filter: drop-shadow(0 0 0px currentColor); opacity: 1; }
    88% { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 20px currentColor); opacity: 1; transform: scale(1.15); }
    91% { filter: drop-shadow(0 0 2px currentColor); opacity: 0.7; transform: scale(0.95); }
    94% { filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 30px currentColor); opacity: 1; transform: scale(1.1); }
    97% { filter: drop-shadow(0 0 4px currentColor); opacity: 0.8; }
  }
  @keyframes underline-expand {
    from { width: 0; left: 50%; }
    to   { width: 100%; left: 0; }
  }
  @keyframes terminal-cursor {
    0%,100% { opacity: 1; }
    50%     { opacity: 0; }
  }
  @keyframes corner-blink {
    0%,100% { opacity: 0.5; }
    50%     { opacity: 1; }
  }
  @keyframes send-fly {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(40px,-40px) scale(0); opacity: 0; }
  }
  @keyframes success-appear {
    from { transform: scale(0.8) translateY(10px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes grid-drift {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }
  @keyframes ambient-glow {
    0%,100% { opacity: 0.5; transform: scale(1); }
    50%     { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes social-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes typing-dots {
    0%,20%   { content: '.'; }
    40%,60%  { content: '..'; }
    80%,100% { content: '...'; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Corners ──────────────────────────────────────────────────────────────────
function Corners({ accent }) {
  const base = { position:"absolute", width:10, height:10, borderColor:accent, borderStyle:"solid", animation:"corner-blink 2.5s ease-in-out infinite" };
  return (
    <>
      <div style={{...base,top:0,left:0,borderWidth:"1px 0 0 1px"}}/>
      <div style={{...base,top:0,right:0,borderWidth:"1px 1px 0 0"}}/>
      <div style={{...base,bottom:0,left:0,borderWidth:"0 0 1px 1px"}}/>
      <div style={{...base,bottom:0,right:0,borderWidth:"0 1px 1px 0"}}/>
    </>
  );
}

// ─── Terminal Input Field ─────────────────────────────────────────────────────
function TerminalInput({ label, name, value, onChange, type="text", placeholder, multiline=false, accent="#00FFFF", accentRgb="0,255,255", index=0 }) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.1, duration:0.5 }}
      style={{ marginBottom: multiline ? 0 : 28, position:"relative" }}
    >
      {/* Label */}
      <div style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:10, letterSpacing:"0.3em",
        color: focused ? accent : "rgba(200,200,230,0.4)",
        marginBottom:8,
        transition:"color 0.3s",
        display:"flex", alignItems:"center", gap:8,
      }}>
        <span style={{ color: focused ? accent : "rgba(200,200,230,0.25)" }}>›</span>
        {label}
        {focused && <span style={{ animation:"terminal-cursor 0.8s step-end infinite", color:accent }}>_</span>}
      </div>

      {/* Input */}
      <div style={{ position:"relative" }}>
        <Tag
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={multiline ? 5 : undefined}
          style={{
            width:"100%",
            background:"transparent",
            border:"none",
            borderBottom: `1px solid rgba(${accentRgb},${focused ? 0.8 : 0.2})`,
            color:"rgba(220,220,255,0.9)",
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:13,
            lineHeight: multiline ? 1.7 : "normal",
            padding: multiline ? "12px 0 8px" : "8px 0",
            outline:"none",
            resize:"none",
            caretColor: accent,
            transition:"border-color 0.3s",
          }}
        />
        {/* Glow line expansion */}
        <div style={{
          position:"absolute", bottom:0, left:"50%",
          height:1,
          width: focused ? "100%" : "0%",
          left: focused ? "0%" : "50%",
          background:`linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: focused ? `0 0 8px ${accent}, 0 0 16px rgba(${accentRgb},0.4)` : "none",
          transition:"width 0.4s cubic-bezier(0.16,1,0.3,1), left 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
        }}/>
      </div>
    </motion.div>
  );
}

// ─── Social Icon ──────────────────────────────────────────────────────────────
function SocialIcon({ icon: Icon, label, href, color, colorRgb, delay=0 }) {
  const [hovered, setHovered] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setPulsing(true);
        setTimeout(() => setPulsing(false), 600);
      }, 3500 + delay * 700);
      return () => clearInterval(interval);
    }, delay * 400);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y:-6, scale:1.1 }}
      whileTap={{ scale:0.92 }}
      style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:8, textDecoration:"none", cursor:"none" }}
    >
      {/* Ring on pulse */}
      <AnimatePresence>
        {pulsing && (
          <motion.div
            key="ring"
            initial={{ scale:1, opacity:0.8 }}
            animate={{ scale:2.5, opacity:0 }}
            exit={{}}
            transition={{ duration:0.6, ease:"easeOut" }}
            style={{
              position:"absolute", top:"50%", left:"50%",
              width:44, height:44, borderRadius:"50%",
              border:`1px solid ${color}`,
              transform:"translate(-50%,-50%)",
              pointerEvents:"none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon box */}
      <div style={{
        width:48, height:48,
        border:`1px solid rgba(${colorRgb},${hovered ? 0.9 : 0.3})`,
        borderRadius:4,
        display:"flex", alignItems:"center", justifyContent:"center",
        background:`rgba(${colorRgb},${hovered ? 0.15 : 0.04})`,
        color: hovered ? color : `rgba(${colorRgb},0.7)`,
        boxShadow: hovered
          ? `0 0 20px rgba(${colorRgb},0.5), 0 0 40px rgba(${colorRgb},0.2), inset 0 0 12px rgba(${colorRgb},0.1)`
          : pulsing
            ? `0 0 16px rgba(${colorRgb},0.6), 0 0 32px rgba(${colorRgb},0.3)`
            : "none",
        transition:"all 0.3s",
        animation: pulsing ? `electric-pulse 0.6s ease-out` : "none",
      }}>
        <Icon size={20} />
      </div>

      {/* Label */}
      <span style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:8, letterSpacing:"0.2em",
        color: hovered ? color : `rgba(${colorRgb},0.4)`,
        transition:"color 0.3s",
      }}>{label}</span>
    </motion.a>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [fields, setFields] = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = useCallback((msg, color="#00FFFF") => {
    setLog(prev => [...prev, { msg, color, id: Date.now() + Math.random() }]);
  }, []);

  const handleChange = (e) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!fields.name || !fields.email || !fields.message) {
      addLog("ERROR: Field name, email, message wajib diisi.", "#FF4444");
      return;
    }
    setSending(true);
    addLog("Initializing secure channel...", "#00FFFF");
    await delay(600);
    addLog("Encrypting payload...", "#A855F7");
    await delay(700);
    addLog(`Sending to SMTP server...`, "#00FF88");
    await delay(800);
    addLog("✓ TRANSMISSION COMPLETE", "#00FF88");
    setSending(false);
    setSent(true);
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{
        position:"relative",
        background:"linear-gradient(145deg, rgba(0,255,255,0.03), rgba(5,8,22,0.95))",
        border:"1px solid rgba(0,255,255,0.15)",
        borderRadius:4,
        padding:"36px 32px",
        backdropFilter:"blur(12px)",
      }}
    >
      <Corners accent="#00FFFF" />

      {/* Terminal header bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        marginBottom:28,
        paddingBottom:16,
        borderBottom:"1px solid rgba(0,255,255,0.1)",
      }}>
        <Terminal size={14} color="#00FFFF" />
        <span style={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:10, letterSpacing:"0.25em",
          color:"rgba(0,255,255,0.6)",
        }}>contact_form.sh — secure-shell</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => (
            <div key={c} style={{ width:8, height:8, borderRadius:"50%", background:c, opacity:0.7 }} />
          ))}
        </div>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          animate={{ opacity:1, scale:1 }}
          style={{ textAlign:"center", padding:"32px 0" }}
        >
          <div style={{ fontSize:40, marginBottom:16 }}>✓</div>
          <div style={{
            fontFamily:"'Orbitron', monospace",
            fontSize:16, color:"#00FF88",
            textShadow:"0 0 20px rgba(0,255,136,0.6)",
            marginBottom:8,
          }}>TRANSMISSION COMPLETE</div>
          <div style={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:11, color:"rgba(200,200,230,0.45)",
          }}>Pesan kamu sudah diterima. Akan dibalas dalam 24 jam.</div>
        </motion.div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
            <TerminalInput label="FULL_NAME" name="name" value={fields.name} onChange={handleChange} placeholder="John Doe" index={0} />
            <TerminalInput label="EMAIL_ADDR" name="email" value={fields.email} onChange={handleChange} type="email" placeholder="john@example.com" index={1} />
          </div>
          <TerminalInput label="SUBJECT" name="subject" value={fields.subject} onChange={handleChange} placeholder="Project discussion / Collaboration" index={2} />
          <TerminalInput label="MESSAGE_BODY" name="message" value={fields.message} onChange={handleChange} multiline placeholder="Ketik pesanmu di sini..." index={3} />

          {/* Terminal log */}
          {log.length > 0 && (
            <div style={{
              margin:"20px 0 0",
              padding:"12px 14px",
              background:"rgba(0,0,0,0.4)",
              border:"1px solid rgba(0,255,255,0.08)",
              borderRadius:2,
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:10,
            }}>
              {log.map(l => (
                <div key={l.id} style={{ color:l.color, marginBottom:3 }}>
                  <span style={{ color:"rgba(0,255,255,0.3)", marginRight:6 }}>$</span>{l.msg}
                </div>
              ))}
              {sending && (
                <span style={{ color:"rgba(0,255,255,0.5)", animation:"terminal-cursor 0.8s step-end infinite" }}>█</span>
              )}
            </div>
          )}

          {/* Submit button */}
          <motion.button
            onClick={handleSubmit}
            disabled={sending}
            whileHover={{ y:-2, boxShadow:"0 0 30px rgba(0,255,255,0.4), 0 0 60px rgba(0,255,255,0.15)" }}
            whileTap={{ scale:0.97 }}
            style={{
              marginTop:28,
              width:"100%",
              padding:"14px 0",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              fontFamily:"'Orbitron', monospace",
              fontSize:11, fontWeight:700, letterSpacing:"0.2em",
              background:"linear-gradient(135deg, rgba(0,255,255,0.12), rgba(168,85,247,0.12))",
              border:"1px solid rgba(0,255,255,0.5)",
              color:"#00FFFF",
              borderRadius:2,
              cursor:"none",
              boxShadow:"0 0 12px rgba(0,255,255,0.15)",
              opacity: sending ? 0.6 : 1,
              transition:"opacity 0.3s",
            }}
          >
            <Send size={14} style={{ animation: sending ? "send-fly 1s ease-in-out infinite" : "none" }} />
            {sending ? "TRANSMITTING..." : "SEND TRANSMISSION"}
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────
function InfoPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  const items = [
    { icon:<Mail size={14}/>, label:"EMAIL", value:"syahrul@example.com", accent:"#00FFFF", accentRgb:"0,255,255" },
    { icon:<Wifi size={14}/>, label:"STATUS", value:"Available for hire", accent:"#00FF88", accentRgb:"0,255,136" },
    { icon:<Terminal size={14}/>, label:"LOCATION", value:"Surabaya, East Java, ID", accent:"#A855F7", accentRgb:"168,85,247" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay:0.2, duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{ display:"flex", flexDirection:"column", gap:20 }}
    >
      {/* Intro */}
      <div style={{
        position:"relative",
        padding:"28px 24px",
        border:"1px solid rgba(168,85,247,0.18)",
        borderRadius:4,
        background:"linear-gradient(145deg, rgba(168,85,247,0.04), rgba(5,8,22,0.9))",
      }}>
        <Corners accent="#A855F7" />
        <div style={{
          fontFamily:"'Orbitron', monospace",
          fontSize:14, fontWeight:700, color:"#fff",
          marginBottom:12, letterSpacing:"0.05em",
        }}>OPEN FOR CONNECTION</div>
        <p style={{
          fontFamily:"'Rajdhani', sans-serif",
          fontSize:14, lineHeight:1.7,
          color:"rgba(200,200,230,0.6)",
        }}>
          Tertarik kolaborasi, diskusi proyek jaringan, atau sekadar ngobrol soal teknologi? Jangan ragu untuk mengirim pesan. Response time &lt;24 jam.
        </p>
      </div>

      {/* Contact items */}
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity:0, x:20 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ delay:0.3+i*0.1, duration:0.5 }}
          style={{
            display:"flex", alignItems:"center", gap:14,
            padding:"14px 18px",
            border:`1px solid rgba(${item.accentRgb},0.15)`,
            borderRadius:4,
            background:`rgba(${item.accentRgb},0.03)`,
          }}
        >
          <div style={{
            color:item.accent,
            filter:`drop-shadow(0 0 4px ${item.accent})`,
          }}>{item.icon}</div>
          <div>
            <div style={{
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:8, letterSpacing:"0.25em",
              color:`rgba(${item.accentRgb},0.5)`,
              marginBottom:2,
            }}>{item.label}</div>
            <div style={{
              fontFamily:"'Rajdhani', sans-serif",
              fontSize:13, fontWeight:600,
              color:"rgba(220,220,255,0.8)",
            }}>{item.value}</div>
          </div>
        </motion.div>
      ))}

      {/* Social icons */}
      <div style={{
        position:"relative",
        padding:"24px 20px",
        border:"1px solid rgba(0,255,255,0.1)",
        borderRadius:4,
        background:"rgba(0,255,255,0.02)",
      }}>
        <Corners accent="#00FFFF" />
        <div style={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:9, letterSpacing:"0.3em",
          color:"rgba(0,255,255,0.35)",
          marginBottom:20, textAlign:"center",
        }}>// SOCIAL_LINKS.config</div>
        <div style={{ display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
          <SocialIcon icon={Code} label="GITHUB" href="#" color="#fff" colorRgb="255,255,255" delay={0} />
          <SocialIcon icon={MessageCircle} label="WHATSAPP" href="#" color="#25D366" colorRgb="37,211,102" delay={1} />
          <SocialIcon icon={Camera} label="INSTAGRAM" href="#" color="#E1306C" colorRgb="225,48,108" delay={2} />
          <SocialIcon icon={Briefcase} label="LINKEDIN" href="#" color="#0A66C2" colorRgb="10,102,194" delay={3} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.7 }}
      style={{ textAlign:"center", marginBottom:56 }}
    >
      <div style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:10, letterSpacing:"0.4em",
        color:"rgba(0,255,255,0.5)", marginBottom:12,
      }}>// contact.initialize()</div>
      <h2 style={{
        fontFamily:"'Orbitron', monospace",
        fontSize:"clamp(22px,4vw,38px)", fontWeight:900,
        letterSpacing:"0.08em", color:"#fff",
        textShadow:"0 0 20px rgba(0,255,255,0.4)",
        marginBottom:16,
      }}>ESTABLISH CONNECTION</h2>
      <div style={{
        width:80, height:1, margin:"0 auto",
        background:"linear-gradient(90deg, transparent, #00FFFF, transparent)",
        boxShadow:"0 0 10px #00FFFF",
      }}/>
    </motion.div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop:"1px solid rgba(0,255,255,0.08)",
      padding:"32px 24px",
      textAlign:"center",
    }}>
      <div style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:9, letterSpacing:"0.3em",
        color:"rgba(0,255,255,0.2)",
        marginBottom:8,
      }}>
        ◈ SYAHRUL RAMADHAN · NETWORK ENGINEER · SURABAYA ID ◈
      </div>
      <div style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:8, letterSpacing:"0.2em",
        color:"rgba(200,200,230,0.15)",
      }}>
        © {new Date().getFullYear()} · BUILT WITH REACT + FRAMER MOTION
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ContactSection() {
  useEffect(() => {
    if (document.getElementById("contact-css")) return;
    const el = document.createElement("style");
    el.id = "contact-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  return (
    <div style={{ background:"#050816", color:"#e0e0ff" }}>
      {/* Ambient background */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
          backgroundSize:"60px 60px",
          animation:"grid-drift 8s linear infinite",
        }}/>
        <div style={{
          position:"absolute", top:"20%", left:"10%",
          width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(0,255,255,0.05) 0%, transparent 70%)",
          animation:"ambient-glow 6s ease-in-out infinite",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", bottom:"10%", right:"5%",
          width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
          animation:"ambient-glow 8s 2s ease-in-out infinite",
          pointerEvents:"none",
        }}/>

        <section style={{ position:"relative", zIndex:1, padding:"100px 24px 60px", maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader />
          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:32,
          }}
            className="contact-grid"
          >
            <ContactForm />
            <InfoPanel />
          </div>
        </section>
      </div>

      <Footer />

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}