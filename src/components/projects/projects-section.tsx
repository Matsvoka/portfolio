import { FolderKanban } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { getPersonalProjects } from '@/lib/projects';
import { ProjectPreviewCard } from '@/components/project-preview/project-preview-card';

export function ProjectsSection() {
  const personalProjects = getPersonalProjects();

  return (
    <section id="projetos" className="scroll-mt-16">
      <SectionTitle icon={FolderKanban}>Projetos</SectionTitle>
      <div className="flex flex-col gap-4">
        {personalProjects.map((project) => (
          <ProjectPreviewCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
