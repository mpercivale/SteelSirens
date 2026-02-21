import { Navbar } from "@/components/game/Navbar";
import Footer from "@/components/game/Footer";
import { BeastDetail } from "@/components/game/BeastDetail";
import { mockBeasts } from "@/data/mock-data";
import { notFound } from "next/navigation";
import { resolveLanguage, type Language } from "@/lib/i18n";

interface BeastPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default async function BeastPage({ params, searchParams }: BeastPageProps) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;
  const lang = resolveLanguage(langParam) as Language;
  const beast = mockBeasts.find((b) => b.slug === slug);

  if (!beast) {
    notFound();
  }

  return (
    <div lang={lang} className="min-h-screen overflow-x-hidden">
      <Navbar />
      <BeastDetail beast={beast} lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return mockBeasts.map((b) => ({ slug: b.slug }));
}
