import type { Project } from '@/content/types';
import { getMockComponent } from '@/components/project-mocks/registry';

export function DemoSlot({ demo }: { demo: Project['demo'] }) {
  if (demo.type === 'none') return null;

  if (demo.type === 'mock') {
    const MockComponent = getMockComponent(demo.component);
    return MockComponent ? <MockComponent /> : null;
  }

  if (demo.type === 'video') {
    return (
      <video controls className="w-full rounded-md bg-bg-dim">
        <source src={demo.src} />
      </video>
    );
  }

  return <img src={demo.src} alt="Demonstração do projeto" className="w-full rounded-md" />;
}
