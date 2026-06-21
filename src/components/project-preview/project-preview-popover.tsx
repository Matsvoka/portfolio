'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Project } from '@/content/types';
import { ProjectPreviewCard } from './project-preview-card';

export function ProjectPreviewPopover({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;

    function dismiss() {
      setPinned(false);
      setVisible(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        dismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismiss();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pinned]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (!pinned) setVisible(false);
      }}
    >
      <button
        type="button"
        onClick={() => {
          setPinned(true);
          setVisible(true);
        }}
        aria-expanded={visible}
      >
        {children}
      </button>
      {visible && (
        <div className="absolute left-0 top-full z-50 mt-2.5">
          <ProjectPreviewCard project={project} elevated={false} />
        </div>
      )}
    </div>
  );
}
