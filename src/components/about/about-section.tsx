import { aboutParagraphs } from '@/content/about';

export function AboutSection() {
  return (
    <section id="sobre" className="scroll-mt-16 px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-fg">Sobre mim</h2>
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-fg-muted">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
