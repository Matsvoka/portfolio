import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
      <Link
        href="/"
        className="mb-8 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-95 dark:hover:text-lime-bright"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Voltar</span>
      </Link>
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
