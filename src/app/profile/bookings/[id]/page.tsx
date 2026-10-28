import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingDetails } from "@/components/booking/BookingDetails";
import { bookings, getBooking } from "@/data/bookings";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return bookings.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const booking = getBooking((await params).id);
  return { title: booking ? `Booking ${booking.id.replace("-", " ")} · Dr. Morepen Home` : "Booking not found" };
}

/** W17.02–W17.07, W18.02, W18.07, W18.11 · M17.x, M18.x: Booking details, driven by the booking's status. */
export default async function BookingPage({ params }: Props) {
  const booking = getBooking((await params).id);
  if (!booking) notFound();
  return <BookingDetails booking={booking} />;
}
