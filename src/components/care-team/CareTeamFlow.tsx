"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  defaultCallbackTime,
  requestCallback,
  userPhone,
} from "@/data/care-team";
import { routes } from "@/lib/routes";
import { CallbackForm, formatPhone, type CallbackDraft } from "./CallbackForm";
import { CallbackFailed, CallbackRequested } from "./CallbackResult";
import { CareOptions } from "./CareOptions";
import { FloatingClose } from "./CareParts";
import { LabTestForm, type LabTestDetails } from "./LabTestForm";

export type CareView = "options" | "callback" | "requested" | "failed" | "lab";

const emptyLab: LabTestDetails = { name: "", age: "", gender: "" };
const initialDraft: CallbackDraft = {
  phone: userPhone,
  time: defaultCallbackTime.time,
  meridiem: defaultCallbackTime.meridiem,
  note: "",
};

/**
 * The whole care-team pop up as one state machine:
 * options (W8.02–W8.04) → callback form (W8.05–W8.07) → requested (W8.08) or failed (W8.09);
 * lab test form (W9.02) → callback form (W9.03) → requested.
 * Desktop: 480 dialog. Mobile: bottom sheet with a floating close, except the lab form (centred dialog).
 *
 * `syncUrl` (route pages only) mirrors the step in the address bar so each step has a shareable URL.
 */
export function CareTeamFlow({
  initialView = "options",
  onClose,
  syncUrl = false,
}: {
  initialView?: CareView;
  onClose: () => void;
  syncUrl?: boolean;
}) {
  const [view, setView] = useState<CareView>(initialView);
  const [lab, setLab] = useState<LabTestDetails | null>(null);
  const [draft, setDraft] = useState<CallbackDraft>(initialDraft);
  const [sending, setSending] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  // showModal() focuses the first button (Close) and shows its ring; start on the step's heading instead.
  // Runs after Modal's own effect (parent effects run after child effects).
  useEffect(() => {
    body.current
      ?.querySelector<HTMLElement>("h2")
      ?.focus({ preventScroll: true });
  }, [view]);

  // Browser back/forward between steps pushed below: the page stays mounted, so follow the URL here.
  useEffect(() => {
    if (!syncUrl) return;
    const byPath: Record<string, CareView> = {
      [routes.careTeam]: "options",
      [routes.callback]: "callback",
      [routes.callbackRequested]: "requested",
      [routes.labTest]: "lab",
    };
    const onPop = () => {
      const next = byPath[window.location.pathname];
      if (next) setView(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [syncUrl]);

  function go(next: CareView, url?: string) {
    setView(next);
    if (syncUrl && url && url !== window.location.pathname) {
      window.history.pushState(null, "", url + window.location.search);
    }
  }

  async function send(d: CallbackDraft) {
    setDraft(d);
    setSending(true);
    try {
      await requestCallback({
        phone: formatPhone(d.phone),
        time: `${d.time} ${d.meridiem}`,
        note: d.note || undefined,
        labTest: lab ? { ...lab, age: Number(lab.age) } : undefined,
      });
      go("requested", routes.callbackRequested);
    } catch {
      setView("failed");
    } finally {
      setSending(false);
    }
  }

  const mobileDialog = view === "lab";

  return (
    <Modal
      open
      onClose={onClose}
      width={480}
      className={`max-md:overflow-visible ${
        mobileDialog
          ? "max-md:inset-0 max-md:m-auto max-md:h-fit max-md:w-[calc(100%-32px)] max-md:rounded-2xl"
          : ""
      }`}
    >
      <div ref={body}>
        {!mobileDialog && (
          <FloatingClose
            onClick={view === "failed" ? () => setView("callback") : onClose}
          />
        )}

        {view === "options" && (
          <CareOptions
            onClose={onClose}
            onCallback={() => go("callback", routes.callback)}
          />
        )}

        {view === "lab" && (
          <LabTestForm
            initial={lab ?? emptyLab}
            onClose={onClose}
            onNext={(details) => {
              setLab(details);
              setView("callback");
            }}
          />
        )}

        {view === "callback" && (
          <CallbackForm
            initial={draft}
            sending={sending}
            onClose={onClose}
            onSubmit={send}
          />
        )}

        {view === "failed" && (
          <CallbackFailed
            retrying={sending}
            onRetry={() => send(draft)}
            onClose={() => setView("callback")}
          />
        )}

        {view === "requested" && (
          <CallbackRequested
            phone={formatPhone(draft.phone)}
            onDone={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
