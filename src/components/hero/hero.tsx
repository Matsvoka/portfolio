import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/social-icons';
import { profile } from '@/content/profile';

export function Hero() {
  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <div
        className="flex h-[200px] w-[200px] items-center justify-center rounded-full border-4 border-lime bg-bg-dim font-mono text-xs text-fg-muted"
        aria-hidden="true"
      >
        foto
      </div>
      <h1 className="mt-9 text-4xl font-black tracking-tight text-fg">{profile.name}</h1>
      <p className="mt-1.5 font-mono text-sm uppercase tracking-wide text-lime-deep dark:text-lime-bright">
        {profile.role}
      </p>
      <div className="mt-2 flex items-center gap-3.5 text-fg-muted">
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
    </section>
  );
}
