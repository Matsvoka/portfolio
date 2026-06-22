const LOGO_SIZE = 56;
const FLAG_WIDTH = 40;
const FLAG_HEIGHT = 28;

export function EntryLogoPlaceholder({
  label = 'logo',
  variant = 'logo',
}: {
  label?: string;
  variant?: 'logo' | 'flag';
}) {
  const isFlag = variant === 'flag';

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center bg-bg-dim font-mono text-fg-muted ${
        isFlag ? 'rounded text-[7px]' : 'rounded-lg text-[9px]'
      }`}
      style={
        isFlag
          ? { width: FLAG_WIDTH, height: FLAG_HEIGHT }
          : { width: LOGO_SIZE, height: LOGO_SIZE }
      }
    >
      {label}
    </div>
  );
}
