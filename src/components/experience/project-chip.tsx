import { ProjectPreviewPopover } from '@/components/project-preview/project-preview-popover';
import { getProjectBySlug } from '@/lib/projects';

export function ProjectChip({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <ProjectPreviewPopover
      project={project}
      triggerClassName="rounded bg-lime-soft px-2.5 py-1 text-[11px] text-lime-deep transition-colors hover:bg-lime-bright hover:text-ink dark:hover:text-coal motion-safe:transition-transform motion-safe:active:scale-95"
    >
      {project.title}
    </ProjectPreviewPopover>
  );
}
