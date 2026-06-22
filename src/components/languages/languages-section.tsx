import { Languages as LanguagesIcon } from 'lucide-react';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { SectionTitle } from '@/components/shared/section-title';
import { languages } from '@/content/languages';

export function LanguagesSection() {
  return (
    <section id="idiomas" className="scroll-mt-16 px-4 py-12 lg:pl-8">
      <SectionTitle icon={LanguagesIcon}>Idiomas</SectionTitle>
      <ul className="flex flex-col gap-6">
        {languages.map((language) => (
          <li key={language.name} className="flex gap-3.5">
            <EntryLogoPlaceholder label="ícone" />
            <div>
              <p className="text-[17px] font-bold leading-tight tracking-tight text-fg">
                {language.name}
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">
                {language.proficiency}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
