'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type NavItem = { id: string; label: string };

export function MobileNav({ items, activeId }: { items: NavItem[]; activeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="p-1.5 text-fg"
      >
        {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
      </button>
      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Navegação principal"
          className="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-bg-dim bg-bg px-4 py-3 text-base"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={activeId === item.id ? 'text-lime-deep dark:text-lime-bright' : 'text-fg-muted'}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
