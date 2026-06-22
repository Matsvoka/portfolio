import { EducationSection } from '@/components/education/education-section';
import { ExperienceSection } from '@/components/experience/experience-section';
import { SkillsSection } from '@/components/skills/skills-section';
import { LanguagesSection } from '@/components/languages/languages-section';

export function ExperienceSkillsGrid() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <ExperienceSection />
      <aside className="lg:border-l lg:border-bg-dim">
        <SkillsSection />
      </aside>
      <div className="lg:col-start-1 lg:row-start-2">
        <EducationSection />
      </div>
      <aside className="lg:col-start-2 lg:row-start-2 lg:border-l lg:border-bg-dim">
        <LanguagesSection />
      </aside>
    </div>
  );
}
