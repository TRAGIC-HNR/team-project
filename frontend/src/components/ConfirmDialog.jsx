import { useEffect, useState } from 'react';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel, busy]);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="animate-pop-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={confirm} disabled={busy} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
