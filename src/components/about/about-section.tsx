import { UserRound } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { aboutParagraphs } from '@/content/about';

export function AboutSection() {
  return (
    <section id="sobre" className="w-full scroll-mt-16 bg-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionTitle icon={UserRound}>Sobre mim</SectionTitle>
        <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-fg-muted">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
