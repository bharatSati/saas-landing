import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(ready) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;

    if (ready) {
      lenis.start();
      document.documentElement.classList.remove("is-loading");
    } else {
      lenis.stop();
      document.documentElement.classList.add("is-loading");
    }
  }, [ready]);
}

export function scrollToSection(id) {
  const target = typeof id === "string" ? document.querySelector(id) : id;
  if (!target) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -90, duration: 1.5 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
