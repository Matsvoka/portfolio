import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/social-icons';
import { profile } from '@/content/profile';

export function Hero() {
  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <div
        className="ui-text-hero-placeholder flex h-[200px] w-[200px] items-center justify-center rounded-full border-4 border-lime bg-bg-dim font-mono text-fg-muted"
        aria-hidden="true"
      >
        foto
      </div>
      <h1 className="ui-text-hero-title mt-9 font-black tracking-tight text-fg">{profile.name}</h1>
      <p className="ui-text-body mt-1.5 font-mono uppercase tracking-wide text-lime-deep dark:text-lime-bright">
        {profile.role}
      </p>
      <div className="mt-2 flex items-center gap-3.5 text-fg-muted">
        <a
          href={`mailto:${profile.email}`}
          aria-label="Enviar email"
          className="inline-flex cursor-pointer transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <Mail className="ui-icon-social" aria-hidden="true" />
        </a>
        <a
          href={profile.github}
          aria-label="Abrir GitHub"
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <GithubIcon className="ui-icon-social" />
        </a>
        <a
          href={profile.linkedin}
          aria-label="Abrir LinkedIn"
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <LinkedinIcon className="ui-icon-social" />
        </a>
      </div>
    </section>
  );
}
