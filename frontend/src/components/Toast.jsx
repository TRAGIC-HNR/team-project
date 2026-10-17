import { useEffect } from 'react';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onDismiss, 4000);
    return () => clearTimeout(id);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const color = toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900';

  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className={`animate-pop-in flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${color}`}>
        <span>{toast.message}</span>
        <button onClick={onDismiss} aria-label="Dismiss" className="text-white/70 hover:text-white">✕</button>
      </div>
    </div>
  );
}
