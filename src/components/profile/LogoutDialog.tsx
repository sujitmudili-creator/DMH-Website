"use client";

import { ConfirmDialog } from "./ConfirmDialog";

/** W14.03 / M14.03 "Log out?". Confirm signs out and goes Home (W1.01). */
export function LogoutDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      icon="/icons/profile/logout-28.svg"
      iconSize={28}
      title="Log out?"
      text="You can log in again any time with your phone number."
      confirmLabel="Log out"
    />
  );
}
