import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2026-09-01'});
let transaction=client.transaction();
for(const id of ['siteSettings','drafts.siteSettings']){
 const doc=await client.getDocument(id);if(!doc)continue;
 const heritageText=(doc.heritageText||'').replace(/\b129(?= years)/g,'{years}');
 transaction=transaction.patch(id,p=>p.ifRevisionId(doc._rev).set({heritageStartYear:1897,heritageText}).unset(['heritageYears']));
}
await transaction.commit();console.log('Anniversary now uses a starting year and a dynamic {years} text placeholder.');
