
import { mockActualizaciones } from "@/data/mock-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import UpdateDetail from "@/components/game/UpdateDetail";
import { resolveLanguage, type Language } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function UpdatePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang = resolveLanguage(rawLang) as Language;
  const update = mockActualizaciones.find((u) => u.slug === slug);
  if (!update) notFound();

  return (
    <div lang={lang} className="relative min-h-screen bg-[oklch(0.08_0.005_260)]">
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-16">
        <UpdateDetail update={update} lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export async function generateStaticParams() {
  return mockActualizaciones.map((u) => ({ slug: u.slug }));
}
