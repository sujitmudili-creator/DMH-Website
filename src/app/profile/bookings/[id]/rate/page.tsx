import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BookingDetails } from "@/components/booking/BookingDetails";
import { RateVisitDialog } from "@/components/booking/RateVisitDialog";
import { bookings, getBooking } from "@/data/bookings";
import { getProfessional } from "@/data/professionals";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ stars?: string }> };

export const metadata: Metadata = { title: "Rate your visit · Dr. Morepen Home" };

export function generateStaticParams() {
  return bookings.filter((b) => b.status === "past").map((b) => ({ id: b.id }));
}

/** W18.03–W18.10 · M18.03–M18.10: Rate your visit pop up over the booking page. `?stars=1–5` preselects. */
export default async function RateVisitPage({ params, searchParams }: Props) {
  const booking = getBooking((await params).id);
  if (!booking) notFound();
  if (booking.status !== "past" || !booking.professional) redirect(routes.booking(booking.id));

  const n = Number((await searchParams).stars);
  const stars = Number.isInteger(n) && n >= 1 && n <= 5 ? n : 0;
  const pro = booking.professional;
  const firstName = getProfessional(pro.id)?.firstName ?? pro.name.split(" ")[0];

  return (
    <BookingDetails
      booking={booking}
      overlay={
        <RateVisitDialog
          bookingId={booking.id}
          professionalName={pro.name}
          professionalFirstName={firstName}
          serviceName={booking.service}
          initialStars={stars}
        />
      }
    />
  );
}
