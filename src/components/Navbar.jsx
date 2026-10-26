import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
import Magnetic from "./Magnetic";
import { scrollToSection } from "../hooks/useSmoothScroll";

const links = [
  { label: "Product", href: "#features" },
  { label: "Platform", href: "#platform" },
  { label: "Customers", href: "#customers" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar({ ready }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      document.body.classList.add("menu-open");
    } else {
      window.__lenis?.start();
      document.body.classList.remove("menu-open");
    }
    return () => {
      window.__lenis?.start();
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const go = (event, href) => {
    event.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? "is-scrolled" : ""}`}
        initial={{ y: -28, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -28, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className="navbar-inner container-wide">
          <Brand />

          <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={active === link.href ? "is-active" : ""}
                onClick={(event) => go(event, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a
              href="#login"
              className="nav-signin"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#cta");
              }}
            >
              Sign in
            </a>
            <Magnetic strength={0.18}>
              <a
                href="#cta"
                className="button button--small button--lime"
                onClick={(event) => go(event, "#cta")}
              >
                <span>Get started</span>
                <ArrowUpRight size={15} strokeWidth={2} />
              </a>
            </Magnetic>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-menu-glow" />
            <div className="mobile-menu-top">
              <Brand onClick={() => setOpen(false)} />
              <button
                type="button"
                className="menu-close"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-links" aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => go(event, link.href)}
                  initial={{ y: 42, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.16 + index * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mobile-link-index">0{index + 1}</span>
                  {link.label}
                  <ArrowUpRight size={24} />
                </motion.a>
              ))}
            </nav>

            <div className="mobile-menu-footer">
              <motion.a
                href="#cta"
                className="button button--lime button--wide"
                onClick={(event) => go(event, "#cta")}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.5 }}
              >
                Start building free
                <ArrowUpRight size={17} />
              </motion.a>
              <div className="mobile-socials mono-label">
                <span>X / TWITTER</span>
                <span>LINKEDIN</span>
                <span>GITHUB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
