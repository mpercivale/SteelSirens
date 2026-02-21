
"use client";

import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import { BestiaryGrid } from "@/components/game/BestiaryGrid";
import { getBestiarioCopy, resolveLanguage, type Language } from "@/lib/i18n";
import { useSearchParams } from "next/navigation";

export default function BestiaryPage() {
  const searchParams = useSearchParams();
  const lang = resolveLanguage(searchParams.get("lang")) as Language;
  const t = getBestiarioCopy(lang);
  
  const fontClass = lang === "ja" ? "font-noto-serif-jp" : "font-serif";

  return (
    <div lang={lang} className="min-h-screen bg-gradient-to-b from-black via-black/95 to-black/90">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className={`text-xs souls-title tracking-[0.6em] text-[oklch(0.72_0.08_75)] flex items-center justify-center gap-2 mb-4 uppercase ${fontClass}`}>
            {t.pageEyebrow}
          </p>
          <h1 className={`souls-title text-4xl sm:text-5xl md:text-6xl text-[oklch(0.88_0.01_60)] tracking-widest mb-4 ${fontClass}`}>
            {t.pageTitle}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
            <div className="w-2 h-2 border border-[oklch(0.72_0.08_75/60%)] rotate-45" />
            <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
          </div>
          <p className={`souls-text text-[oklch(0.55_0.01_60)] text-sm max-w-2xl mx-auto italic ${fontClass}`}>
            "{t.pageDescription}"
          </p>
        </div>
        <BestiaryGrid lang={lang} />
      </main>
      <Footer />
    </div>
  );
}
