"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field } from "@/components/ui/Field";
import { addressLabels } from "@/data/auth";
import { setVisitLocation } from "@/lib/location";
import { routes } from "@/lib/routes";
import { AuthButton } from "./AuthButton";
import { AuthDialog } from "./AuthDialog";
import { readDraft, withQuery, writeDraft, type OnboardingDraft } from "./flow";
import { ChoiceChips, StepCard } from "./StepCard";

type Label = (typeof addressLabels)[number];
type Fields = Required<Pick<OnboardingDraft, "house" | "area" | "landmark" | "city" | "pincode">>;
const empty: Fields = { house: "", area: "", landmark: "", city: "", pincode: "" };

/**
 * W1.12 / M1.11 · Address — step 1 done (summary), step 2 open. "Use my current location" opens the map
 * (W1.13); the pin's address comes back here pre-filled. "Save and continue" → `next` (checkout slot step).
 */
export function AddressForm({ next }: { next: string }) {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [f, setF] = useState<Fields>(empty);
  const [label, setLabel] = useState<Label>("Home");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  useEffect(() => {
    const d = readDraft();
    setSummary([d.name, d.gender].filter(Boolean).join(" · "));
    setF({ house: d.house ?? "", area: d.area ?? "", landmark: d.landmark ?? "", city: d.city ?? "", pincode: d.pincode ?? "" });
    if (d.label && (addressLabels as readonly string[]).includes(d.label)) setLabel(d.label as Label);
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = k === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value;
    setF((x) => ({ ...x, [k]: v }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!f.house.trim()) err.house = "Required";
    if (!f.area.trim()) err.area = "Required";
    if (!f.city.trim()) err.city = "Required";
    if (!/^\d{6}$/.test(f.pincode)) err.pincode = "Enter a 6-digit pincode";
    setErrors(err);
    if (Object.keys(err).length) return;
    writeDraft({ ...f, label });
    setVisitLocation({ short: f.area.trim(), full: `${f.area.trim()}, ${f.city.trim()}` });
    router.push(next);
  };

  const mapHref = withQuery(routes.visitLocation, { mode: "onboarding", locate: "1", next });

  return (
    <AuthDialog
      title="Your details"
      tight
      onClose={() => router.push(next)}
      footer={
        <div className="pt-3 md:px-4">
          <AuthButton type="submit" form="address-form" className="w-full">
            Save and continue
          </AuthButton>
        </div>
      }
    >
      <form id="address-form" onSubmit={submit} noValidate className="flex flex-col gap-3">
        <StepCard
          step={1}
          title="Personal details"
          summary={summary}
          state={summary ? "done" : "closed"}
          onToggle={() => router.push(withQuery(routes.yourDetails, { next }))}
        />
        <StepCard step={2} title="Address" state="open">
          <div className="flex flex-col gap-4">
            <Link href={mapHref} className="state flex h-[52px] items-center gap-3 rounded-lg bg-tint px-4">
              <img src="/icons/auth/gps-link-20.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
              <span className="flex-1 text-b14 font-semibold text-link">Use my current location</span>
              <img src="/icons/auth/arrow-right-link-18.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Field label="House or flat no.*" autoComplete="address-line1" placeholder="B 42" value={f.house} error={errors.house} onChange={set("house")} />
              <Field label="Area or society*" autoComplete="address-line2" placeholder="Sector 15" value={f.area} error={errors.area} onChange={set("area")} />
            </div>
            <Field label="Landmark" placeholder="Near Sector 15 metro" value={f.landmark} onChange={set("landmark")} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City*" autoComplete="address-level2" placeholder="Noida" value={f.city} error={errors.city} onChange={set("city")} />
              <Field
                label="Pincode*"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="201301"
                value={f.pincode}
                error={errors.pincode}
                onChange={set("pincode")}
              />
            </div>
            <ChoiceChips label="Save as" options={addressLabels} value={label} onChange={setLabel} />
          </div>
        </StepCard>
      </form>
    </AuthDialog>
  );
}
