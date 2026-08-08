// Reusable UI elements — colors, cards, badges
export function Badge({ children, color = 'bg-brand' }: { children: React.ReactNode; color?: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${color}`}>{children}</span>;
}
export function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />;
}
