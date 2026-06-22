const LOGO_SIZE = 56;

export function EntryLogoPlaceholder({ label = 'logo' }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-lg bg-bg-dim font-mono text-[9px] text-fg-muted"
      style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
    >
      {label}
    </div>
  );
}
