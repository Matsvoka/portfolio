import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import type { Project } from '@/content/types';
import { getVisibleTags } from './tag-overflow';

const MAX_VISIBLE_TAGS = 2;

function previewLabel(demo: Project['demo']): string {
  switch (demo.type) {
    case 'mock':
      return 'preview (demo interativo)';
    case 'video':
      return 'preview (vídeo)';
    case 'gif':
      return 'preview (gif)';
    case 'none':
      return 'sem preview';
  }
}

export function ProjectPreviewCard({
  project,
  elevated = true,
}: {
  project: Project;
  elevated?: boolean;
}) {
  const { visible, overflowCount } = getVisibleTags(project.tags, MAX_VISIBLE_TAGS);

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className={`group block w-full rounded-lg bg-bg p-3.5 ${
        elevated
          ? '[filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-bold text-fg">{project.title}</span>
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-fg-muted transition-colors group-hover:text-lime-deep dark:group-hover:text-lime-bright"
        />
      </div>
      <div className="mt-2 flex h-20 items-center justify-center rounded-md bg-bg-dim font-mono text-[10px] text-fg-muted">
        {previewLabel(project.demo)}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-fg-muted">{project.oneLiner}</p>
      <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-lime-deep dark:text-lime-bright">
        {visible.map((tag, index) => (
          <span key={tag} className="flex items-center gap-1">
            {index > 0 && <span className="text-fg-muted">·</span>}
            <Code2 size={10} aria-hidden="true" />
            <span>{tag}</span>
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-fg-muted">·</span>
            <span className="text-fg-muted">+{overflowCount}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
