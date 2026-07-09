'use client';

import { Code2 } from 'lucide-react';
import { useTagFit } from './use-tag-fit';

function TagBlock({ tag, showDot }: { tag: string; showDot: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {showDot && <span className="text-fg-muted">·</span>}
      <Code2 className="ui-icon-tag" aria-hidden="true" />
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

export function ProjectTagRow({ tags }: { tags: string[] }) {
  const { rowRef, mirrorRef, fit } = useTagFit(tags);
  const visible = tags.slice(0, fit.visibleCount);
  const overflowCount = fit.overflowCount;

  return (
    <>
      <div
        ref={rowRef}
        data-testid="tag-row"
        className="ui-preview-tag-row ui-text-label mt-2 flex items-center whitespace-nowrap font-mono text-lime-deep dark:text-lime-bright"
      >
        {visible.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        {overflowCount > 0 && <OverflowBadge count={overflowCount} />}
      </div>
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className="ui-preview-tag-row ui-text-label flex h-0 items-center overflow-hidden whitespace-nowrap font-mono"
      >
        {tags.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        <OverflowBadge count={tags.length} />
      </div>
    </>
  );
}
