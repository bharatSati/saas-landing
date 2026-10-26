import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, CornerDownLeft, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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

      <div className="cta-marquee" aria-hidden="true">
        <div className="cta-marquee-track">
          <span>BUILD FASTER <i>✳</i> THINK BIGGER <i>✳</i> STAY AHEAD <i>✳</i> BUILD FASTER <i>✳</i> THINK BIGGER <i>✳</i> STAY AHEAD <i>✳</i></span>
          <span>BUILD FASTER <i>✳</i> THINK BIGGER <i>✳</i> STAY AHEAD <i>✳</i> BUILD FASTER <i>✳</i> THINK BIGGER <i>✳</i> STAY AHEAD <i>✳</i></span>
        </div>
      </div>
    </section>
  );
}
