
import { mockObjetos, mockCategorias } from "@/data/mock-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import AshParticles from "@/components/game/AshParticles";
import ItemDetail from "@/components/game/ItemDetail";
import { resolveLanguage } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function ItemPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang = resolveLanguage(rawLang);
  
  const item = mockObjetos.find((o) => o.slug === slug);
  if (!item) notFound();

  const category = mockCategorias.find((c) => c.id === (item.categoria_id ?? item.categoryId));
  const subcategoryId = item.subcategoria_id ?? item.subcategoryId;
  const subcategory = subcategoryId
    ? mockCategorias.find((c) => c.id === subcategoryId)
    : undefined;

  return (
    <div className="relative min-h-screen bg-[oklch(0.08_0.005_260)]" lang={lang}>
      <AshParticles />
      <Navbar />
      <main className="relative z-10 pt-16">
        <ItemDetail item={item} category={category} subcategory={subcategory} lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return mockObjetos.map((o) => ({ slug: o.slug }));
}
