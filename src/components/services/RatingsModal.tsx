"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { getService, ratingFor, reviewsFor } from "@/data/services";
import { Reviews } from "./Reviews";

/** Ratings pop up (W7.02), opened from a card's rating link: `?reviews=<slug>` on the category page. */
export function RatingsModal({ category }: { category: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params.get("reviews");
  const service = slug ? getService(category, slug) : undefined;

  return (
    <Modal open={!!service} onClose={() => router.replace(pathname, { scroll: false })} title={service?.name ?? ""} width={480}>
      {service && (
        <div className="p-4">
          <Reviews summary={ratingFor(service)} reviews={reviewsFor(service)} />
        </div>
      )}
    </Modal>
  );
}
