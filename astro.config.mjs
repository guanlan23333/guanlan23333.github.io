import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://guanlan23333.github.io',
  output: 'static',
  integrations: [mdx(), sitemap()],
});
