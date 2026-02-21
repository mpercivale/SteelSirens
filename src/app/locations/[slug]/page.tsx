
import { mockLocaciones } from "@/data/mock-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import LocationDetail from "@/components/game/LocationDetail";
import { resolveLanguage, type Language } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function LocationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang = resolveLanguage(rawLang) as Language;
  const location = mockLocaciones.find((l) => l.slug === slug);
  if (!location) notFound();

  return (
    <div lang={lang} className="relative min-h-screen bg-[oklch(0.08_0.005_260)]">
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-16">
        <LocationDetail location={location} lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export async function generateStaticParams() {
  return mockLocaciones.map((l) => ({ slug: l.slug }));
}
