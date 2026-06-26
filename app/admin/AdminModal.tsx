"use client";

import { useState, useRef, useEffect } from "react";

export default function AdminModal({
  trigger,
  title,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 m-auto w-[95vw] max-w-lg rounded-2xl border border-line bg-white p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-stone-400 hover:text-ink text-xl leading-none font-bold transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </dialog>
    </>
  );
}
