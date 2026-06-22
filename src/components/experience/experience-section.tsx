import { BriefcaseBusiness } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { experience } from '@/content/experience';
import { ExperienceEntryRow } from './experience-entry-row';

export function ExperienceSection() {
  return (
    <section id="experiencia" className="scroll-mt-16 px-4 py-12">
      <SectionTitle icon={BriefcaseBusiness}>Experiência</SectionTitle>
      <ul>
        {experience.map((entry) => (
          <ExperienceEntryRow key={`${entry.company}-${entry.period}`} entry={entry} />
        ))}
      </ul>
    </section>
  );
}
