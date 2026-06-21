import { ProjectsSection } from '@/components/projects/projects-section';
import { SkillsSection } from '@/components/skills/skills-section';
import { EducationSection } from '@/components/education/education-section';

export function ProjectsSkillsGrid() {
  return (
    <div className="grid gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
      <ProjectsSection />
      <aside className="flex flex-col gap-8 lg:border-l lg:border-bg-dim lg:pl-8">
        <SkillsSection />
        <EducationSection />
      </aside>
    </div>
  );
}
