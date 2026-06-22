import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/social-icons';
import type { Project } from '@/content/types';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="mb-6">
      <h1 className="ui-text-heading font-bold text-fg">{project.title}</h1>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="ui-chip ui-text-label rounded bg-lime-soft text-lime-deep">
            {tag}
          </span>
        ))}
      </div>
      {project.links && (
        <div className="ui-text-body mt-3 flex gap-4 text-fg-muted">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <GithubIcon className="ui-icon-inline" /> Repositório
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <ExternalLink className="ui-icon-inline" aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      )}
    </header>
  );
}
