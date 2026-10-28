"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field } from "@/components/ui/Field";
import { genders } from "@/data/auth";
import { routes } from "@/lib/routes";
import { useSession } from "@/lib/session";
import { AuthButton } from "./AuthButton";
import { AuthDialog } from "./AuthDialog";
import { readDraft, withQuery, writeDraft } from "./flow";
import { StepCard, ChoiceChips } from "./StepCard";

type Gender = (typeof genders)[number];

/** W1.11 / M1.10 · Your details — step 1 open (name, email, gender), step 2 "Address" closed. */
export function DetailsForm({ next }: { next: string }) {
  const router = useRouter();
  const { user, signIn } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>();
  const [errors, setErrors] = useState<{ name?: string; email?: string; gender?: string }>({});

  useEffect(() => {
    const d = readDraft();
    setName(d.name ?? "");
    setEmail(d.email ?? "");
    if (d.gender && (genders as readonly string[]).includes(d.gender)) setGender(d.gender as Gender);
  }, []);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const err: typeof errors = {};
    if (name.trim().length < 2) err.name = "Enter your full name";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email";
    if (!gender) err.gender = "Choose one";
    setErrors(err);
    if (Object.keys(err).length) return;
    writeDraft({ name: name.trim(), email: email.trim(), gender });
    if (user) signIn({ ...user, name: name.trim() });
    router.push(withQuery(routes.address, { next }));
  };

  return (
    <AuthDialog
      title="Your details"
      tight
      onClose={() => router.push(next)}
      footer={
        <div className="pt-3 md:px-4">
          <AuthButton type="submit" form="details-form" className="w-full">
            Continue
          </AuthButton>
        </div>
      }
    >
      <form id="details-form" onSubmit={submit} noValidate className="flex flex-col gap-3">
        <StepCard step={1} title="Personal details" state="open">
          <div className="flex flex-col gap-4">
            <Field
              label="Full name*"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((x) => ({ ...x, name: undefined }));
              }}
            />
            <Field
              label="Email (optional)"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((x) => ({ ...x, email: undefined }));
              }}
            />
            <ChoiceChips
              label="Gender*"
              options={genders}
              value={gender}
              equal
              error={errors.gender}
              onChange={(g) => {
                setGender(g);
                setErrors((x) => ({ ...x, gender: undefined }));
              }}
            />
          </div>
        </StepCard>
        <StepCard step={2} title="Address" state="closed" onToggle={() => submit()} />
      </form>
    </AuthDialog>
  );
}
