import { describe, it, expect } from 'vitest';
import { isPersonalProject, getPersonalProjects, getProjectBySlug } from './projects';

describe('isPersonalProject', () => {
  it('returns false for a project linked to an experience entry', () => {
    expect(isPersonalProject('hcp-app')).toBe(false);
  });

  it('returns true for a project not linked to any experience entry', () => {
    expect(isPersonalProject('doctag')).toBe(true);
  });
});

describe('getPersonalProjects', () => {
  it('excludes projects linked to experience entries', () => {
    const slugs = getPersonalProjects().map((p) => p.slug);
    expect(slugs).toContain('doctag');
    expect(slugs).toContain('graphit');
    expect(slugs).not.toContain('hcp-app');
  });
});

describe('getProjectBySlug', () => {
  it('finds a project by slug', () => {
    expect(getProjectBySlug('doctag')?.title).toBe('Doctag');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('nonexistent-slug')).toBeUndefined();
  });
});
