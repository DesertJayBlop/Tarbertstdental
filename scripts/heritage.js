const defaultIntroduction='{years} years of caring for our community. A proud history, familiar faces, and modern dentistry — right here in Alexandra.';
export function anniversaryYears(startYear=1897,date=new Date()){
 const year=Number(new Intl.DateTimeFormat('en-NZ',{year:'numeric',timeZone:'Pacific/Auckland'}).format(date));
 const baseline=Number.isInteger(startYear)&&startYear>0?startYear:1897;
 return Math.max(0,year-baseline);
}
export function renderHeritage(settings={}){
 const years=anniversaryYears(settings.heritageStartYear);
 const values=[['[data-heritage-years]',years],['[data-heritage-heading]',settings.heritageHeading],['[data-heritage-text]',(settings.heritageText??defaultIntroduction).replaceAll('{years}',String(years))]];
 for(const [selector,value] of values){const element=document.querySelector(selector);if(element&&value!=null)element.textContent=value}
}
