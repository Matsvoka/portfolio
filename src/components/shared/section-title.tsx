import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-fg">
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center text-lime-deep dark:text-lime-bright"
      >
        <Icon size={31} strokeWidth={2.25} />
      </span>
      <span>{children}</span>
    </h2>
  );
}
