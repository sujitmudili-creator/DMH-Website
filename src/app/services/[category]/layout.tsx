import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { PageShell } from "@/components/site/PageShell";
import { CategoryView } from "@/components/services/CategoryView";
import { ShareButton } from "@/components/services/ShareButton";
import { categories, getCategory } from "@/data/services";
import { routes } from "@/lib/routes";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).category);
  return { title: `${category?.name ?? "Services"} · Dr. Morepen Home` };
}

/**
 * W1.02 / W1.03 / M1.03 category listing. It lives in the layout so the service detail pop up
 * (/services/[category]/[slug], W1.04–W1.07) opens over it, and its loading skeleton (W20.03) too.
 */
export default async function CategoryLayout({ params, children }: Params & { children: ReactNode }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return (
    <PageShell
      title={category.name}
      backHref={routes.home}
      appBarActions={
        <>
          <AppBarIconLink href={routes.search} icon="/icons/icon-search-dark.svg" label="Search" />
          <ShareButton title={category.name} icon="/icons/icon-share.svg" iconClass="size-5" />
        </>
      }
    >
      <CategoryView category={category} />
      {children}
    </PageShell>
  );
}
