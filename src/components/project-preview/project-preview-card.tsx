'use client';

import type { Project } from '@/content/types';
import { ProjectTagRow } from './project-tag-row';
import { ProjectViewLink } from './project-view-link';
import { ProjectPreviewVideo } from './project-preview-video';

export function ProjectPreviewCard({
  project,
  elevated = true,
}: {
  project: Project;
  elevated?: boolean;
}) {
  return (
    <article
      data-testid="project-preview-card"
      className={`ui-preview-card w-full rounded-lg bg-bg ${
        elevated
          ? '[filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="ui-text-preview-title font-bold text-fg">{project.title}</span>
        <ProjectViewLink slug={project.slug} title={project.title} />
      </div>
      <ProjectPreviewVideo src={project.previewVideo} title={project.title} />
      <p className="ui-text-meta mt-2 leading-snug text-fg-muted">{project.oneLiner}</p>
      <ProjectTagRow tags={project.tags} />
    </article>
  );
}
