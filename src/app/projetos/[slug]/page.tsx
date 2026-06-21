import { notFound } from 'next/navigation';
import { projects } from '@/content/projects';
import { getProjectBySlug } from '@/lib/projects';
import { splitNarrativeAtDemoIndex } from '@/lib/narrative';
import { ProjectHeader } from '@/components/project-detail/project-header';
import { DemoSlot } from '@/components/project-detail/demo-slot';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { before, after } = splitNarrativeAtDemoIndex(project.narrative, project.demoIndex);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <ProjectHeader project={project} />
      {before.map((paragraph, index) => (
        <p key={index} className="mb-4 text-sm text-fg-muted">
          {paragraph}
        </p>
      ))}
      <div className="mb-4">
        <DemoSlot demo={project.demo} />
      </div>
      {after.map((paragraph, index) => (
        <p key={index} className="mb-4 text-sm text-fg-muted">
          {paragraph}
        </p>
      ))}
    </main>
  );
}
