
import { mockObjetos, mockPersonajes } from "@/data/mock-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import { CharacterDetail } from "@/components/game/CharacterDetail";
import { resolveLanguage } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function CharacterPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang = resolveLanguage(rawLang);
  
  const personaje = mockPersonajes.find((c) => c.slug === slug);
  if (!personaje) notFound();

  // Map Personaje back to Character shape for CharacterDetail
  const character = {
    id: personaje.id,
    name: personaje.nombre ?? personaje.name,
    title: personaje.titulo ?? personaje.title,
    slug: personaje.slug,
    lore: personaje.lore,
    shortDescription: personaje.descripcion_corta ?? personaje.shortDescription,
    imagePngUrl: personaje.imagen_png_url ?? personaje.imagePngUrl,
    model3dUrl: personaje.model3dUrl,
    class: personaje.clase ?? personaje.class,
    origin: personaje.origin,
    status: personaje.status,
    isProtagonist: personaje.es_protagonista ?? personaje.isProtagonist,
    stats: personaje.stats,
    abilities: personaje.abilities,
    relationships: personaje.relationships,
    artGallery: personaje.artGallery,
      dialogueAudios: personaje.dialogueAudios ?? personaje.audios_dialogo,
  };

  return (
    <div className="relative min-h-screen bg-[oklch(0.08_0.005_260)]" lang={lang}>
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-16">
        <CharacterDetail character={character} personaje={personaje} itemsCatalog={mockObjetos} lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return mockPersonajes.map((c) => ({ slug: c.slug }));
}
