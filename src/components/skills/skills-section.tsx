import { Wrench } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { skills } from '@/content/skills';
import { SkillIcon } from './skill-icon';

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16 px-4 py-12 lg:pl-8">
      <SectionTitle icon={Wrench}>Skills</SectionTitle>
      <div data-testid="skills-card" className="rounded-sm border border-fg/10 bg-bg p-4">
        {skills.map((category) => (
          <section
            key={category.category}
            data-testid="skill-category-section"
            className="border-b border-fg/10 py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <p className="ui-text-entry-title mb-2 font-bold leading-tight tracking-tight text-fg">
              {category.category}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  data-testid="skill-item"
                  className="ui-chip ui-text-label inline-flex items-center gap-1 rounded border border-fg/10 bg-fg/5 text-fg-muted"
                >
                  <SkillIcon name={item.icon} />
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
