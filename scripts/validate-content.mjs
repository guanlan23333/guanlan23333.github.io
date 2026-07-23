import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const projectDir = resolve('src/content/projects');
const files = (await readdir(projectDir)).filter((file) => /\.mdx?$/.test(file));
const required = ['title', 'slug', 'summary', 'status', 'featured', 'priority', 'role', 'startDate', 'lastUpdated', 'tags', 'problem', 'targetUsers', 'responsibilities', 'architecture', 'evaluation', 'draft'];
const slugs = new Set();
const errors = [];

for (const file of files) {
  const text = await readFile(resolve(projectDir, file), 'utf8');
  for (const field of required) if (!new RegExp(`^${field}:`, 'm').test(text)) errors.push(`${file}: 缺少 ${field}`);
  const slug = text.match(/^slug:\s*([a-z0-9-]+)\s*$/m)?.[1];
  if (slug && slugs.has(slug)) errors.push(`${file}: slug 重复 ${slug}`);
  if (slug) slugs.add(slug);
  for (const [, path] of text.matchAll(/^\s*-?\s*(\/images\/[^\s]+)$/gm)) {
    try { await access(resolve('public', path.slice(1)), constants.F_OK); } catch { errors.push(`${file}: 图片不存在 ${path}`); }
  }
  for (const [, url] of text.matchAll(/^(?:demoUrl|githubUrl|videoUrl):\s*(\S+)/gm)) {
    try { new URL(url); } catch { errors.push(`${file}: URL 无效 ${url}`); }
  }
}

if (errors.length) throw new Error(`内容检查失败：\n${errors.join('\n')}`);
console.log(`内容检查通过：${files.length} 个项目，slug 唯一，字段完整`);
