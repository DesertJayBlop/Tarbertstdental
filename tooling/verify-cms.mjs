import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {getCliClient} from 'sanity/cli';
import {createClient} from '@sanity/client';
import config from '../data/sanity-config.json' with {type:'json'};
const editor=getCliClient({apiVersion:config.apiVersion}).withConfig({useCdn:false});
const publicClient=createClient({...config,useCdn:false,perspective:'published'});
const id=`verification-${randomUUID()}`;
const query='*[_id == $id][0]';
async function eventually(check){for(let i=0;i<20;i++){if(await check())return;await new Promise(r=>setTimeout(r,500))}throw new Error('Published content did not reach the public API')}
try{
 await editor.create({_id:`drafts.${id}`,_type:'staff',name:'CMS verification draft',role:'Test',group:'support',order:999,visible:true});
 assert.equal(await publicClient.fetch(query,{id}),null);
 assert.equal(await publicClient.fetch(query,{id:`drafts.${id}`}),null);
 await editor.create({_id:id,_type:'staff',name:'CMS verification published',role:'Test',group:'support',order:999,visible:true});
 await eventually(async()=> (await publicClient.fetch(query,{id}))?.name==='CMS verification published');
 await editor.patch(id).set({name:'CMS verification edited'}).commit();
 await eventually(async()=> (await publicClient.fetch(query,{id}))?.name==='CMS verification edited');
 await assert.rejects(publicClient.patch(id).set({name:'Unauthenticated write'}).commit(),e=>[401,403].includes(e.statusCode));
 const docs=await publicClient.fetch('{"staff":count(*[_type=="staff" && !(_id in path("drafts.**")) && !(_id match "verification-*")]),"services":count(*[_type=="service"]),"settings":count(*[_id=="siteSettings"])}');
 assert.equal(docs.staff,7);assert.equal(docs.services,10);assert.equal(docs.settings,1);
 console.log('PASS: drafts private; authenticated create/edit publishes; anonymous writes rejected; migrated 7 staff, 10 services, settings.');
 const project=await editor.request({url:`/projects/${config.projectId}`});
 console.log('Project:',JSON.stringify({id:project.id,displayName:project.displayName,plan:project.planId||project.plan||project.subscription?.planId||'not exposed by project endpoint'}));
}finally{await editor.transaction().delete(id).delete(`drafts.${id}`).commit();console.log('Temporary verification records removed.')}
