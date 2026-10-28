import type { Metadata } from "next";
import { PersonalDetailsForm } from "@/components/profile/PersonalDetailsForm";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Your details · Dr. Morepen Home" };

// W11.02 / M11.02 Personal details · W11.03 / M11.03 Saved (toast).
export default function PersonalDetailsPage() {
  return (
    <PageShell title="Your details" backHref={routes.profile}>
      <ProfileColumn title="Your details" backHref={routes.profile}>
        <PersonalDetailsForm />
      </ProfileColumn>
    </PageShell>
  );
}
