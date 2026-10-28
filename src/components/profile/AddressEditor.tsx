"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChoiceChips } from "@/components/auth/StepCard";
import { readDraft, withQuery } from "@/components/auth/flow";
import { Field } from "@/components/ui/Field";
import { addressLabels, type AddressLabel, type SavedAddress } from "@/data/addresses";
import { routes } from "@/lib/routes";
import { saveAddress, useAddresses } from "./addressStore";
import { useProfileSession } from "./useProfileSession";

type Form = Omit<SavedAddress, "id" | "lastBooked">;
type Errors = Partial<Record<keyof Form, string>>;

const blank: Form = {
  contact: "myself",
  label: "Home",
  name: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  pincode: "",
  receiverName: "",
  receiverPhone: "",
};

/** "+91 98765 43210" / "9876543210" → 10 digits. */
const phoneDigits = (s: string) => s.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").slice(0, 10);
const showPhone = (d: string) => (d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : d);

function Radio({ checked, label, onSelect }: { checked: boolean; label: string; onSelect: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="radio" name="contact" checked={checked} onChange={onSelect} className="peer sr-only" />
      {checked ? (
        <img src="/icons/profile/radio-on-20.svg" alt="" className="size-5" />
      ) : (
        <span className="size-5 rounded-full border border-field bg-card" />
      )}
      <span className="text-b16 font-medium peer-focus-visible:underline">{label}</span>
    </label>
  );
}

/**
 * Add address (W13.06 Myself, W13.07 Other, W13.08 Someone else) and Edit address (W13.04).
 * Contact details: Myself fills the receiver from the account; Someone else asks for their name and number and
 * swaps the label chips for a free "Save address as (optional)" name.
 */
export function AddressEditor({ id }: { id?: string }) {
  const router = useRouter();
  const { user } = useProfileSession();
  const addresses = useAddresses();
  const existing = id ? addresses.find((a) => a.id === id) : undefined;
  const [f, setF] = useState<Form>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);

  // Fill once: the saved address when editing; otherwise the map pin's address (if any) and the account holder.
  useEffect(() => {
    if (ready) return;
    if (id) {
      if (!existing) return;
      setF({ ...blank, ...existing, receiverPhone: phoneDigits(existing.receiverPhone) });
    } else {
      const d = readDraft();
      setF((x) => ({ ...x, house: d.house ?? "", area: d.area ?? "", landmark: d.landmark ?? "", city: d.city ?? "", pincode: d.pincode ?? "" }));
    }
    setReady(true);
  }, [id, existing, ready]);

  const me = { name: user?.name ?? "", phone: phoneDigits(user?.phone ?? "") };
  const someone = f.contact === "someone";
  // Myself shows the account holder (editable); Someone else starts empty.
  const receiverName = someone ? f.receiverName : f.receiverName || me.name;
  const receiverPhone = someone ? f.receiverPhone : f.receiverPhone || me.phone;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === "pincode") v = v.replace(/\D/g, "").slice(0, 6);
    if (k === "receiverPhone") v = phoneDigits(v);
    setF((x) => ({ ...x, [k]: v }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const setContact = (contact: Form["contact"]) => {
    setF((x) => ({ ...x, contact, receiverName: "", receiverPhone: "", name: contact === x.contact ? x.name : "" }));
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!f.house.trim()) err.house = "Enter your house or flat number";
    if (!f.area.trim()) err.area = "Enter your area or society";
    if (!f.city.trim()) err.city = "Enter your city";
    if (!/^\d{6}$/.test(f.pincode)) err.pincode = "Enter a 6-digit pincode";
    if (!receiverName.trim()) err.receiverName = "Enter the receiver's name";
    if (!/^[6-9]\d{9}$/.test(receiverPhone)) err.receiverPhone = "Enter a 10-digit mobile number";
    if (!someone && f.label === "Other" && !f.name.trim()) err.name = "Give this address a name";
    setErrors(err);
    if (Object.keys(err).length) return;
    saveAddress({
      ...f,
      id,
      name: someone || f.label === "Other" ? f.name.trim() : "",
      receiverName: receiverName.trim(),
      receiverPhone: showPhone(receiverPhone),
      ...(existing?.lastBooked ? { lastBooked: existing.lastBooked } : {}),
    });
    router.push(routes.addresses);
  };

  if (id && ready === false && !existing) {
    return <p className="text-b14 text-ink-2">This address could not be found.</p>;
  }

  const here = id ? routes.editAddress(id) : routes.addAddress;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Link
            href={withQuery(routes.visitLocation, { mode: "onboarding", next: here })}
            className="state flex h-[52px] items-center gap-2 rounded-lg bg-tint px-4"
          >
            <img src="/icons/auth/gps-link-20.svg" alt="" className="size-5 shrink-0" />
            <span className="flex-1 text-b14 font-semibold text-link">Use my current location</span>
            <img src="/icons/auth/arrow-right-link-18.svg" alt="" className="size-[18px] shrink-0" />
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Field label="House or flat no.*" autoComplete="address-line1" placeholder="Flat no." value={f.house} error={errors.house} onChange={set("house")} />
            <Field label="Area or society*" autoComplete="address-line2" placeholder="Area" value={f.area} error={errors.area} onChange={set("area")} />
          </div>
          <Field label="Landmark" placeholder="Nearby landmark" value={f.landmark} onChange={set("landmark")} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City*" autoComplete="address-level2" placeholder="City" value={f.city} error={errors.city} onChange={set("city")} />
            <Field
              label="Pincode*"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="6 digit pincode"
              value={f.pincode}
              error={errors.pincode}
              onChange={set("pincode")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 font-display text-b16 font-semibold">Contact details</legend>
            <div className="flex gap-6">
              <Radio checked={!someone} label="Myself" onSelect={() => setContact("myself")} />
              <Radio checked={someone} label="Someone else" onSelect={() => setContact("someone")} />
            </div>
          </fieldset>
          <Field
            label="Receiver's name*"
            autoComplete={someone ? "off" : "name"}
            placeholder="Enter full name"
            value={receiverName}
            error={errors.receiverName}
            onChange={set("receiverName")}
          />
          <Field
            label="Receiver's phone number*"
            type="tel"
            inputMode="numeric"
            autoComplete={someone ? "off" : "tel-national"}
            placeholder="10 digit mobile number"
            value={!someone && receiverPhone.length === 10 ? showPhone(receiverPhone) : receiverPhone}
            error={errors.receiverPhone}
            onChange={set("receiverPhone")}
          />
          {someone ? (
            <Field label="Save address as (optional)" placeholder="For example, Mom's house" value={f.name} onChange={set("name")} />
          ) : (
            <div className="flex flex-col gap-2">
              <ChoiceChips<AddressLabel>
                label="Save address as"
                options={addressLabels}
                value={f.label}
                onChange={(label) => setF((x) => ({ ...x, label }))}
              />
              {f.label === "Other" && (
                <Field label="Address name*" placeholder="For example, Mom's house" value={f.name} error={errors.name} onChange={set("name")} />
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="state-dark mx-auto flex h-[52px] w-full max-w-[288px] cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark"
      >
        {id ? "Save changes" : "Save address"}
      </button>
    </form>
  );
}
