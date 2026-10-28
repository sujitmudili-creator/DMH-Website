import type { Metadata } from "next";
import { HelpView } from "@/components/profile/HelpView";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Help and support · Dr. Morepen Home" };

// W14.02 / M14.02 Help and support.
export default function HelpPage() {
  return (
    <PageShell title="Help and support" backHref={routes.profile}>
      <ProfileColumn title="Help and support" backHref={routes.profile}>
        <HelpView />
      </ProfileColumn>
    </PageShell>
  );
}
