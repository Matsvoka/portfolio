import type { ExperienceEntry } from '@/content/types';

const LOGO_SIZE = 56;

export function ExperienceEntryRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <li className="relative border-l-2 border-lime pb-6 pl-8 last:pb-0">
      <span
        aria-hidden="true"
        className={`absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full ${
          entry.current ? 'bg-lime shadow-[0_0_6px_rgba(146,208,11,0.6)]' : 'bg-fg-muted'
        }`}
      />
      <div className="flex gap-3.5">
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center rounded-lg bg-bg-dim font-mono text-[9px] text-fg-muted"
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
        >
          logo
        </div>
        <div>
          <p
            className={`text-[17px] font-bold leading-tight tracking-tight ${
              entry.current ? 'text-lime-deep dark:text-lime-bright' : 'text-fg'
            }`}
          >
            {entry.role}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">{entry.company}</p>
          <p className="mt-0.5 font-mono text-[11px] leading-tight text-fg-muted">{entry.period}</p>
        </div>
      </div>
      <p className="ml-[70px] mt-2 text-[12px] text-fg-muted">{entry.description}</p>
    </li>
  );
}
