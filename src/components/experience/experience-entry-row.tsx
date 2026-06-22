import type { ExperienceEntry } from '@/content/types';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { ProjectChip } from './project-chip';

export function ExperienceEntryRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <li className="relative pb-6 pl-8 after:absolute after:-bottom-[33px] after:-left-px after:top-[33px] after:w-0.5 after:bg-fg-muted after:content-[''] first:after:bg-lime last:pb-0 last:after:hidden">
      <span
        aria-hidden="true"
        className={`absolute -left-[5px] top-7 z-10 h-2.5 w-2.5 rounded-full ${
          entry.current ? 'bg-lime shadow-[0_0_6px_rgba(146,208,11,0.6)]' : 'bg-fg-muted'
        }`}
      />
      <div className="flex gap-3.5">
        <EntryLogoPlaceholder />
        <div>
          <p
            className={`ui-text-entry-title font-bold leading-tight tracking-tight ${
              entry.current ? 'text-lime-deep dark:text-lime-bright' : 'text-fg'
            }`}
          >
            {entry.role}
          </p>
          <p className="ui-text-body mt-0.5 font-semibold leading-tight text-fg-muted">{entry.company}</p>
          <p className="ui-text-meta mt-0.5 font-mono leading-tight text-fg-muted">{entry.period}</p>
        </div>
      </div>
      <p className="ui-text-description ml-[70px] mt-2 text-fg-muted">{entry.description}</p>
      {entry.projectSlugs && entry.projectSlugs.length > 0 && (
        <div className="ml-[70px] mt-2">
          <p className="ui-text-label mb-1.5 font-mono uppercase tracking-wide text-fg-muted">
            Projetos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.projectSlugs.map((slug) => (
              <ProjectChip key={slug} slug={slug} />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
