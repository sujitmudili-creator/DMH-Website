import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Profile · Dr. Morepen Home" };

// W10.01 / W11.01 Profile menu (desktop dropdown in the nav) · M10.01 / M11.01 Profile (full page).
export default function ProfilePage() {
  return (
    <PageShell title="Profile" appBar={null}>
      <ProfileView />
    </PageShell>
  );
}
