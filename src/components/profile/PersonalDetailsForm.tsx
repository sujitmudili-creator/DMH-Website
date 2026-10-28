"use client";

import { useEffect, useState } from "react";
import { ChoiceChips } from "@/components/auth/StepCard";
import { Field } from "@/components/ui/Field";
import { demoDetails, demoUser, genders } from "@/data/profile";
import { useProfileSession } from "./useProfileSession";

type Gender = (typeof genders)[number];
const KEY = "dmh.profile-details";

function readDetails(): { email: string; gender: Gender } {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    if (v && typeof v.email === "string" && genders.includes(v.gender)) return v;
  } catch {}
  return demoDetails;
}

/**
 * Personal details (W11.02 / M11.02): name, verified phone (read only), email, gender, Save changes.
 * Saving shows the "Your details are saved" toast (W11.03). Placeholder storage: session + localStorage.
 */
export function PersonalDetailsForm() {
  const { user, signIn } = useProfileSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender | undefined>();
  const [errors, setErrors] = useState<{ name?: string; email?: string; gender?: string }>({});
  const [saved, setSaved] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const d = readDetails();
    setName(user?.name ?? demoUser.name);
    setEmail(d.email);
    setGender(d.gender);
    setLoaded(true);
  }, [user, loaded]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(0), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!name.trim()) err.name = "Enter your full name";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) err.email = "Enter a valid email";
    if (!gender) err.gender = "Choose one";
    setErrors(err);
    if (Object.keys(err).length) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ email: email.trim(), gender }));
    } catch {}
    signIn({ name: name.trim(), phone: user?.phone ?? demoUser.phone });
    setSaved(Date.now());
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col items-center gap-8">
      <div className="flex w-full flex-col gap-4">
        <Field
          label="Full name*"
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((x) => ({ ...x, name: undefined }));
          }}
        />
        <Field
          label={
            <span className="flex items-end gap-1">
              Phone number
              <span className="rounded-[6px] px-2 py-0.5 text-b12 font-semibold uppercase tracking-[0.04em] text-success">Verified</span>
            </span>
          }
          value={user?.phone ?? demoUser.phone}
          readOnly
          aria-readonly
          className="[&_input]:text-ink-2"
        />
        <Field
          label="Email (optional)"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((x) => ({ ...x, email: undefined }));
          }}
        />
        <ChoiceChips label="Gender*" options={genders} value={gender} onChange={setGender} equal error={errors.gender} />
      </div>
      <button
        type="submit"
        className="state-dark flex h-[52px] w-full max-w-80 cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark"
      >
        Save changes
      </button>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-8 z-50 flex justify-center md:bottom-[224px]">
        {saved > 0 && (
          <p className="w-full max-w-[420px] rounded-lg bg-inverse p-4 text-b14 text-on-dark shadow-menu">Your details are saved</p>
        )}
      </div>
    </form>
  );
}
