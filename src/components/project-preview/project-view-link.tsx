import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ProjectViewLink({ slug, title }: { slug: string; title: string }) {
  return (
    <Link
      href={`/projetos/${slug}`}
      aria-label={`Ver detalhes do projeto ${title}`}
      className="ui-text-meta inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
    >
      <span>Ver</span>
      <ArrowRight className="ui-icon-inline" aria-hidden="true" />
    </Link>
  );
}
