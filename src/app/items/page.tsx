
import { mockObjetos, mockCategorias } from "@/data/mock-data";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import ItemsExplorer from "@/components/game/ItemsExplorer";
import { getItemsCopy, resolveLanguage } from "@/lib/i18n";

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function ItemsPage({ searchParams }: Props) {
  const { lang: rawLang } = await searchParams;
  const lang = resolveLanguage(rawLang);
  const copy = getItemsCopy(lang);

  return (
    <div className="relative min-h-screen bg-[oklch(0.08_0.005_260)]" lang={lang}>
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-[0.4em] mb-3">
              {copy.pageEyebrow}
            </p>
            <h1 className="souls-title text-4xl text-[oklch(0.88_0.01_60)] tracking-widest mb-4">
              {copy.pageTitle}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
              <div className="w-2 h-2 border border-[oklch(0.72_0.08_75/60%)] rotate-45" />
              <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
            </div>
          </div>
          <ItemsExplorer items={mockObjetos} categories={mockCategorias} lang={lang} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
