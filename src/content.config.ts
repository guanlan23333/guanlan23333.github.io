import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['idea', 'planning', 'development', 'alpha', 'testing', 'released', 'archived']);
const url = z.url().optional();

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    summary: z.string(),
    status,
    featured: z.boolean(),
    priority: z.number().int().nonnegative(),
    role: z.string(),
    startDate: z.coerce.date(),
    lastUpdated: z.coerce.date(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).min(1),
    problem: z.string(),
    targetUsers: z.array(z.string()).min(1),
    responsibilities: z.array(z.string()).min(1),
    keyDecisions: z.array(z.string()).default([]),
    architecture: z.string(),
    evaluation: z.string(),
    results: z.array(z.string()).default([]),
    badCases: z.array(z.string()).default([]),
    nextSteps: z.array(z.string()).default([]),
    demoUrl: url,
    githubUrl: url,
    videoUrl: url,
    draft: z.boolean(),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    project: z.string().regex(/^[a-z0-9-]+$/),
    date: z.coerce.date(),
    summary: z.string(),
    evidence: z.array(z.string()).default([]),
    draft: z.boolean(),
  }),
});

export const collections = { projects, updates };
