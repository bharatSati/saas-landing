import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import gsap from "gsap";

const bootSteps = [
  { threshold: 12, label: "NEURAL CORE", value: "ONLINE" },
  { threshold: 34, label: "AGENT MESH", value: "SYNCED" },
  { threshold: 58, label: "CONTEXT ENGINE", value: "READY" },
  { threshold: 82, label: "GUARDRAILS", value: "ARMED" },
  { threshold: 100, label: "AXON OS", value: "LIVE" },
];

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const done = useRef(onComplete);
  const [progress, setProgress] = useState(0);
  done.current = onComplete;

  useEffect(() => {
    const counter = { value: 0 };
    let finished = false;

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
      .fromTo(
        ".preloader-letter",
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.08 },
        0,
      )
      .fromTo(
        ".preloader-top, .preloader-center-label, .loader-track, .loader-meta",
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 },
        0.18,
      )
      .fromTo(
        ".preloader-bottom-left, .preloader-bottom-right, .preloader-coordinates",
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06 },
        0.42,
      );

    const counterAnimation = animate(counter, {
      value: 100,
      delay: 140,
      duration: 2300,
      ease: "outExpo",
      onUpdate: () => setProgress(Math.round(counter.value)),
      onComplete: () => {
        if (finished) return;
        finished = true;
        const tl = gsap.timeline({
          delay: 0.4,
          onComplete: () => done.current?.(),
        });
        tl.to(".preloader-status", {
          opacity: 0,
          y: -8,
          duration: 0.35,
          ease: "power2.in",
        })
          .to(
            ".preloader-top, .preloader-center, .preloader-bottom, .preloader-frame, .preloader-coordinates",
            {
              y: -36,
              opacity: 0,
              duration: 0.55,
              ease: "power3.in",
              stagger: 0.04,
            },
            "-=0.1",
          )
          .to(
            ".preloader",
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 1,
              ease: "expo.inOut",
            },
            "-=0.25",
          );
      },
    });

    return () => {
      intro.kill();
      counterAnimation.pause();
      gsap.killTweensOf(
        ".preloader, .preloader-top, .preloader-center, .preloader-bottom, .preloader-status, .preloader-letter",
      );
    };
  }, []);

  const display = String(progress).padStart(3, "0");
  const activeStep = Math.max(
    0,
    bootSteps.findIndex((step) => progress < step.threshold),
  );
  const phase =
    progress >= 100
      ? "HANDOFF TO PRODUCTION"
      : progress >= 76
        ? "ARMING GUARDRAILS"
        : progress >= 44
          ? "SYNCHRONIZING AGENT MESH"
          : "CALIBRATING NEURAL LATTICE";

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader-grid" />
      <div className="preloader-glow" />
      <div className="preloader-scan" />

      <div className="preloader-frame" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="preloader-top">
        <div className="brand brand--loader">
          <span className="brand-mark">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M6.5 21.5 14 5l7.5 16.5h-4.1L14 13.3l-3.4 8.2H6.5Z" fill="currentColor" />
              <circle cx="21.4" cy="6.3" r="2.1" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-name">AXON</span>
        </div>
        <div className="preloader-top-right">
          <span className="mono-label">AI OPERATING SYSTEM</span>
          <span className="preloader-build mono-label"><i /> BUILD 3.0.1</span>
        </div>
      </div>

      <div className="preloader-center">
        <span className="preloader-center-label mono-label">NEURAL INTERFACE / BOOT</span>
        <div className="preloader-word">
          {"AXON".split("").map((letter, index) => (
            <span className="preloader-letter" key={`${letter}-${index}`}>
              {letter}
            </span>
          ))}
        </div>
        <div className="loader-track">
          <span
            className="loader-progress"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
          <span
            className="loader-head"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="loader-meta mono-label">
          <span>LOAD SEQUENCE / 001</span>
          <span>{progress >= 100 ? "COMPLETE" : "IN PROGRESS"}</span>
        </div>
      </div>

      <div className="preloader-bottom">
        <div className="preloader-bottom-left">
          <div className="preloader-status">
            <span className="status-pulse" />
            {phase}
          </div>

          <div className="preloader-boot">
            {bootSteps.map((step, index) => {
              const done = progress >= step.threshold;
              const active = index === activeStep && progress < 100;

              return (
                <div
                  className={`preloader-boot-row ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
                  key={step.label}
                >
                  <span className="boot-dot" />
                  <span className="boot-label">{step.label}</span>
                  <span className="boot-line" />
                  <span className="boot-value">{done ? step.value : active ? "···" : "WAIT"}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="preloader-bottom-right">
          <span className="loader-caption mono-label">
            {progress >= 100 ? "SYSTEM READY" : "AXON CORE LOAD"}
          </span>
          <div className="loader-count">
            <span>{display}</span>
            <small>%</small>
          </div>
          <div className="loader-ticks" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <i
                className={progress >= ((index + 1) / 24) * 100 ? "is-on" : ""}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="preloader-coordinates mono-label">
        <span>34.0522° N</span>
        <span>118.2437° W</span>
      </div>
    </div>
  );
}
