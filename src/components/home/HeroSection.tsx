
"use client";

import { motion } from "framer-motion";
import AshParticles from "./AshParticles";
import CharacterCircle from "./CharacterCircle";
import type { Personaje } from "@/types/game";

interface Props {
  personajes: Personaje[];
}

export default function HeroSection({ personajes }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden stone-bg">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[oklch(0.06_0.005_270)] to-[oklch(0.06_0.005_270)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
        }}
      />

      {/* God rays */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-96 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, oklch(0.72 0.08 65 / 30%), transparent)",
          filter: "blur(40px)",
          width: 200,
        }}
      />

      <AshParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-28 px-4 flex flex-col items-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-2"
        >
          <p
            className="text-[oklch(0.72_0.08_65)] text-xs tracking-[0.5em] uppercase mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Explora el Universo
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl tracking-[0.1em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            The Ashen
            <br />
            <span className="text-[oklch(0.72_0.08_65)]">Chronicle</span>
          </h1>
        </motion.div>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="ornament-divider w-64 my-6"
        >
          <span className="text-[oklch(0.72_0.08_65)] text-lg">✦</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-[oklch(0.55_0.02_60)] text-sm tracking-[0.15em] uppercase text-center mb-12"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Personajes
        </motion.p>

        {/* Character Circle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full"
        >
          <CharacterCircle personajes={personajes} />
        </motion.div>
      </div>
    </section>
  );
}
