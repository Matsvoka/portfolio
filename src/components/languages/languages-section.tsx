import { Languages as LanguagesIcon } from 'lucide-react';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { SectionTitle } from '@/components/shared/section-title';
import { languages } from '@/content/languages';

export function LanguagesSection() {
  return (
    <section id="idiomas" className="scroll-mt-16 px-4 py-12 lg:pl-8">
      <SectionTitle icon={LanguagesIcon}>Idiomas</SectionTitle>
      <ul className="flex flex-col gap-4">
        {languages.map((language) => (
          <li key={language.name} className="flex items-center gap-3">
            <EntryLogoPlaceholder label="bandeira" variant="flag" />
            <p className="text-[20px] font-bold leading-tight tracking-tight text-fg">
              <span>{language.name}</span>{' '}
              <span className="text-[15px] font-semibold tracking-normal text-fg-muted">
                ({language.proficiency})
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
