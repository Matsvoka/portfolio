import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero/hero';
import { AboutSection } from '@/components/about/about-section';
import { ExperienceSkillsGrid } from '@/components/home/experience-skills-grid';
import { ProjectsSection } from '@/components/projects/projects-section';
import { Footer } from '@/components/footer/footer';

export default function Page() {
  return (
    <>
      <Header />
      <main className="bg-bg-dim">
        <div className="mx-auto w-full max-w-6xl">
          <Hero />
        </div>
        <AboutSection />
        <div className="mx-auto w-full max-w-6xl">
          <ExperienceSkillsGrid />
          <div className="px-4 py-12">
            <ProjectsSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
