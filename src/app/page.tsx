import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero/hero';
import { ExperienceSection } from '@/components/experience/experience-section';
import { ProjectsSkillsGrid } from '@/components/home/projects-skills-grid';
import { Footer } from '@/components/footer/footer';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ExperienceSection />
        <ProjectsSkillsGrid />
      </main>
      <Footer />
    </>
  );
}
