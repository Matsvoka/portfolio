'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Project } from '@/content/types';
import { ProjectPreviewCard } from './project-preview-card';
import { usePopoverPlacement, type PopoverPlacement } from './use-popover-placement';

const CLOSE_DELAY_MS = 150;

function PopoverTail({ placement }: { placement: PopoverPlacement }) {
  return placement === 'top' ? (
    <div
      data-testid="popover-tail"
      aria-hidden="true"
      className="ml-6 h-0 w-0 border-x-[9px] border-t-[9px] border-x-transparent border-t-bg"
    />
  ) : (
    <div
      data-testid="popover-tail"
      aria-hidden="true"
      className="ml-6 h-0 w-0 border-x-[9px] border-b-[9px] border-x-transparent border-b-bg"
    />
  );
}

export function ProjectPreviewPopover({
  project,
  children,
  triggerClassName = '',
}: {
  project: Project;
  children: ReactNode;
  triggerClassName?: string;
}) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placement = usePopoverPlacement(triggerRef, visible);

  useEffect(() => {
    if (!visible) return;

    function dismiss() {
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
  }, [visible]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  function showPreview() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setVisible(true);
  }

  function schedulePreviewClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={showPreview}
      onMouseLeave={schedulePreviewClose}
      onFocusCapture={showPreview}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          schedulePreviewClose();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={showPreview}
        aria-expanded={visible}
        className={triggerClassName}
      >
        {children}
      </button>
      {visible && (
        <div
          onMouseEnter={showPreview}
          className={`absolute left-0 z-50 w-60 [filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))] ${
            placement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
          }`}
        >
          {placement === 'bottom' && <PopoverTail placement={placement} />}
          <ProjectPreviewCard project={project} elevated={false} />
          {placement === 'top' && <PopoverTail placement={placement} />}
        </div>
      )}
    </div>
  );
}
