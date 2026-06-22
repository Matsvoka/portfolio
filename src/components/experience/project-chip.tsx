import { ProjectPreviewPopover } from '@/components/project-preview/project-preview-popover';
import { getProjectBySlug } from '@/lib/projects';

export function ProjectChip({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <ProjectPreviewPopover
      project={project}
      triggerClassName="cursor-pointer rounded bg-lime-bright px-3.5 py-1.5 text-sm text-ink transition-[color,background-color,transform] duration-150 hover:bg-lime active:scale-90 active:bg-lime-deep active:text-bone data-[preview-active=true]:bg-lime data-[pinned=true]:bg-lime data-[pinned=true]:text-ink data-[pinned=true]:hover:bg-lime sm:cursor-default sm:active:scale-100 sm:active:bg-lime sm:active:text-ink dark:text-coal dark:active:text-bone dark:data-[pinned=true]:text-coal dark:sm:active:text-coal"
    >
      {project.title}
    </ProjectPreviewPopover>
  );
}
