'use client';

import { useEffect, useState } from 'react';

const UI_SIZES = ['original', 'subtle', 'large'] as const;
type UiSize = (typeof UI_SIZES)[number];

const LABELS: Record<UiSize, string> = {
  original: 'Original',
  subtle: 'Sutil',
  large: 'Maior',
};

function isUiSize(value: string | null): value is UiSize {
  return UI_SIZES.some((size) => size === value);
}

function readUiSize(): UiSize {
  const current = document.documentElement.dataset.uiSize ?? null;
  return isUiSize(current) ? current : 'original';
}

export function UiSizeSelector() {
  const [size, setSize] = useState<UiSize>('original');

  useEffect(() => {
    setSize(readUiSize());
  }, []);

  function selectSize(nextSize: UiSize) {
    setSize(nextSize);
    document.documentElement.dataset.uiSize = nextSize;
    window.sessionStorage.setItem('ui-size', nextSize);

    const url = new URL(window.location.href);
    url.searchParams.set('size', nextSize);
    window.history.replaceState({}, '', url);
    window.dispatchEvent(new Event('resize'));
  }

  return (
    <select
      aria-label="Tamanho da interface"
      value={size}
      onChange={(event) => selectSize(event.target.value as UiSize)}
      className="max-w-24 rounded border border-fg-muted bg-bg px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
    >
      {UI_SIZES.map((option) => (
        <option key={option} value={option}>
          {LABELS[option]}
        </option>
      ))}
    </select>
  );
}
