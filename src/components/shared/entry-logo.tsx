import Image from 'next/image';
import type { EntryLogoSource } from '@/content/types';
import { EntryLogoPlaceholder } from './entry-logo-placeholder';

const LOGO_SIZE = 56;
const IMAGE_CLASS = 'h-full w-full object-contain';

export function EntryLogo({ logo, alt }: { logo?: EntryLogoSource; alt: string }) {
  if (!logo) {
    return <EntryLogoPlaceholder />;
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-bg-dim p-1.5"
      style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
    >
      {typeof logo === 'string' ? (
        <Image src={logo} alt={alt} width={LOGO_SIZE} height={LOGO_SIZE} className={IMAGE_CLASS} />
      ) : (
        <>
          <Image
            src={logo.light}
            alt={alt}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className={`${IMAGE_CLASS} dark:hidden`}
          />
          <Image
            src={logo.dark}
            alt={alt}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className={`hidden ${IMAGE_CLASS} dark:block`}
          />
        </>
      )}
    </div>
  );
}
