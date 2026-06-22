import { GraduationCap } from 'lucide-react';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { SectionTitle } from '@/components/shared/section-title';
import { education } from '@/content/education';

export function EducationSection() {
  return (
    <section id="formacao" className="scroll-mt-16 px-4 py-12">
      <SectionTitle icon={GraduationCap}>Formação</SectionTitle>
      <ul className="flex flex-col gap-6">
        {education.map((entry) => (
          <li key={`${entry.institution}-${entry.period}`} className="flex gap-3.5">
            <EntryLogoPlaceholder />
            <div>
              <p className="text-[20px] font-bold leading-tight tracking-tight text-fg">
                {entry.degree}
              </p>
              <p className="mt-0.5 text-[15px] font-semibold leading-tight text-fg-muted">
                {entry.institution}
              </p>
              <p className="mt-0.5 font-mono text-[13px] leading-tight text-fg-muted">
                {entry.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
