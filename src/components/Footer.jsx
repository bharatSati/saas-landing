import { ArrowUp, ArrowUpRight, Github, Globe, Linkedin, Twitter } from "lucide-react";
import Brand from "./Brand";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import { scrollToSection } from "../hooks/useSmoothScroll";

const columns = [
  {
    title: "PLATFORM",
    links: [
      { label: "Agents", href: "#features" },
      { label: "Workflows", href: "#platform" },
      { label: "Integrations", href: "#features" },
      { label: "Security", href: "#features" },
      { label: "Changelog", href: "#home" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "#home" },
      { label: "Careers", href: "#home" },
      { label: "Customers", href: "#customers" },
      { label: "Press", href: "#home" },
      { label: "Contact", href: "#cta" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Documentation", href: "#platform" },
      { label: "API reference", href: "#platform" },
      { label: "Guides", href: "#features" },
      { label: "Community", href: "#customers" },
      { label: "System status", href: "#home" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy", href: "#home" },
      { label: "Terms", href: "#home" },
      { label: "DPA", href: "#home" },
      { label: "Security", href: "#home" },
    ],
  },
];

const socials = [
  { icon: Twitter, label: "X / Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Globe, label: "Website" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid-bg" />
      <div className="container">
        <div className="footer-top">
          <Reveal className="footer-brand" delay={0.02}>
            <Brand />
            <p>
              The operating system for what&apos;s next.
              <br />
              Built for the teams building tomorrow.
            </p>
            <a href="#cta" className="hiring-pill" onClick={(e) => { e.preventDefault(); scrollToSection("#cta"); }}>
              <span className="status-pulse" />
              WE&apos;RE HIRING — 6 OPEN ROLES
              <ArrowUpRight size={13} />
            </a>
            <div className="footer-socials">
              {socials.map(({ icon: Icon, label }) => (
                <a href="#home" key={label} aria-label={label} onClick={(e) => e.preventDefault()}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </Reveal>

          <div className="footer-columns">
            {columns.map((column, index) => (
              <Reveal className="footer-column" key={column.title} delay={0.04 + index * 0.04}>
                <span className="mono-label">{column.title}</span>
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="footer-status" delay={0.05}>
          <span className="footer-status-left">
            <span className="status-pulse" />
            ALL SYSTEMS OPERATIONAL
          </span>
          <span className="footer-status-center mono-label">
            SAN FRANCISCO · LONDON · TOKYO · REMOTE
          </span>
          <span className="footer-status-right mono-label">
            LAT 34.0522° N · LON 118.2437° W
          </span>
        </Reveal>

        <div className="footer-wordmark-wrap">
          <div className="footer-wordmark" aria-hidden="true">AXON</div>
          <div className="footer-wordmark-glow" />
        </div>

        <div className="footer-bottom">
          <span>© 2026 Axon Labs, Inc. All rights reserved.</span>
          <span className="footer-crafted mono-label">
            CRAFTED WITH THREE.JS · GSAP · RIVE · LENIS · MOTION
          </span>
          <Magnetic strength={0.24}>
            <button
              type="button"
              className="back-to-top"
              onClick={() => scrollToSection("#home")}
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
