
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sword } from "lucide-react";
import { getHomeCopy, resolveLanguage, type Language } from "@/lib/i18n";

interface FooterProps {
  lang?: Language;
}

export default function Footer({ lang }: FooterProps) {
  const searchParams = useSearchParams();
  const activeLang = resolveLanguage(lang ?? searchParams.get("lang"));
  const t = getHomeCopy(activeLang);
  const currentYear = new Date().getFullYear();

  const withLang = (href: string) => {
    const [path, queryString] = href.split("?");
    const params = new URLSearchParams(queryString ?? "");
    params.set("lang", activeLang);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  return (
    <footer className="border-t border-[oklch(0.72_0.08_75/15%)] mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-[oklch(0.72_0.08_75/40%)] flex items-center justify-center">
              <Sword className="w-3 h-3 text-[oklch(0.72_0.08_75)]" />
            </div>
            <span className="souls-title text-xs tracking-widest text-[oklch(0.72_0.08_75)]">
              {t.hero.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-[oklch(0.72_0.08_75/20%)]" />
            <div className="w-1.5 h-1.5 border border-[oklch(0.72_0.08_75/40%)] rotate-45" />
            <div className="w-12 h-px bg-[oklch(0.72_0.08_75/20%)]" />
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { href: "/characters", label: t.footer.links.characters },
              { href: "/bestiary", label: t.footer.links.bestiary },
              { href: "/items", label: t.footer.links.items },
              { href: "/locations", label: t.footer.links.locations },
              { href: "/updates", label: t.footer.links.updates },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={withLang(href)}
                className="text-xs souls-title tracking-widest text-[oklch(0.45_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="text-center space-y-2 max-w-2xl">
            <p className="text-xs souls-text text-[oklch(0.35_0.01_60)]">
              {t.footer.line1}
            </p>
            <p className="text-xs souls-text text-[oklch(0.35_0.01_60)]">
              © {currentYear} {t.hero.title}. {t.footer.line2}
            </p>
            <p className="text-xs souls-text text-[oklch(0.45_0.01_60)] font-medium">
              {t.footer.line3}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
