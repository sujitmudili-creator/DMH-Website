"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { login, otp } from "@/data/auth";
import { routes } from "@/lib/routes";
import { useSession } from "@/lib/session";
import { AuthButton } from "./AuthButton";
import { AuthDialog } from "./AuthDialog";
import { formatPhone, withQuery } from "./flow";

type Status = "idle" | "verifying" | "wrong" | "expired" | "locked";

const LOCK_KEY = "dmh.otp.lock";

function readLock(phone: string): number {
  try {
    const v = JSON.parse(window.sessionStorage.getItem(LOCK_KEY) ?? "null") as { phone: string; until: number } | null;
    return v && v.phone === phone && v.until > Date.now() ? v.until : 0;
  } catch {
    return 0;
  }
}

function writeLock(phone: string, until: number) {
  try {
    if (until) window.sessionStorage.setItem(LOCK_KEY, JSON.stringify({ phone, until }));
    else window.sessionStorage.removeItem(LOCK_KEY);
  } catch {}
}

/** "m:ss" for the resend countdown, "mm:ss" for the lock (matches "0:30" and "09:59" in Figma). */
function clock(ms: number, pad = false) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return `${pad ? String(m).padStart(2, "0") : m}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * W1.10 / M1.09 · Verify code, with every state from Figma as UI state:
 * W4.02 code resent (success line + "Resend code in 0:30"), W4.03 wrong code, W4.04 code expired,
 * W4.05 too many attempts (locked, live countdown), W20.12 verifying (spinner in the button).
 * Demo rules live in data/auth.ts (`otp`): "1234" is correct, "0000" or a code older than 5 min is expired.
 */
export function OtpForm({ phone, next }: { phone: string; next: string }) {
  const router = useRouter();
  const { user, signIn } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [attempts, setAttempts] = useState(0);
  const [sentAt, setSentAt] = useState(() => Date.now());
  const [resentUntil, setResentUntil] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const shownPhone = `${login.countryCode} ${formatPhone(phone)}`;

  // Restore a lock that survived a refresh.
  useEffect(() => {
    const until = readLock(phone);
    if (until) {
      setLockUntil(until);
      setStatus("locked");
    }
  }, [phone]);

  // Tick once a second while a countdown is showing.
  const ticking = resentUntil > now || status === "locked";
  useEffect(() => {
    if (!ticking) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [ticking]);

  // Lock ran out: start fresh.
  useEffect(() => {
    if (status === "locked" && lockUntil && now >= lockUntil) {
      writeLock(phone, 0);
      setLockUntil(0);
      setAttempts(0);
      setCode("");
      setStatus("idle");
      inputRef.current?.focus();
    }
  }, [now, lockUntil, status, phone]);

  const locked = status === "locked";
  const hasError = status === "wrong" || status === "expired";
  const verifying = status === "verifying";
  const canVerify = code.length === otp.length && !hasError && !locked;

  const verify = () => {
    if (!canVerify || verifying) return;
    setStatus("verifying");
    window.setTimeout(() => {
      const expired = code === "0000" || Date.now() - sentAt > otp.expirySeconds * 1000;
      if (expired) return setStatus("expired");
      if (code === otp.demoCode) {
        const returning = user && user.phone === shownPhone && user.name;
        signIn({ name: returning ? user.name : "", phone: shownPhone });
        router.push(returning ? next : withQuery(routes.yourDetails, { next }));
        return;
      }
      const n = attempts + 1;
      setAttempts(n);
      if (n >= otp.maxAttempts) {
        const until = Date.now() + otp.lockSeconds * 1000;
        writeLock(phone, until);
        setLockUntil(until);
        setNow(Date.now());
        setStatus("locked");
      } else setStatus("wrong");
    }, otp.verifyMs);
  };

  const resend = () => {
    setCode("");
    setStatus("idle");
    setSentAt(Date.now());
    setNow(Date.now());
    setResentUntil(Date.now() + otp.resendSeconds * 1000);
    inputRef.current?.focus();
  };

  const resendWait = resentUntil - now;

  return (
    <AuthDialog
      title="Enter the code"
      subtitle={
        <Link href={withQuery(routes.login, { phone, next })} className="inline-flex items-center gap-2">
          Sent to {shownPhone}
          <span className="font-semibold text-link hover:underline">Edit</span>
        </Link>
      }
      onClose={() => router.push(next)}
    >
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify();
        }}
      >
        <div className="flex w-full flex-col">
          <div className="relative flex w-full gap-3">
            {Array.from({ length: otp.length }, (_, i) => {
              const digit = code[i];
              const active = focused && !locked && !verifying && i === Math.min(code.length, otp.length - 1) && !hasError;
              const caret = active && !digit;
              return (
                <span
                  key={i}
                  aria-hidden
                  className={`flex h-[52px] min-w-0 flex-1 items-center justify-center rounded-lg font-display text-h24 font-semibold transition-colors ${
                    locked
                      ? "bg-muted text-ink-3"
                      : hasError
                        ? `border border-danger ${i === otp.length - 1 ? "shadow-[inset_0_0_0_0.5px_var(--color-danger)]" : ""}`
                        : active
                          ? "border border-field-selected shadow-[inset_0_0_0_0.5px_var(--color-field-selected)]"
                          : "border border-field"
                  }`}
                >
                  {digit ?? (caret && <span className="h-6 w-0.5 animate-pulse bg-brand" />)}
                </span>
              );
            })}
            <input
              ref={inputRef}
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, otp.length);
                setCode(v);
                if (hasError) setStatus("idle");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={locked || verifying}
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={otp.length}
              aria-invalid={hasError || undefined}
              aria-describedby="otp-msg"
              aria-label={`${otp.length}-digit code`}
              className="absolute inset-0 cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none"
            />
          </div>

          <div id="otp-msg" aria-live="polite" className="flex flex-col">
            {status === "wrong" && <Message tone="danger">That code is incorrect. Try again.</Message>}
            {status === "expired" && <Message tone="danger">This code has expired. Resend a new one.</Message>}
            {locked && <Message tone="danger">Too many attempts. Try again in {clock(lockUntil - now, true)}</Message>}
            {status === "idle" && resendWait > 0 && <Message tone="success">New code sent to {shownPhone}</Message>}
          </div>
        </div>

        {!locked &&
          (resendWait > 0 ? (
            <p className="self-start text-b14 text-ink-2">
              Resend code in <span className="font-semibold text-ink">{clock(resendWait)}</span>
            </p>
          ) : (
            <button type="button" onClick={resend} className="state cursor-pointer rounded text-b14 text-ink-2" disabled={verifying}>
              Didn&apos;t get the code? <span className="font-semibold text-link">Resend OTP</span>
            </button>
          ))}

        <AuthButton type="submit" className="w-full md:w-80" disabled={!canVerify} loading={verifying}>
          {verifying ? "Verifying" : "Verify"}
        </AuthButton>
      </form>
    </AuthDialog>
  );
}

function Message({ tone, children }: { tone: "danger" | "success"; children: React.ReactNode }) {
  return tone === "danger" ? (
    <p className="mt-4 flex items-center gap-1 self-center text-b12 text-danger">
      <img src="/icons/icon-info-circle-danger-16.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
      {children}
    </p>
  ) : (
    <p className="mt-2 flex items-center gap-2 self-start text-b12 font-medium text-success">
      <img src="/icons/auth/tick-circle-success-16.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
      {children}
    </p>
  );
}
