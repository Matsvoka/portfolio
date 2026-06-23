import { Wrench } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { skills } from '@/content/skills';
import { SkillIcon } from './skill-icon';

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16 px-4 py-12 lg:pl-8">
      <SectionTitle icon={Wrench}>Skills</SectionTitle>
      <div className="flex flex-col gap-2">
        {skills.map((category) => (
          <article
            key={category.category}
            data-testid="skill-category-card"
            className="rounded-sm border border-fg/10 bg-bg p-4"
          >
            <p className="ui-text-entry-title mb-2 font-bold leading-tight tracking-tight text-fg">
              {category.category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <span
                  key={item.name}
                  className="ui-chip ui-text-label inline-flex items-center gap-1 rounded bg-lime-soft text-lime-deep"
                >
                  <SkillIcon name={item.icon} />
                  {item.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
