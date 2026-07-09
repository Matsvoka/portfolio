import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/content/types';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { ProjectTagRow } from '@/components/project-preview/project-tag-row';

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <div className="flex gap-3.5">
      <EntryLogoPlaceholder />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="ui-text-entry-title font-bold leading-tight tracking-tight text-fg">
            {project.title}
          </span>
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
        <p className="ui-text-description mt-2 text-fg-muted">{project.oneLiner}</p>
        <ProjectTagRow tags={project.tags} />
      </div>
    </div>
  );
}
