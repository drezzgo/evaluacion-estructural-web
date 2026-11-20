// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { projectCanonical } from './src/lib/project-canonicals.mjs';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.evaluacionestructural.com',
  integrations: [mdx(), sitemap({
    filter(page) {
      const [section, slug] = new URL(page).pathname.split('/').filter(Boolean);
      if (section === 'prototype' || section === 'simulador') return false;
      return section !== 'proyectos' || !slug || !projectCanonical(slug);
    },
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
