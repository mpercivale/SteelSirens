
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Personajes", href: "/personajes" },
  { label: "Objetos", href: "/objetos" },
  { label: "Locaciones", href: "/locaciones" },
  { label: "Crónicas", href: "/cronicas" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[oklch(0.72_0.08_65/20%)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[oklch(0.72_0.08_65/60%)] rotate-45 flex items-center justify-center group-hover:border-[oklch(0.72_0.08_65)] transition-colors">
            <div className="w-3 h-3 bg-[oklch(0.72_0.08_65)] rotate-0" />
          </div>
          <span
            className="text-sm tracking-[0.3em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            The Ashen Chronicle
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors">
            <Search size={18} />
          </button>
          <button
            className="md:hidden text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-[oklch(0.72_0.08_65/20%)]"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs tracking-[0.2em] uppercase text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors py-2 border-b border-[oklch(0.72_0.08_65/10%)]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
