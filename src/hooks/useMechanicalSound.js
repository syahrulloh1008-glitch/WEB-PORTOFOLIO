import { useCallback, useRef } from "react";

/**
 * useMechanicalSound
 * Plays a very subtle mechanical click using the Web Audio API.
 * No external files needed — pure synthesis.
 *
 * Usage:
 *   const { playClick } = useMechanicalSound();
 *   <button onClick={playClick}>Nav Item</button>
 */
export default function useMechanicalSound({ volume = 0.06 } = {}) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /**
   * Mechanical click = short noise burst + tiny low-freq thud
   */
  const playClick = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // ── Noise burst (key contact) ──────────────────────────
      const bufLen = ctx.sampleRate * 0.018; // 18ms
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen); // fading noise
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      // Bandpass — gives it that "clicky" mid character
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 3500;
      bp.Q.value = 0.8;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      noise.connect(bp);
      bp.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // ── Low thud (key bottom-out) ──────────────────────────
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.025);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(volume * 0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.030);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      // Silently fail — audio is optional
    }
  }, [getCtx, volume]);

  /**
   * Slightly higher-pitched variant for hover
   */
  const playHover = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.012);
      const g = ctx.createGain();
      g.gain.setValueAtTime(volume * 0.3, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {}
  }, [getCtx, volume]);

  return { playClick, playHover };
}