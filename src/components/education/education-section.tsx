import { GraduationCap } from 'lucide-react';
import { EntryLogo } from '@/components/shared/entry-logo';
import { SectionTitle } from '@/components/shared/section-title';
import { education } from '@/content/education';

export function EducationSection() {
  return (
    <section id="formacao" className="scroll-mt-16 px-4 py-12">
      <SectionTitle icon={GraduationCap}>Formação</SectionTitle>
      <ul className="flex flex-col gap-6">
        {education.map((entry) => (
          <li key={`${entry.institution}-${entry.period}`} className="flex gap-3.5">
            <EntryLogo logo={entry.logo} alt={entry.institution} />
            <div>
              <p className="ui-text-entry-title font-bold leading-tight tracking-tight text-fg">
                {entry.degree}
              </p>
              <p className="ui-text-body mt-0.5 font-semibold leading-tight text-fg-muted">
                {entry.institution}
              </p>
              <p className="ui-text-meta mt-0.5 font-mono leading-tight text-fg-muted">
                {entry.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
