'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/content/types';
import { ProjectTagRow } from './project-tag-row';

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
        <Link
          href={`/projetos/${project.slug}`}
          aria-label={`Ver detalhes do projeto ${project.title}`}
          className="ui-text-meta inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <span>Ver</span>
          <ArrowRight className="ui-icon-inline" aria-hidden="true" />
        </Link>
      </div>
      <video
        aria-label={`Preview em vídeo do projeto ${project.title}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="ui-preview-video mt-2 w-full rounded-md bg-bg-dim object-cover"
      >
        <source src={project.previewVideo} type="video/mp4" />
      </video>
      <p className="ui-text-meta mt-2 leading-snug text-fg-muted">{project.oneLiner}</p>
      <ProjectTagRow tags={project.tags} />
    </article>
  );
}
