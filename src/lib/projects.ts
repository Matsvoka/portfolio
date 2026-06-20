import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import type { Project } from '@/content/types';

function getLinkedProjectSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const entry of experience) {
    for (const slug of entry.projectSlugs ?? []) {
      slugs.add(slug);
    }
  }
  return slugs;
}

export function isPersonalProject(slug: string): boolean {
  return !getLinkedProjectSlugs().has(slug);
}

export function getPersonalProjects(): Project[] {
  return projects.filter((project) => isPersonalProject(project.slug));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
