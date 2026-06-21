import { getPersonalProjects } from '@/lib/projects';
import { ProjectPreviewCard } from '@/components/project-preview/project-preview-card';

export function ProjectsSection() {
  const personalProjects = getPersonalProjects();

  return (
    <section id="projetos">
      <h2 className="mb-6 text-2xl font-bold text-fg">Projetos</h2>
      <div className="flex flex-col gap-4">
        {personalProjects.map((project) => (
          <ProjectPreviewCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
