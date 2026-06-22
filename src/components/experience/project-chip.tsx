import { ProjectPreviewPopover } from '@/components/project-preview/project-preview-popover';
import { getProjectBySlug } from '@/lib/projects';

export function ProjectChip({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <ProjectPreviewPopover
      project={project}
      triggerClassName="cursor-pointer rounded bg-lime-bright px-2.5 py-1 text-[11px] text-ink transition-[color,background-color,transform] duration-150 hover:bg-lime active:scale-90 active:bg-lime-deep active:text-bone data-[pinned=true]:bg-lime-deep data-[pinned=true]:text-bone data-[pinned=true]:hover:bg-lime-deep dark:text-coal dark:active:text-bone dark:data-[pinned=true]:text-bone"
    >
      {project.title}
    </ProjectPreviewPopover>
  );
}
