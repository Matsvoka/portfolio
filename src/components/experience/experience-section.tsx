import { experience } from '@/content/experience';
import { ExperienceEntryRow } from './experience-entry-row';

export function ExperienceSection() {
  return (
    <section id="experiencia" className="px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-fg">Experiência</h2>
      <ul>
        {experience.map((entry) => (
          <ExperienceEntryRow key={`${entry.company}-${entry.period}`} entry={entry} />
        ))}
      </ul>
    </section>
  );
}
