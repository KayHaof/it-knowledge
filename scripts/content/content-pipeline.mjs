import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const contentRoot = path.join(root, 'content');
const outputRoot = path.join(root, 'public', 'generated');
const required = ['id','slug','title','description','category','technology','level','estimatedMinutes','tags','prerequisites','learningObjectives','lastReviewed','sources'];
const levels = new Set(['beginner','intermediate','advanced','senior']);
const sourceTypes = new Set(['official-documentation','official-api-reference','specification','standard','internet-standard','best-current-practice','primary-vendor','primary-vendor-guidance','primary-vendor-whitepaper','security-guidance','secondary']);

export function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Thiếu frontmatter được bao bởi ---');
  const metadata = {};
  for (const raw of match[1].split(/\r?\n/)) {
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    const separator = raw.indexOf(':');
    if (separator < 1) throw new Error(`Metadata không hợp lệ: ${raw}`);
    const key = raw.slice(0, separator).trim();
    const value = raw.slice(separator + 1).trim();
    metadata[key] = parseValue(value);
  }
  return { metadata, markdown: match[2] };
}

function parseValue(value) {
  if (!value) return '';
  if (/^[\[{\"]/.test(value) || /^(true|false|null|-?\d+(\.\d+)?)$/.test(value)) {
    try { return JSON.parse(value); } catch { throw new Error(`Giá trị metadata phải là JSON hợp lệ: ${value}`); }
  }
  return value;
}

export function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const blocks = []; const headings = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^```([^\s]*)\s*(?:title="([^"]+)")?\s*$/);
    if (fence) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      if (i >= lines.length) throw new Error('Code fence chưa đóng');
      i++;
      if (fence[1] === 'mermaid') blocks.push({ type: 'diagram', code: code.join('\n') });
      else blocks.push({ type: 'code', language: fence[1] || 'text', title: fence[2] || '', code: code.join('\n') });
      continue;
    }
    const callout = line.match(/^:::(note|tip|info|warning|danger|best-practice|interview|production)\s*(.*)$/);
    if (callout) {
      const text = []; i++;
      while (i < lines.length && lines[i].trim() !== ':::') text.push(lines[i++].trim());
      if (i >= lines.length) throw new Error('Callout chưa đóng');
      i++; blocks.push({ type:'callout', kind:callout[1], title:callout[2] || callout[1].replace('-', ' '), text:text.join(' ') }); continue;
    }
    const heading = line.match(/^(##|###)\s+(.+)$/);
    if (heading) {
      const text = heading[2].trim(); const id = uniqueSlug(text, headings.map((item) => item.id)); const level = heading[1].length;
      const item = { id, text, level }; headings.push(item); blocks.push({ type:'heading', ...item }); i++; continue;
    }
    if (line.startsWith('|') && lines[i + 1]?.match(/^\|?[\s:|-]+\|/)) {
      const headers = tableCells(line); i += 2; const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(tableCells(lines[i++]));
      blocks.push({ type:'table', headers, rows }); continue;
    }
    const list = line.match(/^\s*(\d+\.|[-*])\s+(.+)$/);
    if (list) {
      const ordered = list[1].endsWith('.'); const items = [];
      while (i < lines.length) { const item = lines[i].match(/^\s*(\d+\.|[-*])\s+(.+)$/); if (!item || item[1].endsWith('.') !== ordered) break; items.push(item[2].trim()); i++; }
      blocks.push({ type:'list', ordered, items }); continue;
    }
    const paragraph = [line.trim()]; i++;
    while (i < lines.length && lines[i].trim() && !isStructural(lines, i)) paragraph.push(lines[i++].trim());
    blocks.push({ type:'paragraph', text:paragraph.join(' ') });
  }
  return { blocks, headings };
}

function isStructural(lines, index) { const value=lines[index]; return /^(##|###|```|:::|\s*(\d+\.|[-*])\s+)/.test(value) || (value.startsWith('|') && lines[index+1]?.match(/^\|?[\s:|-]+\|/)); }
function tableCells(line) { return line.replace(/^\||\|$/g,'').split('|').map((cell)=>cell.trim()); }
function slugify(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function uniqueSlug(text, used) { const base=slugify(text); let id=base; let index=2; while(used.includes(id)) id=`${base}-${index++}`; return id; }

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes:true }); const files=[];
  for (const entry of entries) { if (entry.name === 'interview' || entry.name.endsWith('.json')) continue; const target=path.join(directory,entry.name); if(entry.isDirectory())files.push(...await walk(target)); else if(entry.name.endsWith('.md'))files.push(target); }
  return files;
}

