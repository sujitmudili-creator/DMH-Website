"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { login } from "@/data/auth";
import { external, routes } from "@/lib/routes";
import { AuthButton } from "./AuthButton";
import { AuthDialog } from "./AuthDialog";
import { formatPhone, withQuery } from "./flow";

/** W1.09 / M1.08 · Log in · Phone number. */
export function PhoneForm({ next, initialPhone = "" }: { next: string; initialPhone?: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState(initialPhone.replace(/\D/g, "").slice(0, login.phoneLength));
  const [error, setError] = useState<string>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    router.push(withQuery(routes.verify, { phone: digits, next }));
  };

  return (
    <AuthDialog title="Enter your phone number" subtitle="We will send you a code to verify it" onClose={() => router.push(next)}>
      <form onSubmit={submit} noValidate className="flex flex-col items-center gap-4">
        <div className="flex w-full items-start gap-2">
          <div className="flex h-[52px] w-[86px] shrink-0 items-center justify-center gap-2 rounded-lg border border-field text-b16">
            {login.countryCode}
            <img src="/icons/auth/arrow-down-16.svg" alt="" width={16} height={16} className="size-4" />
          </div>
          <Field
            className="min-w-0 flex-1"
            aria-label="Phone number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            placeholder={login.phonePlaceholder}
            value={formatPhone(digits)}
            error={error}
            onChange={(e) => {
              setDigits(e.target.value.replace(/\D/g, "").slice(0, login.phoneLength));
              setError(undefined);
            }}
          />
        </div>
        <p className="w-full text-b12 text-ink-2">
          By continuing, you agree to our{" "}
          <a href={external.terms} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:underline">
            T&amp;C
          </a>{" "}
          and{" "}
          <a href={external.privacy} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:underline">
            Privacy
          </a>{" "}
          policy
        </p>
        <AuthButton type="submit" className="w-full md:w-80">
          Continue
        </AuthButton>
      </form>
    </AuthDialog>
  );
}
