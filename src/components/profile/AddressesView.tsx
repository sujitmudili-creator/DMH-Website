"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addressIcon, addressLine, addressShort, addressTitle, type SavedAddress } from "@/data/addresses";
import { routes } from "@/lib/routes";
import { deleteAddress, useAddresses } from "./addressStore";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { useIsDesktop } from "./DateFilter";
import { Chevron } from "./ProfileMenu";

/** Edit / Delete rows, shared by the desktop popover and the mobile sheet. */
function OptionRows({ address, onDelete, className }: { address: SavedAddress; onDelete: () => void; className: string }) {
  return (
    <>
      <Link role="menuitem" href={routes.editAddress(address.id)} className={`state flex items-center gap-2 ${className}`}>
        <img src="/icons/profile/edit-22.svg" alt="" className="size-[22px] shrink-0" />
        <span className="flex-1 text-b14 font-medium">Edit address</span>
      </Link>
      <button role="menuitem" type="button" onClick={onDelete} className={`state flex cursor-pointer items-center gap-2 text-left ${className}`}>
        <img src="/icons/profile/trash-22.svg" alt="" className="size-[22px] shrink-0" />
        <span className="flex-1 text-b14 font-medium text-danger">Delete address</span>
      </button>
    </>
  );
}

/**
 * W13.03 "Address options" under the card's ⋮ button: a popover on desktop, the "Select option" bottom sheet on
 * mobile (M13.03).
 */
function AddressOptions({ address, onDelete }: { address: SavedAddress; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const desktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const del = () => {
    setOpen(false);
    onDelete();
  };

  useEffect(() => {
    if (!open || !desktop) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, desktop]);

  return (
    <div ref={ref} className="absolute right-[15px] top-[15px] md:relative md:right-auto md:top-auto md:shrink-0">
      <button
        type="button"
        aria-label={`Options for ${addressTitle(address)}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="state flex size-9 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-line bg-card"
      >
        {/* Three 4px dots, stacked (Figma rotates the horizontal "More" by 90°). */}
        <span className="size-1 rounded-full bg-ink" />
        <span className="size-1 rounded-full bg-ink" />
        <span className="size-1 rounded-full bg-ink" />
      </button>
      {open && desktop && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-20 flex w-[220px] flex-col rounded-lg border border-line bg-card p-2 shadow-menu">
          <OptionRows address={address} onDelete={del} className="rounded-md px-3 py-2.5" />
        </div>
      )}
      {!desktop && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-h20 font-semibold">Select option</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="state flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-card">
                <img src="/icons/icon-add-22.svg" alt="" className="size-[22px] rotate-45" />
              </button>
            </div>
            <div role="menu" className="flex flex-col overflow-hidden rounded-lg border border-line py-2">
              <OptionRows address={address} onDelete={del} className="px-4 py-2" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/** Saved addresses (W13.02), with options (W13.03) and delete confirm (W13.05). */
export function AddressesView() {
  const addresses = useAddresses();
  const [deleting, setDeleting] = useState<SavedAddress | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Link href={routes.addAddress} className="state flex items-center gap-4 rounded-lg border border-line p-4">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <img src="/icons/auth/add-link-22.svg" alt="" className="size-[22px] shrink-0" />
          <span className="text-b14 font-medium text-link">Add new address</span>
        </span>
        <Chevron />
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-b16 font-semibold">Your saved addresses</h2>
        {addresses.length === 0 && <p className="text-b14 text-ink-2">No saved addresses yet. Add one to book faster.</p>}
        {addresses.map((a) => (
          <article key={a.id} className="relative flex items-start gap-4 rounded-lg border border-line bg-linear-to-l from-tint-2 to-card p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-tint">
              <img src={addressIcon(a)} alt="" className="size-[22px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3 pr-[34px] md:pr-0">
              <div className="flex flex-col gap-1">
                <h3 className="text-b16 font-semibold">{addressTitle(a)}</h3>
                <p className="text-b14 text-ink-2">{addressLine(a)}</p>
                <p className="text-b14 text-ink-2">
                  Phone number: <span className="font-semibold text-ink">{a.receiverPhone}</span>
                </p>
              </div>
              {a.lastBooked && <p className="text-b12 text-ink-2">Last booked on {a.lastBooked}</p>}
            </div>
            <AddressOptions address={a} onDelete={() => setDeleting(a)} />
          </article>
        ))}
      </section>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteAddress(deleting.id);
          setDeleting(null);
        }}
        icon="/icons/profile/trash-31.svg"
        iconSize={30.8}
        title="Delete this address?"
        text={deleting ? `${addressTitle(deleting)} · ${addressShort(deleting)} will be removed from your saved addresses.` : ""}
        confirmLabel="Delete"
      />
    </div>
  );
}
