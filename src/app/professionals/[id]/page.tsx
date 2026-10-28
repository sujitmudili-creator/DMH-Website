import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfessionalProfile } from "@/components/professional/ProfessionalProfile";
import { getBooking } from "@/data/bookings";
import { getProfessional, professionals } from "@/data/professionals";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> };

export function generateStaticParams() {
  return professionals.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pro = getProfessional((await params).id);
  return { title: pro ? `${pro.name} · Dr. Morepen Home` : "Professional not found" };
}

/** W19.02 / M19.02 Professional profile. `?from=<booking id>` sends Back to that booking (W18.02). */
export default async function ProfessionalPage({ params, searchParams }: Props) {
  const pro = getProfessional((await params).id);
  if (!pro) notFound();
  const from = (await searchParams).from;
  const backHref = from && getBooking(from) ? routes.booking(from) : routes.bookings;
  return <ProfessionalProfile pro={pro} backHref={backHref} />;
}
