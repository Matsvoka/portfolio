'use client';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useActiveSection } from './use-active-section';
import { MobileNav } from './mobile-nav';

export const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'formacao', label: 'Formação' },
  { id: 'projetos', label: 'Projetos' },
];

export const MOBILE_NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'skills', label: 'Skills' },
  { id: 'formacao', label: 'Formação' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'projetos', label: 'Projetos' },
];

const OBSERVED_SECTION_IDS = MOBILE_NAV_ITEMS.map((item) => item.id);
const DESKTOP_SECTION_ALIASES: Record<string, string> = {
  skills: 'experiencia',
  idiomas: 'formacao',
};

export function Header() {
  const activeId = useActiveSection(OBSERVED_SECTION_IDS);
  const desktopActiveId = DESKTOP_SECTION_ALIASES[activeId] ?? activeId;

  return (
    <header className="relative sticky top-0 z-40 border-b border-bg-dim bg-bg px-4 py-3">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <a href="#sobre" className="font-bold tracking-tight text-fg">
          VM
        </a>
        <nav aria-label="Navegação principal" className="hidden gap-4 text-base sm:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={desktopActiveId === item.id ? 'true' : undefined}
              className={
                desktopActiveId === item.id
                  ? 'border-b-2 border-lime pb-0.5 text-lime-deep dark:text-lime-bright'
                  : 'text-fg-muted hover:text-fg'
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span
            className="rounded border border-fg-muted px-1.5 py-0.5 font-mono text-sm text-fg-muted"
            aria-label="Idioma: Português (Brasil). Seletor de idioma ainda não implementado."
          >
            PT-BR ⌄
          </span>
          <MobileNav items={MOBILE_NAV_ITEMS} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
