import { languages } from '@/content/languages';

export function LanguagesSection() {
  return (
    <section id="idiomas" className="scroll-mt-16">
      <h2 className="mb-6 text-2xl font-bold text-fg">Idiomas</h2>
      <ul className="flex flex-col gap-6">
        {languages.map((language) => (
          <li key={language.name}>
            <p className="text-[17px] font-bold leading-tight tracking-tight text-fg">
              {language.name}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">
              {language.proficiency}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
