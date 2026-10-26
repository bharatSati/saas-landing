import { motion } from "motion/react";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "Axon replaced four tools and an entire ops playbook. We shipped our Q3 roadmap in six weeks — with a team of five.",
    name: "Maya Chen",
    role: "COO, Helios",
    initials: "MC",
    gradient: "linear-gradient(135deg, #c8ff3d, #527a00)",
    featured: true,
    metric: "6 weeks",
    metricLabel: "to ship Q3",
  },
  {
    quote:
      "It feels less like software and more like hiring a senior team that never sleeps. The agents just handle it.",
    name: "Jonas Meyer",
    role: "Head of Growth, Vertex",
    initials: "JM",
    gradient: "linear-gradient(135deg, #a3b1ff, #393f8d)",
  },
  {
    quote:
      "The first AI product our entire company actually uses every day. Legal, ops, growth — everyone lives in it.",
    name: "Priya Nadar",
    role: "VP Product, Northwind",
    initials: "PN",
    gradient: "linear-gradient(135deg, #ffb28f, #8b3e1d)",
  },
];

function TestimonialCard({ item, index }) {
  return (
    <motion.article
      className={`testimonial-card ${item.featured ? "testimonial-card--featured" : ""}`}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="testimonial-top">
        <span className="quote-icon">
          <Quote size={17} fill="currentColor" strokeWidth={0} />
        </span>
        <div className="testimonial-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
      </div>

      <blockquote>
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      {item.featured && (
        <div className="testimonial-metric">
          <span className="mono-label">RESULT</span>
          <strong>{item.metric}</strong>
          <span>{item.metricLabel}</span>
          <span className="metric-line" />
        </div>
      )}

      <div className="testimonial-author">
        <span className="testimonial-avatar" style={{ background: item.gradient }}>
          {item.initials}
        </span>
        <div>
          <strong>{item.name}</strong>
          <span>{item.role}</span>
        </div>
        <span className="testimonial-arrow"><ArrowUpRight size={16} /></span>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  return (
    <section className="section testimonials-section" id="customers">
      <div className="container">
        <SectionHeading
          eyebrow="CUSTOMERS"
          index="04"
          title={
            <>
              Don&apos;t take our word for it.
              <br />
              <em>Take theirs.</em>
            </>
          }
          description="A new class of operators is building on Axon. Here's what happens when ambition meets infrastructure."
        />

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <TestimonialCard item={item} index={index} key={item.name} />
          ))}
        </div>

        <Reveal className="testimonials-footer" delay={0.1}>
          <span className="mono-label"><span className="status-pulse" /> 4.9 / 5 AVERAGE ACROSS 2,400+ REVIEWS</span>
          <div className="testimonial-mini-avatars">
            {["A", "K", "R", "M", "S"].map((letter, index) => (
              <span key={letter} style={{ zIndex: 5 - index }}>{letter}</span>
            ))}
            <em>+12k</em>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
