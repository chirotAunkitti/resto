/**
 * A small "Back to GAT" pill shown only on the public demo deployment.
 * It renders nothing unless NEXT_PUBLIC_GAT_SHOWCASE_URL is set, so buyers
 * who deploy their own copy never see it.
 */
export function DemoBadge() {
  const url = process.env.NEXT_PUBLIC_GAT_SHOWCASE_URL;
  if (!url) return null;

  return (
    <a
      href={url}
      className="fixed bottom-5 left-5 z-[60] inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2 text-sm font-semibold text-ink shadow-lg backdrop-blur-xl transition-colors hover:border-primary/40 hover:text-primary"
    >
      <span aria-hidden>&larr;</span>
      Back to GAT
    </a>
  );
}
