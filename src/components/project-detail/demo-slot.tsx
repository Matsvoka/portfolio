import type { ProjectDemo } from '@/content/types';

export function DemoSlot({ demo }: { demo: ProjectDemo }) {
  if (demo.type === 'none') return null;

  if (demo.type === 'video') {
    return (
      <video controls className="w-full rounded-md bg-bg-dim">
        <source src={demo.src} />
      </video>
    );
  }

  return <img src={demo.src} alt="Demonstração do projeto" className="w-full rounded-md" />;
}
