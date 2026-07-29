import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(resolve(dir, entry.name)) : resolve(dir, entry.name)))).flat();
}

const dist = resolve('dist');
const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function localTarget(path) {
  const clean = path.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return resolve(dist, 'index.html');
  return clean.endsWith('/') ? resolve(dist, `.${clean}index.html`) : resolve(dist, `.${clean}`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    if (!(await exists(localTarget(value)))) errors.push(`${file}: ${attr} 指向的本地资源不存在 ${value}`);
  }
}

const home = await readFile(resolve(dist, 'index.html'), 'utf8');
for (const text of ['查看代表项目', '查看公开简历', 'SecondBrain Desktop', 'MerchantOps Copilot']) {
  if (!home.includes(text)) errors.push(`首页缺少关键内容：${text}`);
}
if (htmlFiles.some((file) => file.includes('draft'))) errors.push('生产构建包含草稿页面');
if (!(await exists(resolve(dist, '404.html')))) errors.push('生产构建缺少 EdgeOne/GitHub Pages 可识别的 404.html');
for (const path of ['projects/index.html', 'resume/index.html', 'favicon.svg', 'og-image.png']) {
  if (!(await exists(resolve(dist, path)))) errors.push(`生产构建缺少 ${path}`);
}

if (errors.length) throw new Error(`构建检查失败：\n${errors.join('\n')}`);
console.log(`构建检查通过：${htmlFiles.length} 个页面，内部链接、静态资源、404 与首页 CTA 有效`);
