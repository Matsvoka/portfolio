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

const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.id);
const NAV_SECTION_ALIASES = {
  skills: 'experiencia',
  idiomas: 'formacao',
};

export function Header() {
  const activeId = useActiveSection(NAV_SECTION_IDS, NAV_SECTION_ALIASES);

  return (
    <header className="relative sticky top-0 z-40 border-b border-bg-dim bg-bg px-4 py-3">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <a href="#sobre" className="font-bold tracking-tight text-fg">
          VM
        </a>
        <nav aria-label="Navegação principal" className="hidden gap-4 text-sm sm:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={
                activeId === item.id
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
            className="rounded border border-fg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
            aria-label="Idioma: Português (Brasil). Seletor de idioma ainda não implementado."
          >
            PT-BR ⌄
          </span>
          <MobileNav items={NAV_ITEMS} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
