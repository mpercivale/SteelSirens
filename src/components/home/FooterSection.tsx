
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="relative py-16 px-4 bg-black border-t border-[oklch(0.72_0.08_65/15%)]">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-6 border border-[oklch(0.72_0.08_65/60%)] rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-[oklch(0.72_0.08_65)]" />
          </div>
          <span
            className="text-xs tracking-[0.4em] uppercase text-[oklch(0.55_0.02_60)]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            The Ashen Chronicle
          </span>
        </motion.div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Personajes", href: "/personajes" },
            { label: "Objetos", href: "/objetos" },
            { label: "Locaciones", href: "/locaciones" },
            { label: "Crónicas", href: "/cronicas" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-[oklch(0.35_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.08_65/20%)] to-transparent" />

        <p
          className="text-[oklch(0.3_0.01_60)] text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          © The Ashen Chronicle · All rights reserved
        </p>
      </div>
    </footer>
  );
}
