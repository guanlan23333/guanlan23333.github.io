import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';

const kind = process.argv[2];
if (!['project', 'update'].includes(kind)) throw new Error('用法：npm run new:project 或 npm run new:update');

const io = createInterface({ input: process.stdin, output: process.stdout });
const title = (await io.question('标题：')).trim();
const slug = (await io.question('slug（小写英文与连字符）：')).trim();
io.close();

if (!title || !/^[a-z0-9-]+$/.test(slug)) throw new Error('标题不能为空，slug 只能包含小写英文、数字与连字符');

const date = new Date().toISOString().slice(0, 10);
const dir = resolve(kind === 'project' ? 'src/content/projects' : 'src/content/updates');
const file = resolve(dir, kind === 'project' ? `${slug}.md` : `${date}-${slug}.md`);
await mkdir(dir, { recursive: true });
try { await access(file, constants.F_OK); throw new Error(`文件已存在：${file}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }

const project = `---\ntitle: ${title}\nslug: ${slug}\nsummary: TODO\nstatus: planning\nfeatured: false\npriority: 99\nrole: 独立产品设计与开发\nstartDate: ${date}\nlastUpdated: ${date}\ngallery: []\ntags:\n  - TODO\nproblem: TODO\ntargetUsers:\n  - TODO\nresponsibilities:\n  - TODO\nkeyDecisions: []\narchitecture: TODO\nevaluation: 尚未验证\nresults: []\nbadCases: []\nnextSteps: []\ndraft: true\n---\n\n## 30 秒摘要\n\nTODO\n`;
const update = `---\ntitle: ${title}\nproject: ${slug}\ndate: ${date}\nsummary: TODO\nevidence: []\ndraft: true\n---\n\n## 做了什么\n\nTODO\n\n## 验证与已知问题\n\nTODO\n`;
await writeFile(file, kind === 'project' ? project : update, 'utf8');
console.log(`已创建：${file}`);
