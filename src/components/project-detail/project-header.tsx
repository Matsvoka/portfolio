import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/social-icons';
import type { Project } from '@/content/types';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="mb-6">
      <h1 className="text-[27px] font-bold text-fg">{project.title}</h1>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded bg-lime-soft px-3 py-1 text-[12px] text-lime-deep">
            {tag}
          </span>
        ))}
      </div>
      {project.links && (
        <div className="mt-3 flex gap-4 text-[15px] text-fg-muted">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <GithubIcon size={16} /> Repositório
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <ExternalLink size={16} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      )}
    </header>
  );
}
