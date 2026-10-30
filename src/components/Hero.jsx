import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Move3D,
  Play,
  ScanLine,
  Star,
} from "lucide-react";
import gsap from "gsap";
import HeroCoreScene from "./HeroCoreScene";
import Magnetic from "./Magnetic";
import { scrollToSection } from "../hooks/useSmoothScroll";

const avatars = [
  { initials: "AM", from: "#c8ff3d", to: "#4d7b00" },
  { initials: "SK", from: "#9aabff", to: "#333a84" },
  { initials: "JL", from: "#ff9d77", to: "#7d2f17" },
  { initials: "NO", from: "#7fffe0", to: "#065f4b" },
];

export default function Hero({ ready }) {
  const root = useRef(null);

  useEffect(() => {
    const hero = root.current;
    if (!hero) return;

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      hero.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };

    hero.addEventListener("pointermove", onPointerMove);
    return () => hero.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.08,
      });

      tl.fromTo(
        ".hero-title .hero-line > span",
        { yPercent: 112, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.12 },
        0,
      )
        .fromTo(
          ".hero-announcement",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.15,
        )
        .fromTo(
          ".hero-heading-meta",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0.42,
        )
        .fromTo(
          ".hero-sub",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.5,
        )
        .fromTo(
          ".hero-actions",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.62,
        )
        .fromTo(
          ".hero-command",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.7,
        )
        .fromTo(
          ".hero-proof",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.82,
        )
        .fromTo(
          ".hero-visual-inner",
          { scale: 0.88, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.5, ease: "power3.out" },
          0.2,
        )
        .fromTo(
          ".hero-chip",
          { scale: 0.8, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.8)" },
          0.9,
        )
        .fromTo(
          ".hero-bottom > *",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 },
          1,
        );
    }, root);

    return () => context.revert();
  }, [ready]);

  return (
    <section className="hero" id="home" ref={root}>
      <div className="hero-ambient" />
      <div className="hero-grid" />
      <div className="hero-spotlight" />
      <div className="hero-scanlines" />
      <div className="hero-noise" />

      <div className="hero-rail hero-rail--left" aria-hidden="true">
        <span>AXON // NEURAL OS</span>
        <i />
        <span>04.07.26</span>
      </div>
      <div className="hero-rail hero-rail--right" aria-hidden="true">
        <span>LAT 37.7749</span>
        <i />
        <span>LONG 122.4194</span>
      </div>

      <div className="hero-main container-wide">
        <div className="hero-copy">
          <div className="hero-announcement">
            <span className="announcement-badge">NEW</span>
            <span>Introducing Axon 3.0 — agents that act on their own</span>
            <span className="announcement-live"><i /> LIVE</span>
            <ArrowRight size={14} />
          </div>

          <h1 className="hero-title">
            <span className="hero-line">
              <span>Build at the</span>
            </span>
            <span className="hero-line">
              <span>
                speed of <em>thought.</em>
              </span>
            </span>
          </h1>

          <div className="hero-heading-meta mono-label">
            <span><i /> AUTONOMOUS BY DEFAULT</span>
            <span>THINK → ORCHESTRATE → SHIP</span>
            <span>01 / 05</span>
          </div>

          <p className="hero-sub">
            Axon is the autonomous operating system for teams who refuse to
            wait. Describe the outcome — a living mesh of agents plans, reasons,
            and ships across your entire stack.
          </p>

          <div className="hero-actions">
            <Magnetic strength={0.2}>
              <a
                href="#cta"
                className="button button--lime button--large"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("#cta");
                }}
              >
                Deploy your first agent
                <span className="button-icon">
                  <ArrowUpRight size={17} />
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={0.14}>
              <a
                href="#platform"
                className="button button--ghost button--large"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("#platform");
                }}
              >
                <span className="play-icon">
                  <Play size={11} fill="currentColor" />
                </span>
                Explore the system
              </a>
            </Magnetic>
          </div>

          <div className="hero-command">
            <span className="hero-command-prompt">&gt;_</span>
            <span className="hero-command-text">axon deploy --agents 28 --mode autonomous</span>
            <span className="hero-command-caret" />
            <span className="hero-command-state"><i /> READY</span>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack">
              {avatars.map((avatar) => (
                <span
                  className="avatar"
                  key={avatar.initials}
                  style={{
                    background: `linear-gradient(135deg, ${avatar.from}, ${avatar.to})`,
                  }}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div className="proof-copy">
              <div className="proof-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={11} fill="currentColor" strokeWidth={0} />
                ))}
                <span>4.9/5</span>
              </div>
              <p>Trusted by 12,000+ teams shipping with AI</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-inner">
            <div className="hero-visual-meta mono-label">
              <span>SYSTEM / NEURAL CORE</span>
              <span className="hero-visual-meta-live"><i /> LIVE RENDER</span>
            </div>

            <div className="orb-stage" data-cursor data-cursor-label="DRAG">
              <div className="orb-aura orb-aura--one" />
              <div className="orb-aura orb-aura--two" />
              <div className="orb-glow" />
              <HeroCoreScene />

              <div className="orb-reticle" aria-hidden="true">
                <span className="reticle-corner reticle-corner--tl" />
                <span className="reticle-corner reticle-corner--tr" />
                <span className="reticle-corner reticle-corner--bl" />
                <span className="reticle-corner reticle-corner--br" />
                <span className="reticle-axis reticle-axis--x" />
                <span className="reticle-axis reticle-axis--y" />
                <span className="reticle-dot" />
              </div>

              <div className="orb-readout orb-readout--nw mono-label">
                <span>CORE</span><strong>AX-09</strong>
              </div>
              <div className="orb-readout orb-readout--se mono-label">
                <span>STATE</span><strong>SYNCED</strong>
              </div>
            </div>

            <div className="hero-hud-frame" aria-hidden="true">
              <span /><span /><span /><span />
            </div>

            <motion.div
              className="hero-chip hero-chip--status"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="chip-pulse" />
              <div>
                <span className="chip-label">AGENT MESH</span>
                <strong>28 nodes active</strong>
              </div>
              <span className="chip-live">LIVE</span>
            </motion.div>

            <motion.div
              className="hero-chip hero-chip--metrics"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <span className="chip-label">THROUGHPUT</span>
              <div className="chip-metric">
                <strong>12.4K</strong>
                <span>ops/sec</span>
              </div>
              <div className="micro-bars">
                {[34, 60, 42, 78, 58, 92, 74, 100].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hero-chip hero-chip--model"
              animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            >
              <span className="model-icon">λ</span>
              <div>
                <span className="chip-label">REASONING CORE</span>
                <strong>Axon-2 · Reason</strong>
              </div>
            </motion.div>

            <motion.div
              className="hero-chip hero-chip--latency"
              animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
            >
              <span className="latency-wave">
                {[4, 7, 5, 9, 6, 10, 7, 4, 8, 5].map((height, index) => (
                  <i key={index} style={{ height: `${height}px` }} />
                ))}
              </span>
              <div>
                <span className="chip-label">LATENCY</span>
                <strong>12ms</strong>
              </div>
            </motion.div>

            <div className="orb-instruction mono-label">
              <Move3D size={13} />
              <span>DRAG TO ORBIT</span>
              <i />
              <ScanLine size={12} />
              <span>CLICK TO PULSE</span>
              <Activity size={12} />
              <span>MOVE TO DEFORM</span>
            </div>

            <div className="hero-orbit-label mono-label">
              <span>NEURAL LINK</span>
              <i />
              <span>EST. 2021</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-bottom container-wide">
        <div className="hero-stat">
          <strong>12k<span>+</span></strong>
          <span>Teams in orbit</span>
        </div>
        <div className="hero-stat">
          <strong>1.4B<span>+</span></strong>
          <span>Tasks automated</span>
        </div>
        <div className="hero-stat">
          <strong>99.99<span>%</span></strong>
          <span>Uptime, guaranteed</span>
        </div>
        <button
          type="button"
          className="scroll-cue"
          onClick={() => scrollToSection("#features")}
          aria-label="Scroll to features"
        >
          <span className="scroll-cue-track">
            <span className="scroll-cue-dot" />
          </span>
          <span className="mono-label">SCROLL TO EXPLORE</span>
        </button>
      </div>
    </section>
  );
}
