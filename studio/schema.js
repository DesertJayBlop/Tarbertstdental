import {defineType, defineField, defineArrayMember} from 'sanity';
const required = Rule => Rule.required();
const text = (name,title,extra={}) => defineField({name,title,type:'string',...extra});
const paragraphs = defineField({name:'paragraphs',title:'Paragraphs',type:'array',of:[{type:'text'}]});
const photo = (name,title) => defineField({name,title,type:'image',options:{hotspot:true},fields:[text('alt','Image description',{validation:required})]});
const order = defineField({name:'order',title:'Display order',type:'number',initialValue:0,validation:R=>R.required().integer().min(0),description:'Lower numbers appear first.'});
const visible = defineField({name:'visible',title:'Show on website',type:'boolean',initialValue:true});
const cards = defineField({name:'cards',title:'Cards / steps',type:'array',of:[defineArrayMember({type:'object',name:'serviceCard',fields:[text('title','Title',{validation:required}),defineField({name:'text',title:'Description',type:'text'}),text('icon','Icon',{options:{list:[{title:'No icon',value:''},'calendar','check','clock','phone','pin']}}),text('step','Step number')],preview:{select:{title:'title',subtitle:'text'}}})]});
const sections = defineField({name:'sections',title:'Page sections',type:'array',of:[defineArrayMember({type:'object',name:'serviceSection',fields:[text('eyebrow','Small heading'),text('title','Heading',{validation:required}),paragraphs,text('layout','Layout',{options:{list:['text','cards','steps']},initialValue:'text',validation:required}),defineField({name:'softBackground',title:'Tinted background',type:'boolean'}),cards],preview:{select:{title:'title',subtitle:'layout'}}})]});
export const schemaTypes = [
 defineType({name:'staff',title:'Staff',type:'document',fields:[
  text('name','Name',{validation:required}),text('role','Role',{validation:required}),
  text('group','Team group',{options:{list:[{title:'Dentists',value:'dentists'},{title:'Hygienists & dental therapists',value:'hygienists'},{title:'Practice support',value:'support'}]},validation:required}),
  photo('photo','Photo'),defineField({name:'teaser',title:'Short introduction',type:'text',rows:3}),defineField({name:'bio',title:'Full biography',type:'text'}),
  defineField({name:'expertise',title:'Areas of expertise',type:'array',of:[{type:'string'}]}),order,visible
 ],orderings:[{title:'Website order',name:'websiteOrder',by:[{field:'order',direction:'asc'}]}],preview:{select:{title:'name',subtitle:'role',media:'photo'}}}),
 defineType({name:'service',title:'Services',type:'document',fields:[
  text('title','Service name',{validation:required}),defineField({name:'slug',title:'Page URL',type:'slug',options:{source:'title',maxLength:96},validation:R=>R.required().custom(v=>!v?.current||/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.current)||'Use lowercase words separated by hyphens.')}),
  text('legacyUrl','Original page URL',{readOnly:true,hidden:({document})=>!document?.legacyUrl}),
  defineField({name:'hasPage',title:'Enable detail page',type:'boolean',initialValue:false,description:'Enable once the page copy is ready. Otherwise the service links to contact.'}),
  text('heading','Page heading'),text('category','Category'),defineField({name:'summary',title:'Introduction',type:'text',validation:R=>R.custom((v,c)=>c.document?.hasPage&&!v?'Add an introduction before enabling a detail page.':true)}),photo('image','Page image'),sections,
  defineField({name:'callToAction',title:'Closing invitation',type:'object',fields:[text('eyebrow','Small heading'),text('title','Heading'),defineField({name:'text',title:'Description',type:'text'})]}),order,visible
 ],orderings:[{title:'Website order',name:'websiteOrder',by:[{field:'order',direction:'asc'}]}],preview:{select:{title:'title',media:'image'}}}),
 defineType({name:'siteSettings',title:'Practice & home page',type:'document',fields:[
  text('practiceName','Practice name',{validation:required}),text('phone','Phone display',{validation:required}),text('phoneLink','Phone dialling number',{validation:R=>R.required().regex(/^\+?[0-9 ()-]+$/)}),text('address','Address',{validation:required}),text('hours','Opening hours',{validation:required}),
  defineField({name:'heritageStartYear',title:'Practice starting year',type:'number',validation:R=>R.integer().min(1),description:'The anniversary is calculated automatically using the current year in New Zealand. 1897 gives 129 years in 2026.'}),text('heritageHeading','Heritage heading'),defineField({name:'heritageText',title:'Heritage introduction',type:'text',description:'Use {years} wherever the live anniversary number should appear.'}),text('instagramHandle','Instagram username',{description:'Username only, without @.',validation:R=>R.regex(/^[A-Za-z0-9._]{1,30}$/)}),
  defineField({name:'callbackEndpoint',title:'Callback form submission endpoint',type:'url',description:'HTTPS form-service endpoint that accepts JSON and returns a successful HTTP response only after accepting the request. Leave blank until delivery is configured.',validation:R=>R.uri({scheme:['https']})}),
  text('heroHeading','Home page heading',{validation:required}),defineField({name:'heroText',title:'Home page introduction',type:'text',validation:required}),photo('heroImage','Home page hero photo'),photo('practiceImage','Home page team / practice image'),
  defineField({name:'faqs',title:'Frequently asked questions',type:'array',of:[defineArrayMember({name:'faq',type:'object',fields:[text('question','Question',{validation:required}),defineField({name:'answer',title:'Answer',type:'text',validation:required})],preview:{select:{title:'question'}}})]})
 ],preview:{prepare:()=>({title:'Practice & home page'})}})
];
