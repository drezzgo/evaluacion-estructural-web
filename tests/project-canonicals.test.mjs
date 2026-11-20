import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { duplicatedProjectSlugs, projectCanonical } from '../src/lib/project-canonicals.mjs';

test('project aliases point to blog guides with identical source content', () => {
  const projects = new URL('../src/content/proyectos/', import.meta.url);
  const blog = new URL('../src/content/blog/', import.meta.url);
  for (const slug of duplicatedProjectSlugs) {
    const file = readdirSync(projects).find((name) => name.replace(/\.mdx?$/, '') === slug);
    assert(file, slug);
    assert.deepEqual(readFileSync(new URL(file, projects)), readFileSync(new URL(file, blog)), slug);
    assert.equal(projectCanonical(slug), '/blog/' + slug + '/');
  }
  assert.equal(projectCanonical('proyecto-propio'), undefined);
});
