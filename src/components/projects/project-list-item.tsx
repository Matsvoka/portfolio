import type { ProjectSummary } from '@/content/types';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { ProjectTagRow } from '@/components/project-preview/project-tag-row';
import { ProjectViewLink } from '@/components/project-preview/project-view-link';
import { ProjectPreviewVideo } from '@/components/project-preview/project-preview-video';

export function ProjectListItem({ project }: { project: ProjectSummary }) {
  return (
    <div className="flex gap-3.5">
      <EntryLogoPlaceholder />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="ui-text-entry-title font-bold leading-tight tracking-tight text-fg">
            {project.title}
          </span>
          <ProjectViewLink slug={project.slug} title={project.title} />
        </div>
        <ProjectPreviewVideo src={project.previewVideo} title={project.title} />
        <p className="ui-text-description mt-2 text-fg-muted">{project.oneLiner}</p>
        <ProjectTagRow tags={project.tags} />
      </div>
    </div>
  );
}
