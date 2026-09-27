import {getCliClient} from 'sanity/cli';
import {createReadStream} from 'node:fs';
import {readFile as read} from 'node:fs/promises';
import path from 'node:path';
const client=getCliClient({apiVersion:'2026-09-01'}).withConfig({useCdn:false});
const content=JSON.parse(await read('migration/existing-content.json','utf8'));
const settings=JSON.parse(await read('migration/settings.json','utf8'));
async function image(file,alt){const asset=await client.assets.upload('image',createReadStream(file),{filename:path.basename(file)});return {_type:'image',asset:{_type:'reference',_ref:asset._id},alt}}
const keyed=values=>(values||[]).map((v,i)=>({...v,_key:`item${i}`}));
for(const p of content.staff){
 const _id=`staff-${p.id}`;if(await client.getDocument(_id)){console.log(`Keeping existing ${p.name}`);continue}
 const {id,photo,...fields}=p;
 await client.createIfNotExists({_id,_type:'staff',...fields,photo:await image(photo,`${p.name}, ${p.role}`)});
 console.log(`Imported ${p.name}`);
}
for(const s of content.services){
 const _id=`service-${s.id}`;if(await client.getDocument(_id)){console.log(`Keeping existing ${s.title}`);continue}
 const p=s.page||{};const {image:file,imageAlt,...pageFields}=p;
 await client.createIfNotExists({_id,_type:'service',title:s.title,slug:{_type:'slug',current:s.id},legacyUrl:s.legacyUrl,order:s.order,visible:s.visible,hasPage:s.hasExistingPage,...pageFields,sections:keyed(p.sections).map(section=>({...section,cards:keyed(section.cards)})),...(file?{image:await image(file,imageAlt)}:{})});
 console.log(`Imported ${s.title}`);
}
if(!await client.getDocument('siteSettings')){
 const {heroImage,heroImageAlt,practiceImage,practiceImageAlt,...fields}=settings;
 await client.createIfNotExists({_id:'siteSettings',_type:'siteSettings',...fields,faqs:keyed(fields.faqs),heroImage:await image(heroImage,heroImageAlt),practiceImage:await image(practiceImage,practiceImageAlt)});
 console.log('Imported practice settings');
}
console.log('Import complete. Existing documents were not overwritten.');
