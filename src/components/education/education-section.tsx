import { education } from '@/content/education';

export function EducationSection() {
  return (
    <section id="formacao">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">Formação</h2>
      <ul className="flex flex-col gap-3">
        {education.map((entry) => (
          <li key={`${entry.institution}-${entry.period}`}>
            <p className="text-[13px] font-bold text-fg">{entry.degree}</p>
            <p className="mt-0.5 text-[11px] text-fg-muted">{entry.institution}</p>
            <p className="mt-0.5 font-mono text-[10px] text-fg-muted">{entry.period}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
