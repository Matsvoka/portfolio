import { FolderKanban } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { getPersonalProjects } from '@/lib/projects';
import { ProjectListItem } from './project-list-item';

export function ProjectsSection() {
  const personalProjects = getPersonalProjects();

  return (
    <section id="projetos" className="scroll-mt-16">
      <SectionTitle icon={FolderKanban}>Projetos</SectionTitle>
      <ul className="rounded-sm border border-fg/10 bg-bg p-4">
        {personalProjects.map((project) => (
          <li
            key={project.slug}
            className="border-b border-fg/10 py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <ProjectListItem project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
