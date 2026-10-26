import { useEffect, useState } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Bento from "./components/Bento";
import CommandCenter from "./components/CommandCenter";
import Metrics from "./components/Metrics";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ScrollEffects from "./components/ScrollEffects";

export default function App() {
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useSmoothScroll(ready);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove("is-loading");
      document.body.classList.remove("menu-open");
    };
  }, []);

  const finishLoading = () => {
    setShowLoader(false);
    setReady(true);
    document.documentElement.classList.remove("is-loading");
    window.scrollTo(0, 0);
  };

  return (
    <>
      {showLoader && <Preloader onComplete={finishLoading} />}
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />
      <ScrollEffects ready={ready} />
      <div className="site-noise" aria-hidden="true" />

      <main>
        <Hero ready={ready} />
        <Marquee />
        <Bento />
        <CommandCenter />
        <Metrics />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
