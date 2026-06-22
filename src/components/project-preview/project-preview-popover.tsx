'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Project } from '@/content/types';
import { ProjectPreviewCard } from './project-preview-card';
import { usePopoverPlacement, type PopoverPlacement } from './use-popover-placement';

const CLOSE_DELAY_MS = 150;
const HOVER_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const PREVIEW_OPEN_EVENT = 'project-preview:open';

function supportsHoverPointer(): boolean {
  return window.matchMedia?.(HOVER_POINTER_QUERY).matches ?? false;
}

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
  const [pinned, setPinned] = useState(false);
  const previewId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placement = usePopoverPlacement(triggerRef, visible);

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

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    function closeWhenAnotherPreviewOpens(event: Event) {
      if ((event as CustomEvent<string>).detail === previewId) return;
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setPinned(false);
      setVisible(false);
    }

    window.addEventListener(PREVIEW_OPEN_EVENT, closeWhenAnotherPreviewOpens);
    return () => window.removeEventListener(PREVIEW_OPEN_EVENT, closeWhenAnotherPreviewOpens);
  }, [previewId]);

  function showPreview() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    window.dispatchEvent(new CustomEvent<string>(PREVIEW_OPEN_EVENT, { detail: previewId }));
    setVisible(true);
  }

  function schedulePreviewClose() {
    if (pinned) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }

  function handleTriggerClick() {
    if (supportsHoverPointer()) {
      return;
    }

    const nextPinned = !pinned;
    setPinned(nextPinned);
    setVisible(nextPinned);
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={showPreview}
      onMouseLeave={schedulePreviewClose}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={visible}
        data-pinned={pinned}
        data-preview-active={visible}
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
