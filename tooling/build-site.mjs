import {createHash} from 'node:crypto';
import {mkdir,cp,readFile,rm,writeFile,readdir} from 'node:fs/promises';
const config=JSON.parse(await readFile('data/sanity-config.json','utf8'));
if(!/^[a-z0-9]+$/.test(config.projectId))throw new Error('Set a real Sanity projectId in data/sanity-config.json before building.');
await rm('dist',{recursive:true,force:true});await mkdir('dist/data',{recursive:true});
const files=['index.html','Home.dc.html','About.dc.html','Service.dc.html','Service-CEREC-Crowns.dc.html','Service-Root-Canal.dc.html','admin.html','robots.txt','assets','styles','scripts'];
for(const file of files)await cp(file,`dist/${file}`,{recursive:true});
await writeFile('dist/data/sanity-config.json',JSON.stringify(config));
// Version the entire public module graph so returning Pages visitors do not
// retain old imports after a deployment (Pages caches assets for several minutes).
const assetFiles=[];
for(const folder of ['scripts','styles'])for(const name of (await readdir(folder)).sort())assetFiles.push(`${folder}/${name}`);
const digest=createHash('sha256');
for(const file of assetFiles)digest.update(await readFile(file));
const version=digest.digest('hex').slice(0,12);
for(const file of assetFiles.filter(file=>file.endsWith('.js'))){
 const source=await readFile(file,'utf8');
 await writeFile(`dist/${file}`,source.replace(/(['"])(\.\/[^'"\s]+\.js)\1/g,(_,quote,url)=>`${quote}${url}?v=${version}${quote}`));
}
for(const file of files.filter(file=>file.endsWith('.html'))){
 const source=await readFile(`dist/${file}`,'utf8');
 await writeFile(`dist/${file}`,source.replace(/((?:src|href)=["'])((?:scripts|styles)\/[^"']+\.(?:js|css))(["'])/g,`$1$2?v=${version}$3`));
}

// Common static hosts: route Studio deep links back to its SPA entry point.
await writeFile('dist/_redirects','/studio/* /studio/index.html 200\n');
console.log('Public website built. No credentials or migration tooling copied.');