async function loadLessons() {
  const registry = JSON.parse(await fs.readFile(path.join(root,'content-sources','official-sources.json'),'utf8'));
  const domains = registry.flatMap((item)=>item.domains);
  const files = await walk(contentRoot); const lessons=[]; const errors=[];
  for (const file of files) {
    try {
      const { metadata, markdown } = parseFrontmatter(await fs.readFile(file,'utf8'));
      for (const key of required) if (metadata[key] === undefined || metadata[key] === '') errors.push(`${relative(file)}: thiếu ${key}`);
      if (!levels.has(metadata.level)) errors.push(`${relative(file)}: level không hợp lệ ${metadata.level}`);
      if (!Array.isArray(metadata.sources) || !metadata.sources.length) errors.push(`${relative(file)}: sources phải là mảng không rỗng`);
      for (const source of metadata.sources ?? []) {
        try { const host=new URL(source.url).hostname; if(!domains.some((domain)=>host===domain||host.endsWith(`.${domain}`))) errors.push(`${relative(file)}: source ngoài whitelist ${host}`); }
        catch { errors.push(`${relative(file)}: URL không hợp lệ ${source.url}`); }
        if(source.type&&!sourceTypes.has(source.type))errors.push(`${relative(file)}: source type không hợp lệ ${source.type}`);
      }
      const { blocks, headings } = parseMarkdown(markdown);
      const pathName = metadata.category === 'system-design' ? `/system-design/${metadata.slug}` : metadata.category === 'architecture' ? `/architecture/${metadata.slug}` : metadata.category === 'distributed-systems' ? `/distributed-systems/${metadata.slug}` : `/learn/${metadata.category}/${metadata.slug}`;
      const searchText = blocks.map((block)=>block.text ?? block.code ?? block.items?.join(' ') ?? block.rows?.flat().join(' ') ?? '').join(' ');
      lessons.push({ ...metadata, related:metadata.related??[], next:metadata.next??'', path:pathName, headings, blocks, searchText });
    } catch (error) { errors.push(`${relative(file)}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  const duplicate = (key) => lessons.map((item)=>item[key]).filter((value,index,all)=>all.indexOf(value)!==index);
  for (const id of new Set(duplicate('id'))) errors.push(`duplicate id: ${id}`);
  for (const slug of new Set(duplicate('slug'))) errors.push(`duplicate slug: ${slug}`);
  const ids = new Set(lessons.map((item)=>item.id));
  for (const lesson of lessons) for (const relation of [...lesson.prerequisites,...lesson.related,lesson.next].filter(Boolean)) if(!ids.has(relation)) errors.push(`${lesson.id}: relation không tồn tại ${relation}`);
  for (const lesson of lessons) for (const source of lesson.sources ?? []) {
    for (const field of ['title','url','organization','type','accessedAt']) if (!source[field]) errors.push(`${lesson.id}: source thiếu ${field}`);
  }
  await validateSupplemental(ids, new Set(lessons.map((item)=>item.path)), errors, domains);
  if (errors.length) throw new Error(`Content validation thất bại:\n- ${errors.join('\n- ')}`);
  return lessons.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
}

async function validateSupplemental(lessonIds, lessonPaths, errors, domains) {
  try {
    const questions=JSON.parse(await fs.readFile(path.join(contentRoot,'interview','questions.json'),'utf8'));
    const seen=new Set();
    for(const question of questions){
      for(const field of ['id','category','difficulty','question','answer30s','answer2m','production','wrongAnswer','followUps','relatedLesson']) if(!question[field])errors.push(`interview ${question.id??'?'}: thiếu ${field}`);
      if(seen.has(question.id))errors.push(`interview duplicate id: ${question.id}`);seen.add(question.id);
      if(question.relatedLesson&&!lessonPaths.has(question.relatedLesson))errors.push(`interview ${question.id}: relatedLesson không tồn tại ${question.relatedLesson}`);
      if(question.sources!==undefined&&!Array.isArray(question.sources))errors.push(`interview ${question.id}: sources phải là mảng`);
      for(const source of question.sources??[]){
        for(const field of ['title','url','organization','type','accessedAt'])if(!source[field])errors.push(`interview ${question.id}: source thiếu ${field}`);
        try{const host=new URL(source.url).hostname;if(!domains.some((domain)=>host===domain||host.endsWith(`.${domain}`)))errors.push(`interview ${question.id}: source ngoài whitelist ${host}`);}
        catch{errors.push(`interview ${question.id}: URL không hợp lệ ${source.url}`);}
        if(source.type&&!sourceTypes.has(source.type))errors.push(`interview ${question.id}: source type không hợp lệ ${source.type}`);
      }
    }
  }catch(error){errors.push(`content/interview/questions.json: ${error instanceof Error?error.message:String(error)}`);}
  try {
    const roadmaps=JSON.parse(await fs.readFile(path.join(contentRoot,'roadmaps.json'),'utf8')); const seen=new Set();
    for(const roadmap of roadmaps){
      if(!roadmap.id||!roadmap.title||!roadmap.description||!Array.isArray(roadmap.steps)||!roadmap.steps.length)errors.push(`roadmap ${roadmap.id??'?'}: schema không hợp lệ`);
      if(seen.has(roadmap.id))errors.push(`roadmap duplicate id: ${roadmap.id}`);seen.add(roadmap.id);
      for(const step of roadmap.steps??[])if(!lessonIds.has(step.lessonId))errors.push(`roadmap ${roadmap.id}: lessonId không tồn tại ${step.lessonId}`);
    }
  }catch(error){errors.push(`content/roadmaps.json: ${error instanceof Error?error.message:String(error)}`);}
}

async function build() {
  const lessons=await loadLessons(); await fs.mkdir(outputRoot,{recursive:true});
  await fs.writeFile(path.join(outputRoot,'lessons.json'),JSON.stringify(lessons));
  const index=lessons.map(({id,slug,title,description,category,technology,level,tags,headings,searchText,path})=>({id,slug,title,description,category,technology,level,tags,headings:headings.map((heading)=>heading.text),content:searchText,path}));
  await fs.writeFile(path.join(outputRoot,'search-index.json'),JSON.stringify(index));
  const questions=JSON.parse(await fs.readFile(path.join(contentRoot,'interview','questions.json'),'utf8'));
  const lessonByPath=new Map(lessons.map((lesson)=>[lesson.path,lesson]));
  const sourcedQuestions=questions.map((question)=>({
    ...question,
    sources:question.sources?.length?question.sources:(lessonByPath.get(question.relatedLesson)?.sources??[]),
  }));
  await fs.writeFile(path.join(outputRoot,'interview.json'),JSON.stringify(sourcedQuestions));
  await fs.copyFile(path.join(contentRoot,'roadmaps.json'),path.join(outputRoot,'roadmaps.json'));
  console.log(`Generated ${lessons.length} lessons and ${index.length} search documents.`);
}

async function checkLinks() {
  const lessons=await loadLessons();
  const questions=JSON.parse(await fs.readFile(path.join(contentRoot,'interview','questions.json'),'utf8'));
  const urls=[...new Set([
    ...lessons.flatMap((item)=>item.sources.map((source)=>source.url)),
    ...questions.flatMap((item)=>(item.sources??[]).map((source)=>source.url)),
  ])];
  const failures=[]; const blocked=[];
  for (const url of urls) {
    try {
      let response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(12000)});
      if(!response.ok&&[403,405].includes(response.status))response=await fetch(url,{method:'GET',redirect:'follow',headers:{'user-agent':'Mozilla/5.0 IT-Knowledge-Link-Checker'},signal:AbortSignal.timeout(12000)});
      if(response.status===403)blocked.push(url); else if(!response.ok)failures.push(`${response.status} ${url}`);
    } catch(error){failures.push(`${error instanceof Error?error.message:String(error)} ${url}`);}
  }
  if(failures.length) throw new Error(`Link check có ${failures.length} lỗi:\n${failures.join('\n')}`);
  if(blocked.length)console.warn(`Verified metadata nhưng host chặn automated request (403):\n${blocked.join('\n')}`);
  console.log(`Checked ${urls.length} source links.`);
}
function relative(file){return path.relative(root,file).replaceAll('\\','/');}

const mode=process.argv[2]??'build';
if(mode==='validate'){const lessons=await loadLessons();console.log(`Validated ${lessons.length} lessons: metadata, relations and source domains are valid.`);}
else if(mode==='check-links')await checkLinks(); else await build();
