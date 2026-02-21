
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Map, Bell, Scroll, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHomeCopy, resolveLanguage, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";

// Custom SVG Icons
const HelmetIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3C8 3 5 6 5 10v4c0 1 0 2 1 3h12c1-1 1-2 1-3v-4c0-4-3-7-7-7z" />
    <path d="M5 14v3c0 1.5 1 2 2 2h10c1 0 2-.5 2-2v-3" />
    <path d="M9 17v4" />
    <path d="M15 17v4" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const PotionIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="14" r="7" />
    <path d="M8 7h8" />
    <path d="M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
    <path d="M9 11c0 1 1 2 3 2s3-1 3-2" />
  </svg>
);

const navItems = [
  { key: "home", href: "/", icon: Scroll },
  { key: "characters", href: "/characters", icon: HelmetIcon },
  { key: "bestiary", href: "/bestiary", icon: Skull },
  { key: "items", href: "/items", icon: PotionIcon },
  { key: "locations", href: "/locations", icon: Map },
  { key: "updates", href: "/updates", icon: Bell },
] as const;

const languageCodes: Record<Language, string> = {
  en: "EN",
  es: "ES",
  ja: "JP",
};

interface NavbarProps {
  lang?: Language;
}

export function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLang = resolveLanguage(lang ?? searchParams.get("lang"));
  const t = getHomeCopy(activeLang);

  const withLang = (href: string) => {
    const [path, queryString] = href.split("?");
    const params = new URLSearchParams(queryString ?? "");
    params.set("lang", activeLang);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  const buildLanguageHref = (nextLang: Language) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    const query = params.toString();
    const currentPath = pathname || "/";
    return query ? `${currentPath}?${query}` : currentPath;
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={withLang("/")} className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gold-dim/20 rounded-full flex items-center justify-center border border-gold-dim/40"
            >
              <Scroll className="w-4 h-4 text-gold-dim" />
            </motion.div>
            <span className="text-xl font-bold text-gold-dim font-serif group-hover:text-gold transition-colors">
              {t.navbar.brand}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link key={item.key} href={withLang(item.href)}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg font-serif text-sm transition-all border",
                      isActive
                        ? "bg-gold-dim text-black border-gold-dim"
                        : "text-muted-foreground hover:text-gold hover:bg-gold/5 border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.navbar.nav[item.key]}</span>
                  </motion.div>
                </Link>
              );
            })}

            <div className="ml-3 pl-3 border-l border-gold-dim/20 flex items-center gap-1">
              {SUPPORTED_LANGUAGES.map((code) => (
                <Link
                  key={code}
                  href={buildLanguageHref(code)}
                  className={cn(
                    "px-2 py-1 text-[10px] font-semibold tracking-widest border transition-colors",
                    code === activeLang
                      ? "text-black bg-gold-dim border-gold-dim"
                      : "text-gold-dim border-gold-dim/30 hover:border-gold-dim/60"
                  )}
                  aria-label={`${t.navbar.languageLabel}: ${code}`}
                >
                  {languageCodes[code]}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gold-dim hover:text-gold transition-colors" aria-label={t.navbar.languageLabel}>
              <Scroll className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
