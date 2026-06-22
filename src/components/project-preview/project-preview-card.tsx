'use client';

import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import type { Project } from '@/content/types';
import { useTagFit } from './use-tag-fit';

function TagBlock({ tag, showDot }: { tag: string; showDot: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {showDot && <span className="text-fg-muted">·</span>}
      <Code2 size={12} aria-hidden="true" />
      <span>{tag}</span>
    </span>
  );
}

function OverflowBadge({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-fg-muted">·</span>
      <span className="text-fg-muted">+{count}</span>
    </span>
  );
}

export function ProjectPreviewCard({
  project,
  elevated = true,
}: {
  project: Project;
  elevated?: boolean;
}) {
  const { rowRef, mirrorRef, fit } = useTagFit(project.tags);
  const visible = project.tags.slice(0, fit.visibleCount);
  const overflowCount = fit.overflowCount;

  return (
    <article
      data-testid="project-preview-card"
      className={`w-full rounded-lg bg-bg p-4 ${
        elevated
          ? '[filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[17px] font-bold text-fg">{project.title}</span>
        <Link
          href={`/projetos/${project.slug}`}
          aria-label={`Ver detalhes do projeto ${project.title}`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[13px] font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <span>Ver</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <video
        aria-label={`Preview em vídeo do projeto ${project.title}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="mt-2 h-24 w-full rounded-md bg-bg-dim object-cover"
      >
        <source src={project.previewVideo} type="video/mp4" />
      </video>
      <p className="mt-2 text-[13px] leading-snug text-fg-muted">{project.oneLiner}</p>
      <div
        ref={rowRef}
        data-testid="tag-row"
        className="mt-2 flex items-center gap-1.5 whitespace-nowrap font-mono text-[12px] text-lime-deep dark:text-lime-bright"
      >
        {visible.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        {overflowCount > 0 && <OverflowBadge count={overflowCount} />}
      </div>
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className="flex h-0 items-center gap-1.5 overflow-hidden font-mono text-[12px]"
      >
        {project.tags.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        <OverflowBadge count={project.tags.length} />
      </div>
    </article>
  );
}
