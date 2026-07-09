import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { projectDetails } from '@/content/project-details';
import { getProjectDetail } from '@/lib/projects';
import { ProjectHeader } from '@/components/project-detail/project-header';
import { DemoSlot } from '@/components/project-detail/demo-slot';

export function generateStaticParams() {
  return Object.keys(projectDetails).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/"
        className="ui-text-body mb-8 inline-flex cursor-pointer items-center gap-1.5 font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-95 dark:hover:text-lime-bright"
      >
        <ArrowLeft className="ui-icon-control" aria-hidden="true" />
        <span>Voltar</span>
      </Link>
      <ProjectHeader project={project} />
      {project.sections.map((block, index) =>
        block.type === 'paragraph' ? (
          <p key={index} className="ui-text-body mb-4 text-fg-muted">
            {block.text}
          </p>
        ) : (
          <div key={index} className="mb-4">
            <DemoSlot demo={block.demo} />
          </div>
        ),
      )}
    </main>
  );
}
