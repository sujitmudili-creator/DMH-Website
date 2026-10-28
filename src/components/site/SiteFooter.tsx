import Link from "next/link";
import { external, routes } from "@/lib/routes";
import { Logo } from "./Logo";
import { PartnerLogos } from "./PartnerLogos";

const services: { label: string; href?: string; external?: boolean }[][] = [
  [{ label: "Doctor" }, { label: "Nurse", href: routes.category("nurse") }, { label: "Lab test", href: routes.labTest }],
  [{ label: "Wellness IV" }, { label: "Vaccination" }, { label: "Health plan", href: external.healthPlan, external: true }],
];

const help: { label: string; href?: string; external?: boolean }[] = [
  { label: "Talk to our care team", href: routes.careTeam },
  { label: "FAQs" },
  { label: "Terms and conditions", href: external.terms, external: true },
  { label: "Privacy policy", href: external.privacy, external: true },
];

function FooterLink({ label, href, external: isExternal }: { label: string; href?: string; external?: boolean }) {
  const cls = "text-b14 text-ink-2";
  if (!href) return <span className={cls}>{label}</span>;
  if (isExternal)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:text-ink`}>
        {label}
      </a>
    );
  return (
    <Link href={href} className={`${cls} hover:text-ink`}>
      {label}
    </Link>
  );
}

/** Footer (W1.01 "Footer"). Mobile drops the partner row and the bottom-right links. */
export function SiteFooter() {
  return (
    <footer className="bg-muted">
      <div className="page flex flex-col gap-6 pt-8 pb-6 md:gap-10 md:pt-16 md:pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:gap-16">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Logo />
              <p className="text-b14 text-ink-2">Care at home, from people you can trust.</p>
            </div>
            <div className="hidden flex-col gap-3 md:flex">
              <p className="text-b12 text-ink-2">Your professionals are from</p>
              <PartnerLogos height={28} className="gap-6" />
            </div>
          </div>
          <div className="flex justify-between gap-8 md:contents">
            <div className="flex flex-col gap-3">
              <p className="text-b14 font-semibold">Services</p>
              <div className="flex gap-12">
                {services.map((col, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    {col.map((l) => (
                      <FooterLink key={l.label} {...l} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-b14 font-semibold">Help</p>
              {help.map((l) => (
                <FooterLink key={l.label} {...l} />
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-line" />
        <div className="flex justify-between text-b12 text-ink-2">
          <p>© 2026 Dr. Morepen Home</p>
          <p className="hidden gap-2 md:flex">
            <a href={external.terms} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Terms and conditions
            </a>
            ·
            <a href={external.privacy} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Privacy policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
