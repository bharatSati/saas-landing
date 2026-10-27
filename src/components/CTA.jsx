import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Asterisk, ArrowRight, ArrowUpRight, Check, CornerDownLeft, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const tickerPhrases = [
  "BUILD FASTER",
  "THINK BIGGER",
  "MOVE AS ONE",
  "SHIP ANYTHING",
  "STAY AHEAD",
  "OWN THE OUTCOME",
];

const tickerSerifPhrases = [
  "Make the impossible routine",
  "Turn intent into output",
  "Compound your ambition",
  "Own the next decade",
  "Build at the speed of thought",
];

function TickerRow({ variant = "top" }) {
  const phrases = variant === "top" ? tickerPhrases : tickerSerifPhrases;

  return (
    <div className={`cta-ticker-row cta-ticker-row--${variant}`}>
      {phrases.map((phrase, index) => (
        <span
          className={`cta-ticker-item cta-ticker-item--${variant} ${
            variant === "top" && index % 3 === 1 ? "is-solid" : ""
          }`}
          key={`${variant}-${phrase}-${index}`}
        >
          {phrase}
          {variant === "top" ? (
            <span className="cta-ticker-mark">
              <Asterisk size={20} strokeWidth={1.5} />
            </span>
          ) : (
            <span className="cta-ticker-diamond" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ticker = useRef(null);
  const tickerTrackTop = useRef(null);
  const tickerTrackBottom = useRef(null);
  const tickerProgress = useRef(null);

  useEffect(() => {
    const root = ticker.current;
    const topTrack = tickerTrackTop.current;
    const bottomTrack = tickerTrackBottom.current;
    const progress = tickerProgress.current;
    if (!root || !topTrack || !bottomTrack || !progress) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(progress, { scaleX: 1 });
      return;
    }

    const topLoop = gsap.to(topTrack, {
      xPercent: -50,
      duration: 48,
      ease: "none",
      repeat: -1,
    });

    gsap.set(bottomTrack, { xPercent: -50 });
    const bottomLoop = gsap.to(bottomTrack, {
      xPercent: 0,
      duration: 62,
      ease: "none",
      repeat: -1,
    });

    const marks = gsap.to(root.querySelectorAll(".cta-ticker-mark svg"), {
      rotation: 360,
      duration: 18,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    let boost = 0;
    let hovered = false;

    const tick = () => {
      boost *= 0.9;
      if (hovered) return;
      topLoop.timeScale(1 + boost);
      bottomLoop.timeScale(1 + boost * 0.78);
      marks.timeScale(1 + boost * 0.45);
    };
    gsap.ticker.add(tick);

    const velocityTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        boost = Math.min(Math.abs(self.getVelocity()) / 900, 2.8);
      },
    });

    const progressTween = gsap.fromTo(
      progress,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: "bottom bottom",
          scrub: 0.5,
        },
      },
    );

    const onEnter = () => {
      hovered = true;
      topLoop.pause();
      bottomLoop.pause();
      marks.pause();
    };
    const onLeave = () => {
      hovered = false;
      topLoop.resume();
      bottomLoop.resume();
      marks.resume();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      velocityTrigger.kill();
      progressTween.scrollTrigger?.kill();
      progressTween.kill();
      topLoop.kill();
      bottomLoop.kill();
      marks.kill();
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <section className="cta-section" id="cta">
      <div className="cta-grid" />
      <div className="cta-glow" />
      <div className="cta-orbit cta-orbit--one" />
      <div className="cta-orbit cta-orbit--two" />
      <div className="cta-orbit cta-orbit--three" />

      <div className="container cta-inner">
        <Reveal className="cta-kicker">
          <span className="status-pulse" />
          <span className="mono-label">YOUR NEXT CHAPTER STARTS NOW</span>
        </Reveal>

        <Reveal className="cta-title-wrap" delay={0.05}>
          <h2 className="cta-title">
            Stop planning.
            <br />
            <em>Start compounding.</em>
          </h2>
        </Reveal>

        <Reveal className="cta-sub" delay={0.12}>
          <p>
            Join 12,000+ teams using Axon to turn ambition into output. Your
            first workflow is live in under three minutes.
          </p>
        </Reveal>

        <Reveal className="cta-form-wrap" delay={0.18}>
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              <motion.form
                className="cta-form"
                onSubmit={submit}
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                <span className="input-spark"><Sparkles size={16} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your work email"
                  aria-label="Work email"
                  required
                />
                <button type="submit" className="button button--lime">
                  Start building free
                  <ArrowRight size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                className="cta-success"
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="success-check"><Check size={18} strokeWidth={3} /></span>
                <div>
                  <strong>You&apos;re in.</strong>
                  <span>We sent a magic link to {email}.</span>
                </div>
                <button type="button" onClick={() => { setSent(false); setEmail(""); }}>
                  Use another email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="cta-form-meta mono-label">
            <span><CornerDownLeft size={12} /> NO CREDIT CARD REQUIRED</span>
            <span>SETUP IN 3 MIN</span>
            <span>14-DAY TRIAL</span>
          </div>
        </Reveal>

        <Reveal className="cta-trust" delay={0.24}>
          <div className="cta-trust-item">
            <span className="status-pulse" />
            <span>All systems operational</span>
          </div>
          <span className="cta-divider" />
          <div className="cta-trust-item">
            <strong>4.9/5</strong>
            <span>from 2,400+ operators</span>
          </div>
          <span className="cta-divider" />
          <a href="#customers" className="cta-trust-link">
            Read the stories <ArrowUpRight size={13} />
          </a>
        </Reveal>
      </div>

      <div className="cta-ticker" ref={ticker} aria-hidden="true">
        <div className="cta-ticker-meta">
          <span className="cta-ticker-live">
            <span className="status-pulse" />
            MOMENTUM FEED
          </span>
          <span className="cta-ticker-meta-center">
            ALWAYS COMPOUNDING · 12.4K TASKS / MIN · 99.99% UPTIME
          </span>
          <span className="cta-ticker-meta-right">
            HOVER TO PAUSE <i /> SCROLL TO ACCELERATE
          </span>
        </div>
        <div className="cta-ticker-window">
          <div className="cta-ticker-beam" />
          <div className="cta-ticker-track cta-ticker-track--top" ref={tickerTrackTop}>
            <TickerRow variant="top" />
            <TickerRow variant="top" />
          </div>
          <div className="cta-ticker-track cta-ticker-track--bottom" ref={tickerTrackBottom}>
            <TickerRow variant="bottom" />
            <TickerRow variant="bottom" />
          </div>
        </div>
        <div className="cta-ticker-foot">
          <span className="mono-label">KINETIC / 01</span>
          <span className="cta-ticker-progress">
            <span ref={tickerProgress} />
          </span>
          <span className="mono-label">VELOCITY LINKED</span>
        </div>
      </div>
    </section>
  );
}
