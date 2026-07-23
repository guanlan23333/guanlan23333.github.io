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

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.split('#')[0].split('?')[0];
    const target = path.endsWith('/') ? resolve(dist, `.${path}index.html`) : resolve(dist, `.${path}`);
    try { await access(target, constants.F_OK); } catch { errors.push(`${file}: 内部链接不存在 ${href}`); }
  }
}

const home = await readFile(resolve(dist, 'index.html'), 'utf8');
for (const text of ['查看代表项目', '查看公开简历', 'SecondBrain Desktop', 'MerchantOps Copilot']) {
  if (!home.includes(text)) errors.push(`首页缺少关键内容：${text}`);
}
if (htmlFiles.some((file) => file.includes('draft'))) errors.push('生产构建包含草稿页面');

if (errors.length) throw new Error(`构建检查失败：\n${errors.join('\n')}`);
console.log(`构建检查通过：${htmlFiles.length} 个页面，内部链接与首页 CTA 有效`);
