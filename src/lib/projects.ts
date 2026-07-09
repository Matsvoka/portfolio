import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import { projectDetails } from '@/content/project-details';
import type { ProjectSummary, ProjectDetail } from '@/content/types';

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

export function getPersonalProjects(): ProjectSummary[] {
  return projects.filter((project) => isPersonalProject(project.slug));
}

export function getProjectSummaryBySlug(slug: string): ProjectSummary | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return projectDetails[slug];
}
