import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollEffects({ ready }) {
  useEffect(() => {
    if (!ready) return;

    const context = gsap.context(() => {
      gsap.to(".hero-visual", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".hero-copy", {
        yPercent: 7,
        opacity: 0.72,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".metrics-orb", {
        yPercent: 22,
        rotate: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".metrics-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.fromTo(
        ".footer-wordmark",
        { yPercent: 38, opacity: 0.3 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      gsap.to(".cta-orbit--one", {
        rotate: 55,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".cta-orbit--two", {
        rotate: -60,
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".cta-glow", {
        scale: 1.28,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top bottom",
          end: "center center",
          scrub: 1.5,
        },
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timeout = window.setTimeout(refresh, 600);

    return () => {
      context.revert();
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
    };
  }, [ready]);

  return null;
}
