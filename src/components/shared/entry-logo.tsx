import Image from 'next/image';
import { EntryLogoPlaceholder } from './entry-logo-placeholder';

const LOGO_SIZE = 56;

export function EntryLogo({ logo, alt }: { logo?: string; alt: string }) {
  if (!logo) {
    return <EntryLogoPlaceholder />;
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-bg-dim p-1.5"
      style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
    >
      <Image
        src={logo}
        alt={alt}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
