import { skills } from '@/content/skills';
import { SkillIcon } from './skill-icon';

export function SkillsSection() {
  return (
    <section id="skills">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">Skills</h2>
      {skills.map((category) => (
        <div key={category.category} className="mb-4">
          <p className="mb-1.5 text-[10px] text-fg-muted">{category.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 rounded bg-lime-soft px-2.5 py-1 text-[10px] text-lime-deep"
              >
                <SkillIcon name={item.icon} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
