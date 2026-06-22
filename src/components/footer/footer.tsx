import { Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/social-icons';
import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="border-t border-bg-dim bg-bg px-4 py-10 text-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4">
      <a
        href={profile.resumeUrl}
        download
        className="ui-text-body flex items-center gap-1.5 rounded bg-lime px-4 py-2 font-semibold text-ink dark:text-coal"
      >
        <Download className="ui-icon-inline" aria-hidden="true" />
        Download CV (PDF)
      </a>
      <div className="flex items-center gap-3.5 text-fg-muted">
        <a
          href={`mailto:${profile.email}`}
          aria-label="Enviar email"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Mail className="ui-icon-social" aria-hidden="true" />
        </a>
        <a
          href={profile.github}
          aria-label="Abrir GitHub"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <GithubIcon className="ui-icon-social" />
        </a>
        <a
          href={profile.linkedin}
          aria-label="Abrir LinkedIn"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <LinkedinIcon className="ui-icon-social" />
        </a>
      </div>
      <p className="ui-text-label font-mono text-fg-muted">
        © {new Date().getFullYear()} {profile.name}
      </p>
      </div>
    </footer>
  );
}
