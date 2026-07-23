import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(resolve(dir, entry.name)) : resolve(dir, entry.name)));
  return nested.flat();
}

const roots = ['src/content', 'public'];
const files = (await Promise.all(roots.map(async (root) => { try { return await walk(resolve(root)); } catch { return []; } }))).flat();
const rules = [
  ['疑似 API Key', /(?:sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})/],
  ['疑似私钥', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['疑似手机号', /(?<!\d)1[3-9]\d{9}(?!\d)/],
  ['疑似身份证号', /(?<!\d)\d{17}[\dXx](?!\d)/],
  ['本地绝对路径', /[A-Za-z]:\\(?:Users|个人|Projects|Codex)\\/],
];
const hits = [];

for (const file of files.filter((file) => /\.(?:md|mdx|txt|json|ts|js|html|css)$/i.test(file))) {
  const text = await readFile(file, 'utf8');
  for (const [name, pattern] of rules) if (pattern.test(text)) hits.push(`${file}: ${name}`);
}

if (hits.length) throw new Error(`隐私检查失败：\n${hits.join('\n')}`);
console.log(`隐私检查通过：扫描 ${files.length} 个公开内容文件`);
