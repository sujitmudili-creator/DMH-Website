import { BookingDetailsSkeleton } from "@/components/booking/BookingDetailsSkeleton";

/** W20.07 / M20.07: shown while a booking (or its rate pop up) loads. */
export default function Loading() {
  return <BookingDetailsSkeleton />;
}
