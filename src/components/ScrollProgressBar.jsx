import { useEffect, useState } from "react";

/**
 * ScrollProgressBar
 * - Fixed to top of viewport
 * - Gradient: Cyan → Purple → Pink as scroll progresses
 * - Thin 3px bar with neon glow
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Interpolate glow color based on progress
  const glowColor =
    progress < 50
      ? `rgba(0,255,255,0.7)`
      : `rgba(255,0,255,0.7)`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 3,
        zIndex: 99998,
        background: "rgba(5,8,22,0.3)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #00FFFF 0%, #A855F7 50%, #FF00FF 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: `${100 - progress}% 0`,
          boxShadow: `0 0 8px ${glowColor}, 0 0 20px ${glowColor}`,
          transition: "width 0.08s linear, box-shadow 0.3s",
          borderRadius: "0 2px 2px 0",
        }}
      />
      {/* Leading glow dot */}
      {progress > 1 && progress < 100 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: progress < 50 ? "#00FFFF" : "#FF00FF",
            boxShadow: `0 0 10px ${progress < 50 ? "#00FFFF" : "#FF00FF"}, 0 0 20px ${progress < 50 ? "rgba(0,255,255,0.8)" : "rgba(255,0,255,0.8)"}`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.08s linear",
          }}
        />
      )}
    </div>
  );
}