import { Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/social-icons';
import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-bg-dim px-4 py-10 text-center">
      <a
        href={profile.resumeUrl}
        download
        className="flex items-center gap-1.5 rounded bg-lime px-4 py-2 text-sm font-semibold text-ink dark:text-coal"
      >
        <Download size={14} aria-hidden="true" />
        Download CV (PDF)
      </a>
      <div className="flex items-center gap-3.5 text-fg-muted">
        <a
          href={`mailto:${profile.email}`}
          aria-label="Enviar email"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Mail size={18} aria-hidden="true" />
        </a>
        <a
          href={profile.github}
          aria-label="Abrir GitHub"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <GithubIcon size={18} />
        </a>
        <a
          href={profile.linkedin}
          aria-label="Abrir LinkedIn"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <LinkedinIcon size={18} />
        </a>
      </div>
      <p className="font-mono text-[10px] text-fg-muted">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
