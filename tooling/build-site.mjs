import {mkdir,cp,readFile,rm,writeFile} from 'node:fs/promises';
const config=JSON.parse(await readFile('data/sanity-config.json','utf8'));
if(!/^[a-z0-9]+$/.test(config.projectId))throw new Error('Set a real Sanity projectId in data/sanity-config.json before building.');
await rm('dist',{recursive:true,force:true});await mkdir('dist/data',{recursive:true});
const files=['index.html','Home.dc.html','About.dc.html','Service.dc.html','Service-CEREC-Crowns.dc.html','Service-Root-Canal.dc.html','admin.html','robots.txt','assets','styles','scripts'];
for(const file of files)await cp(file,`dist/${file}`,{recursive:true});
await writeFile('dist/data/sanity-config.json',JSON.stringify(config));
// Common static hosts: route Studio deep links back to its SPA entry point.
await writeFile('dist/_redirects','/studio/* /studio/index.html 200\n');
console.log('Public website built. No credentials or migration tooling copied.');
