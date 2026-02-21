
import { mockPersonajes, mockActualizaciones } from "@/data/mock-data";
import HeroSection from "@/components/game/HeroSection";
import LatestSection from "@/components/game/LatestSection";
import CategorySection from "@/components/game/CategorySection";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import { resolveLanguage } from "@/lib/i18n";

interface HomePageProps {
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const lang = resolveLanguage(params?.lang);

  return (
    <div lang={lang} className="relative min-h-screen bg-[oklch(0.08_0.005_260)]">
      <AshParticles />
      <Navbar lang={lang} />
      <main className="relative z-10">
        <HeroSection characters={mockPersonajes} lang={lang} />
        <LatestSection updates={mockActualizaciones} lang={lang} />
        <CategorySection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
