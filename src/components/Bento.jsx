import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useRive } from "@rive-app/react-canvas";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Check,
  Cloud,
  Code2,
  Database,
  Figma,
  Fingerprint,
  Github,
  Mail,
  ShieldCheck,
  Slack,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function SpotlightCard({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      className={`bento-card ${className}`}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function WorkflowCard() {
  return (
    <SpotlightCard className="bento-card--workflow" delay={0.02}>
      <div className="bento-top">
        <span className="bento-tag mono-label">
          <Workflow size={13} />
          ORCHESTRATION
        </span>
        <span className="bento-arrow" data-cursor>
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="bento-copy">
        <h3>Workflows that think for themselves.</h3>
        <p>
          Describe an outcome. Axon maps the work, chooses the right models, and
          runs every step in parallel.
        </p>
      </div>

      <div className="flow-visual">
        <div className="flow-grid" />
        <svg className="flow-lines" viewBox="0 0 520 290" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c8ff3d" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#c8ff3d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c8ff3d" stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <path d="M 110 145 C 165 145 160 145 206 145" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 7" className="flow-path" />
          <path d="M 278 145 C 330 145 323 62 378 62" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 7" className="flow-path flow-path--two" />
          <path d="M 278 145 C 330 145 323 145 378 145" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 7" className="flow-path flow-path--three" />
          <path d="M 278 145 C 330 145 323 228 378 228" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 7" className="flow-path flow-path--four" />
        </svg>

        <div className="flow-node flow-node--trigger">
          <span className="flow-node-icon">
            <Zap size={14} />
          </span>
          <div>
            <span className="flow-node-label mono-label">TRIGGER</span>
            <strong>New lead</strong>
          </div>
        </div>

        <div className="flow-node flow-node--agent">
          <span className="flow-agent-rings" />
          <span className="flow-node-icon flow-node-icon--agent">
            <Bot size={17} />
          </span>
          <div>
            <span className="flow-node-label mono-label">AGENT</span>
            <strong>Axon-2</strong>
          </div>
          <span className="flow-thinking">
            <i />
            thinking
          </span>
        </div>

        <div className="flow-node flow-node--out flow-node--out1">
          <span className="flow-check">
            <Check size={10} strokeWidth={3} />
          </span>
          Enrich
        </div>
        <div className="flow-node flow-node--out flow-node--out2">
          <span className="flow-check">
            <Check size={10} strokeWidth={3} />
          </span>
          Qualify
        </div>
        <div className="flow-node flow-node--out flow-node--out3">
          <span className="flow-check">
            <Check size={10} strokeWidth={3} />
          </span>
          Outreach
        </div>

        <div className="flow-result">
          <span className="flow-result-dot" />
          <span>Workflow complete</span>
          <strong>2.4s</strong>
        </div>
      </div>
    </SpotlightCard>
  );
}

function RiveCard() {
  const [ready, setReady] = useState(false);
  const { RiveComponent } = useRive(
    {
      src: "/avatars.riv",
      autoplay: true,
      shouldDisableRiveListeners: true,
      onRiveReady: () => setReady(true),
    },
    { useDevicePixelRatio: true },
  );

  return (
    <SpotlightCard className="bento-card--rive" delay={0.1}>
      <div className="bento-top">
        <span className="bento-tag mono-label">
          <Sparkles size={13} />
          LIVE MOTION
        </span>
        <span className="bento-arrow" data-cursor>
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="bento-copy">
        <h3>Agents with a pulse.</h3>
        <p>Real-time, human-grade feedback that makes every interaction feel alive.</p>
      </div>

      <div className={`rive-visual ${ready ? "is-ready" : ""}`}>
        <div className="rive-glow" />
        <div className="rive-grid" />
        <RiveComponent className="rive-canvas" />
        <div className="rive-fallback">
          <span />
          <span />
          <span />
        </div>
        <div className="rive-hud rive-hud--top mono-label">
          <span>NEURAL SIGNAL</span>
          <span className="rive-hud-value">98.7%</span>
        </div>
        <div className="rive-hud rive-hud--bottom">
          <span className="status-pulse" />
          <span className="mono-label">RIVE RUNTIME · 60FPS</span>
        </div>
      </div>
    </SpotlightCard>
  );
}

function TelemetryCard() {
  return (
    <SpotlightCard className="bento-card--telemetry" delay={0.04}>
      <div className="bento-top">
        <span className="bento-tag mono-label">
          <Activity size={13} />
          TELEMETRY
        </span>
        <span className="live-pill">
          <span className="status-pulse" />
          LIVE
        </span>
      </div>
      <div className="bento-copy">
        <h3>Every pulse, visible.</h3>
        <p>Trace every decision, token, and outcome in real time.</p>
      </div>

      <div className="telemetry-visual">
        <div className="telemetry-number">
          <strong>84.2K</strong>
          <span>tasks / day</span>
          <span className="telemetry-delta">+18.4%</span>
        </div>
        <svg viewBox="0 0 360 150" fill="none" preserveAspectRatio="none" className="telemetry-chart">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8ff3d" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#c8ff3d" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c8ff3d" stopOpacity="0.1" />
              <stop offset="55%" stopColor="#c8ff3d" />
              <stop offset="100%" stopColor="#eaffb3" />
            </linearGradient>
          </defs>
          <path d="M0 130H360M0 90H360M0 50H360" stroke="#ffffff" strokeOpacity="0.055" strokeDasharray="2 5" />
          <motion.path
            d="M0 126 C24 122 28 104 52 108 S78 120 98 94 S124 82 142 87 S168 108 188 72 S226 48 246 60 S278 62 300 38 S330 30 360 14 L360 150 L0 150Z"
            fill="url(#chartFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <motion.path
            d="M0 126 C24 122 28 104 52 108 S78 120 98 94 S124 82 142 87 S168 108 188 72 S226 48 246 60 S278 62 300 38 S330 30 360 14"
            stroke="url(#chartLine)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
          <circle cx="360" cy="14" r="4" fill="#c8ff3d" />
          <circle cx="360" cy="14" r="9" fill="#c8ff3d" fillOpacity="0.12" />
        </svg>
        <div className="telemetry-legend mono-label">
          <span>P50 LATENCY</span>
          <strong>82ms</strong>
        </div>
      </div>
    </SpotlightCard>
  );
}

const integrations = [
  { icon: Slack, label: "Slack" },
  { icon: Github, label: "GitHub" },
  { icon: Figma, label: "Figma" },
  { icon: Database, label: "Postgres" },
  { icon: Mail, label: "Gmail" },
  { icon: Cloud, label: "S3" },
];

function IntegrationsCard() {
  return (
    <SpotlightCard className="bento-card--integrations" delay={0.08}>
      <div className="bento-top">
        <span className="bento-tag mono-label">
          <Code2 size={13} />
          CONNECTIVITY
        </span>
        <span className="bento-arrow" data-cursor>
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="bento-copy">
        <h3>Plays well with everything.</h3>
        <p>200+ native integrations. Zero glue code.</p>
      </div>

      <div className="integration-visual">
        <span className="orbit-ring orbit-ring--one" />
        <span className="orbit-ring orbit-ring--two" />
        <span className="orbit-ring orbit-ring--three" />
        <div className="integration-core">
          <span className="brand-mark brand-mark--mini">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M6.5 21.5 14 5l7.5 16.5h-4.1L14 13.3l-3.4 8.2H6.5Z" fill="currentColor" />
              <circle cx="21.4" cy="6.3" r="2.1" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="integration-orbit">
          {integrations.map(({ icon: Icon, label }, index) => (
            <span
              className={`integration-chip integration-chip--${index + 1}`}
              key={label}
              title={label}
            >
              <Icon size={17} strokeWidth={1.6} />
            </span>
          ))}
        </div>
        <span className="integration-count mono-label">+200 MORE</span>
      </div>
    </SpotlightCard>
  );
}

function SecurityCard() {
  return (
    <SpotlightCard className="bento-card--security" delay={0.12}>
      <div className="bento-top">
        <span className="bento-tag mono-label">
          <ShieldCheck size={13} />
          SECURITY
        </span>
        <span className="security-badge mono-label">SOC 2</span>
      </div>
      <div className="bento-copy">
        <h3>Secure to the core.</h3>
        <p>Your data never trains our models. Ever.</p>
      </div>

      <div className="security-visual">
        <span className="security-ring security-ring--one" />
        <span className="security-ring security-ring--two" />
        <span className="security-ring security-ring--three" />
        <div className="security-core">
          <Fingerprint size={29} strokeWidth={1.2} />
        </div>
        <div className="security-list">
          <span>
            <Check size={11} strokeWidth={3} /> AES-256 encryption
          </span>
          <span>
            <Check size={11} strokeWidth={3} /> Zero retention
          </span>
          <span>
            <Check size={11} strokeWidth={3} /> Private VPC
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function Bento() {
  return (
    <section className="section features-section" id="features">
      <div className="container">
        <SectionHeading
          eyebrow="THE PLATFORM"
          index="01"
          title={
            <>
              One system.
              <br />
              <em>Infinite leverage.</em>
            </>
          }
          description="Stop stitching together tools. Axon gives your team one intelligent surface for strategy, execution, and everything in between."
        />

        <div className="bento-grid">
          <WorkflowCard />
          <RiveCard />
          <TelemetryCard />
          <IntegrationsCard />
          <SecurityCard />
        </div>

        <Reveal className="features-footer">
          <span className="features-footer-line" />
          <span className="mono-label">EVERYTHING YOUR TEAM NEEDS. NOTHING IT DOESN'T.</span>
          <a href="#platform" className="text-link" data-cursor>
            Explore the platform <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
