import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getService, services } from "@/data/services";

type Params = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ category: s.category, slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, slug } = await params;
  const service = getService(category, slug);
  return { title: `${service?.name ?? "Service"} · Dr. Morepen Home`, description: service?.description };
}

// W1.04 Service detail · W1.05 Add on selected · W1.06 Pop up · W1.07 How it works open (M1.04–M1.06).
export default async function ServicePage({ params }: Params) {
  const { category, slug } = await params;
  const service = getService(category, slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
