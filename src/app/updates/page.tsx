
import { mockActualizaciones } from "@/data/mock-data";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import UpdatesList from "@/components/game/UpdatesList";
import { resolveLanguage, type Language } from "@/lib/i18n";

interface Props {
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export default async function UpdatesPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = resolveLanguage(params?.lang) as Language;

  return (
    <div lang={lang} className="relative min-h-screen bg-[oklch(0.08_0.005_260)]">
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-[0.4em] mb-3">
              ✦ The Living Chronicle ✦
            </p>
            <h1 className="souls-title text-4xl text-[oklch(0.88_0.01_60)] tracking-widest mb-4">
              Updates
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
              <div className="w-2 h-2 border border-[oklch(0.72_0.08_75/60%)] rotate-45" />
              <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
            </div>
          </div>
          <UpdatesList updates={mockActualizaciones} lang={lang} />
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
