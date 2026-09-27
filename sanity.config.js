import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import config from './data/sanity-config.json';
import {schemaTypes} from './studio/schema.js';
export default defineConfig({
 name:'tarbert',title:'Tarbert Street Dental',projectId:config.projectId,dataset:config.dataset,basePath:'/',
 releases:{enabled:false},tasks:{enabled:false},scheduledDrafts:{enabled:false},
 plugins:[structureTool({structure:S=>S.list().title('Website content').items([
  S.listItem().title('Staff').child(S.documentTypeList('staff').title('Staff').defaultOrdering([{field:'order',direction:'asc'}])),S.listItem().title('Services').child(S.documentTypeList('service').title('Services').defaultOrdering([{field:'order',direction:'asc'}])),
  S.listItem().title('Practice & home page').child(S.document().schemaType('siteSettings').documentId('siteSettings'))
 ])})],schema:{types:schemaTypes,templates:templates=>templates.filter(t=>t.schemaType!=='siteSettings')},
 document:{actions:(actions,context)=>context.schemaType==='siteSettings'?actions.filter(a=>!['delete','duplicate','unpublish'].includes(a.action)):actions}
});
