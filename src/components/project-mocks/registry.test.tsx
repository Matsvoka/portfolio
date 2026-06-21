import { describe, it, expect } from 'vitest';
import { getMockComponent } from './registry';

describe('getMockComponent', () => {
  it('resolves the doctag and graphit keys', () => {
    expect(getMockComponent('doctag')).toBeDefined();
    expect(getMockComponent('graphit')).toBeDefined();
  });

  it('returns undefined for an unregistered key', () => {
    expect(getMockComponent('not-a-real-mock')).toBeUndefined();
  });
});
