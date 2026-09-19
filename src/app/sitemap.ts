import type { MetadataRoute } from 'next';
const pages=['','about','organization','management-committee','loan-committee','staff','service-centers','savings','loans','services','notices','gallery','documents','chairman-message','contact','privacy-policy','terms'];
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return pages.map(x=>({url:`${base}/${x}`,lastModified:new Date(),changeFrequency:x==='notices'?'daily':'monthly',priority:x===''?1:.7}))}
