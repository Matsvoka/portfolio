import { EducationSection } from '@/components/education/education-section';
import { ExperienceSection } from '@/components/experience/experience-section';
import { SkillsSection } from '@/components/skills/skills-section';
import { LanguagesSection } from '@/components/languages/languages-section';

export function ExperienceSkillsGrid() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <ExperienceSection />
      <aside className="px-4 py-12 lg:border-l lg:border-bg-dim lg:pl-8">
        <SkillsSection />
      </aside>
      <div className="px-4 py-12 lg:col-start-1 lg:row-start-2">
        <EducationSection />
      </div>
      <aside className="px-4 py-12 lg:col-start-2 lg:row-start-2 lg:border-l lg:border-bg-dim lg:pl-8">
        <LanguagesSection />
      </aside>
    </div>
  );
}
