import { Suspense } from "react";
import { TalkToUs } from "@/components/home/TalkToUs";
import { ButtonLink } from "@/components/ui/Button";
import { groupAnchor, servicesIn, type Category } from "@/data/services";
import { routes } from "@/lib/routes";
import { CategoryBanner } from "./CategoryBanner";
import { CategorySidebar, CategoryTiles } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";
import { RatingsModal } from "./RatingsModal";
import { ServiceCard } from "./ServiceCard";
import { ServiceListing } from "./ServiceListing";

/** Sidebar "Not sure what you need?" card (W1.02 "Talk to us"). */
function SidebarTalkToUs() {
  return (
    <div className="relative h-[207px] overflow-hidden rounded-xl bg-tint p-6">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-h20 font-semibold">Not sure what you need?</h2>
        <ButtonLink href={routes.careTeam} className="h-11 w-[196px] rounded-[10px]">
          Talk to our care team
        </ButtonLink>
      </div>
      <img src="/img/services/talk-small.png" alt="" className="absolute top-[118px] left-[51px] h-[124px] w-[217px] object-cover" />
    </div>
  );
}

function Groups({ category }: { category: Category }) {
  return (
    <div className="flex flex-col gap-8">
      {category.groups.map((g) => {
        const list = servicesIn(category.slug, g.id);
        if (!list.length) return null;
        return (
          <section key={g.id} id={groupAnchor(g.id)} className="flex scroll-mt-6 flex-col gap-4">
            <h2 className="font-display text-h20 font-semibold">{g.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 md:items-start md:group-data-[view=list]/listing:grid-cols-1">
              {list.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Category listing (W1.02 grid, W1.03 list, M1.03) with the ratings pop up (W7.02) and mobile menu (M7.02). */
export function CategoryView({ category }: { category: Category }) {
  const all = servicesIn(category.slug);
  const lite = all.map(({ slug, name, image, group }) => ({ slug, name, image, group }));
  return (
    <>
      <div className="flex flex-col gap-8 pt-2 pb-28 md:page md:flex-row md:gap-6 md:pt-8 md:pb-16">
        <aside className="hidden w-[320px] shrink-0 flex-col gap-6 self-start md:sticky md:top-8 md:flex">
          <CategorySidebar category={category} services={lite} />
          <SidebarTalkToUs />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <CategoryBanner />
          <CategoryTiles category={category} />
          <div className="px-4 md:px-0">
            <ServiceListing count={all.length}>
              <Groups category={category} />
            </ServiceListing>
          </div>
          <div className="md:hidden">
            <TalkToUs />
          </div>
        </div>
      </div>
      <MobileMenu category={category} services={lite} />
      <Suspense>
        <RatingsModal category={category.slug} />
      </Suspense>
    </>
  );
}
