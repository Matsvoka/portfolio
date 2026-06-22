import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

function LoadingPlaceholder() {
  return (
    <div className="ui-text-hero-placeholder flex h-48 items-center justify-center rounded-md bg-bg-dim font-mono text-fg-muted">
      carregando demo…
    </div>
  );
}

const MOCK_REGISTRY: Record<string, ComponentType> = {
  doctag: dynamic(() => import('./doctag').then((mod) => mod.DoctagMock), {
    loading: LoadingPlaceholder,
  }),
  graphit: dynamic(() => import('./graphit').then((mod) => mod.GraphItMock), {
    loading: LoadingPlaceholder,
  }),
};

export function getMockComponent(key: string): ComponentType | undefined {
  return MOCK_REGISTRY[key];
}
