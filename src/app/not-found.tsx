import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState, errorActionClass } from "@/components/errors/ErrorState";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Page not found · Dr. Morepen Home" };

/** W15.03 / M15.03 Page not found. */
export default function NotFound() {
  return (
    <ErrorState
      kind="notFound"
      action={
        <Link href={routes.home} className={errorActionClass}>
          Go to home
        </Link>
      }
    />
  );
}
