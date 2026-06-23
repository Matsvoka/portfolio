import { Languages as LanguagesIcon } from 'lucide-react';
import { BR, JP, KR, US } from 'country-flag-icons/react/3x2';
import { SectionTitle } from '@/components/shared/section-title';
import { languages } from '@/content/languages';
import type { LanguageEntry } from '@/content/languages';

const flagIcons = {
  BR,
  US,
  KR,
  JP,
};

function LanguageFlag({ language }: { language: LanguageEntry }) {
  const FlagIcon = flagIcons[language.countryCode];

  return (
    <FlagIcon
      aria-hidden="true"
      className="h-7 w-10 shrink-0 overflow-hidden rounded object-cover shadow-sm ring-1 ring-fg/10"
      data-testid={`language-flag-${language.countryCode}`}
    />
  );
}

export function LanguagesSection() {
  return (
    <section id="idiomas" className="scroll-mt-16 px-4 py-12 lg:pl-8">
      <div
        data-testid="languages-card"
        className="rounded-lg border border-white/45 bg-zinc-200/45 p-4 shadow-xl shadow-coal/15 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/25 dark:border-white/10 dark:bg-zinc-800/45 dark:shadow-black/35 dark:ring-white/10"
      >
        <SectionTitle icon={LanguagesIcon}>Idiomas</SectionTitle>
        <ul className="flex flex-col gap-4">
          {languages.map((language) => (
            <li key={language.name} className="flex items-center gap-3">
              <LanguageFlag language={language} />
              <p className="ui-text-entry-title font-bold leading-tight tracking-tight text-fg">
                <span>{language.name}</span>{' '}
                <span className="ui-text-body font-semibold tracking-normal text-fg-muted">
                  ({language.proficiency})
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
