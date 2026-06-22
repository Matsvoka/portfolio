import { Wrench } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { skills } from '@/content/skills';
import { SkillIcon } from './skill-icon';

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16">
      <SectionTitle icon={Wrench}>Skills</SectionTitle>
      {skills.map((category) => (
        <div key={category.category} className="mb-6 last:mb-0">
          <p className="mb-2 text-[17px] font-bold leading-tight tracking-tight text-fg">
            {category.category}
          </p>
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
