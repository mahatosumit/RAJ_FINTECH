import Link from "next/link";
import { PublicShell, PageHero, L } from "./public-shell";
import {
  ensureSeeded,
  sectionsMap,
  publicData,
  committee,
  getAllStaff,
  getAllDocuments,
  getAllGallery,
  getAllNotices,
} from "@/lib/data";
import {
  Building2,
  CalendarDays,
  Download,
  FileText,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

const titles: Record<string, [string, string, string, string]> = {
  about: ['हाम्रो बारेमा', 'About Us', 'संस्थागत परिचय', 'Institutional Profile'],
  organization: ['हाम्रो संस्था', 'Our Organization', 'संरचना र नेतृत्व', 'Structure & Leadership'],
  management: ['सञ्चालक समिति', 'Management Committee', 'जिम्मेवार नेतृत्व (२४ जना सदस्य)', 'Accountable Board (24 Members)'],
  loanCommittee: ['कर्जा समिति', 'Loan Committee', 'कर्जा व्यवस्थापन समिति (३ जना सदस्य)', 'Loan Governance (3 Members)'],
  staff: ['हाम्रा कर्मचारी', 'Our Staff Directory', 'सेवामा समर्पित टोली', 'Dedicated Staff Team'],
  centers: ['सेवा केन्द्रहरू', 'Service Centers', 'शाखा तथा सेवा केन्द्रहरू', 'Branches & Service Centers'],
  services: ['हाम्रा सेवाहरू', 'Our Services', 'सदस्यहरूका लागि सेवा', 'Services for Members'],
  savings: ['बचत योजनाहरू', 'Savings Plans', 'सुरक्षित भविष्य र उच्च ब्याज', 'Secure Future & High Interest'],
  loans: ['कर्जा सेवाहरू', 'Loan Products', 'उद्यम तथा कृषि कर्जा', 'Enterprise & Agriculture Loans'],
  chairman: ['अध्यक्षको सन्देश', "Chairman's Message", 'नेतृत्वको सन्देश', 'Message from Leadership'],
  documents: ['कागजातहरू', 'Documents', 'डाउनलोड केन्द्र', 'Download Center'],
  gallery: ['फोटो ग्यालरी', 'Photo Gallery', 'हाम्रा गतिविधिहरू', 'Our Activities & Events'],
  notices: ['सूचना तथा समाचार', 'Notices & News', 'ताजा अद्यावधिक', 'Latest Updates'],
  privacy: ['गोपनीयता नीति', 'Privacy Policy', 'कानुनी जानकारी', 'Legal Provisions'],
  terms: ['नियम तथा सर्तहरू', 'Terms & Conditions', 'कानुनी सर्तहरू', 'Legal Provisions'],
};

export async function PublicPage({ type, lang }: { type: string; lang: string }) {
  await ensureSeeded();
  const t = titles[type] || ['सूचना', 'Information', 'सहकारी', 'Cooperative'];
  let content: React.ReactNode = null;

  if (type === 'about') {
    const data = await publicData();
    const sec = data.sections;
    const obj = data.objectives;

    content = (
      <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0d3429]">
            <L ne={sec.about?.titleNe || 'हाम्रो बारेमा'} en={sec.about?.titleEn || 'About Us'} lang={lang} />
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            <L ne={sec.about?.contentNe || ''} en={sec.about?.contentEn || ''} lang={lang} />
          </p>
          <dl className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2 text-xs">
            <div>
              <dt className="text-slate-400 font-bold uppercase tracking-wider">स्थापना वर्ष (Established):</dt>
              <dd className="font-extrabold text-slate-900 text-sm mt-1">वि.सं. २०६८ (2068 B.S.)</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-bold uppercase tracking-wider">दर्ता नम्बर (Registration No):</dt>
              <dd className="font-extrabold text-slate-900 text-sm mt-1">१२४/०६८/०६९</dd>
            </div>
          </dl>
        </article>

        <aside className="rounded-3xl bg-[#eaf3ef] p-8 border border-emerald-900/10">
          <h2 className="text-xl font-bold text-[#0d3429]">हाम्रा प्रमुख उद्देश्यहरू (Objectives)</h2>
          <ul className="mt-6 space-y-4 text-xs font-semibold text-slate-700">
            {obj.map((x: any, i: number) => (
              <li className="flex gap-3" key={x.id || i}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-white text-[10px]">✓</span>
                <L ne={x.textNe} en={x.textEn} lang={lang} />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    );
  }

  if (type === 'organization') {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['/management-committee', 'सञ्चालक समिति (२४ जना)', 'Board of Directors'],
          ['/loan-committee', 'कर्जा समिति (३ जना)', 'Loan Committee'],
          ['/staff', 'कर्मचारी विवरण', 'Staff Directory'],
          ['/service-centers', 'सेवा केन्द्र (नरही बजार)', 'Service Centers'],
        ].map((x) => (
          <Link
            className="rounded-3xl border bg-white p-8 text-center shadow-sm hover:shadow-md transition border-emerald-900/10"
            href={x[0] + (lang === 'en' ? '?lang=en' : '')}
            key={x[0]}
          >
            <Building2 className="mx-auto text-emerald-700 mb-4" size={40} />
            <h2 className="font-bold text-base text-[#0d3429]">
              <L ne={x[1]} en={x[2]} lang={lang} />
            </h2>
          </Link>
        ))}
      </div>
    );
  }

  if (type === 'management' || type === 'loanCommittee') {
    const rows = await committee(type === 'management' ? 'management' : 'loan');

    content = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((x: any, i: number) => (
          <article className="rounded-2xl border bg-white p-5 flex items-center gap-4 shadow-sm hover:border-emerald-300 transition" key={x.id || i}>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xl">
              <UserRound size={26} />
            </span>
            <div>
              <h2 className="font-bold text-[#0d3429] text-base">
                <L ne={x.nameNe} en={x.nameEn} lang={lang} />
              </h2>
              <p className="text-xs font-bold text-amber-700 mt-0.5">
                <L ne={x.positionNe} en={x.positionEn} lang={lang} />
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (type === 'staff') {
    const rows = await getAllStaff();

    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((x: any, i: number) => (
          <article className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition" key={x.id || i}>
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-[#0d3429] font-bold">
                <UserRound size={32} />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-[#0d3429]">
                  <L ne={x.nameNe} en={x.nameEn} lang={lang} />
                </h2>
                <p className="text-xs font-bold text-amber-700">
                  <L ne={x.positionNe} en={x.positionEn} lang={lang} />
                </p>
              </div>
            </div>

            <div className="mt-5 border-t pt-4 space-y-2 text-xs">
              <p className="text-slate-500">
                कार्यस्थल: <strong className="text-slate-800"><L ne={x.centerName || 'प्रधान कार्यालय'} en={x.centerName || 'Head Office'} lang={lang} /></strong>
              </p>
              {x.phone && (
                <a className="inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline" href={'tel:' + x.phone}>
                  <Phone size={14} /> {x.phone}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (type === 'centers') {
    const data = await publicData();
    const rows = data.centers;

    content = (
      <div className="grid gap-6 md:grid-cols-2">
        {rows.map((x: any, i: number) => (
          <article className="rounded-3xl border bg-white p-8 shadow-sm space-y-4" key={x.id || i}>
            <MapPin className="text-amber-500" size={36} />
            <h2 className="text-2xl font-extrabold text-[#0d3429]">
              <L ne={x.nameNe} en={x.nameEn} lang={lang} />
            </h2>
            <p className="text-sm text-slate-600">
              <L ne={x.addressNe} en={x.addressEn} lang={lang} />
            </p>
            {x.openingDate && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs font-bold text-amber-900">
                सञ्चालन / उद्घाटन मिति: {x.openingDate}
              </div>
            )}
            {x.phone && (
              <p className="text-xs font-semibold text-slate-600">
                सम्पर्क: <a href={`tel:${x.phone}`} className="font-bold text-emerald-800">{x.phone}</a>
              </p>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (type === 'services') {
    const data = await publicData();
    const rows = data.services;

    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((x: any, i: number) => (
          <article className="rounded-3xl border bg-white p-7 shadow-sm space-y-4" key={x.id || i}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0d3429] text-amber-400 font-bold">
              <Building2 size={24} />
            </span>
            <h2 className="text-xl font-extrabold text-[#0d3429]">
              <L ne={x.nameNe} en={x.nameEn} lang={lang} />
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              <L ne={x.descriptionNe} en={x.descriptionEn} lang={lang} />
            </p>
          </article>
        ))}
      </div>
    );
  }

  if (type === 'chairman' || type === 'privacy' || type === 'terms') {
    const sec = await sectionsMap();
    const x = sec[type] || { contentNe: '', contentEn: '' };

    content = (
      <article className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 sm:p-12 shadow-sm space-y-6">
        <p className="text-base sm:text-lg leading-relaxed text-slate-700 whitespace-pre-line">
          <L ne={x.contentNe} en={x.contentEn} lang={lang} />
        </p>
        {type === 'chairman' && (
          <div className="mt-8 border-t pt-6">
            <strong className="block text-[#0d3429] font-extrabold text-base">राजकुमार प्रसाद पाल</strong>
            <p className="text-xs font-semibold text-slate-500">
              <L ne="अध्यक्ष" en="Chairperson" lang={lang} /> · श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि.
            </p>
          </div>
        )}
      </article>
    );
  }

  if (type === 'documents') {
    const rows = await getAllDocuments();

    content = rows.length ? (
      <div className="space-y-4">
        {rows.map((x: any, i: number) => (
          <a
            key={x.id || i}
            href={x.fileUrl}
            target="_blank"
            download
            className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm hover:border-emerald-400 transition"
          >
            <div className="flex items-center gap-4">
              <FileText className="text-emerald-700" size={28} />
              <div>
                <strong className="block font-bold text-slate-900 text-sm">
                  <L ne={x.titleNe} en={x.titleEn} lang={lang} />
                </strong>
                <span className="text-xs text-slate-500">
                  <L ne={x.descriptionNe} en={x.descriptionEn} lang={lang} />
                </span>
              </div>
            </div>
            <Download className="text-slate-400 hover:text-emerald-800" size={20} />
          </a>
        ))}
      </div>
    ) : (
      <Empty lang={lang} />
    );
  }

  if (type === 'gallery') {
    const { albums, images } = await getAllGallery();

    content = images.length ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img: any, i: number) => (
          <figure className="rounded-3xl border bg-white p-4 shadow-sm overflow-hidden" key={img.id || i}>
            <img className="aspect-video w-full rounded-2xl object-cover" src={img.imageUrl} alt={img.altText || 'Cooperative gallery'} />
            <figcaption className="mt-3 text-xs font-bold text-slate-800 px-2">
              <L ne={img.captionNe || ''} en={img.captionEn || ''} lang={lang} />
            </figcaption>
          </figure>
        ))}
      </div>
    ) : (
      <Empty lang={lang} />
    );
  }

  if (type === 'notices') {
    const rows = await getAllNotices();

    content = rows.length ? (
      <div className="grid gap-6 md:grid-cols-2">
        {rows.map((x: any, i: number) => (
          <article className="rounded-3xl border bg-white p-7 shadow-sm space-y-3" key={x.id || i}>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <CalendarDays size={15} />
              {x.publishedAt ? new Date(x.publishedAt).toLocaleDateString('ne-NP') : ''}
            </div>
            <h2 className="text-xl font-extrabold text-[#0d3429]">
              <L ne={x.titleNe} en={x.titleEn} lang={lang} />
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              <L ne={x.summaryNe} en={x.summaryEn} lang={lang} />
            </p>
          </article>
        ))}
      </div>
    ) : (
      <Empty lang={lang} />
    );
  }

  return (
    <PublicShell lang={lang}>
      <PageHero title={<L ne={t[0]} en={t[1]} lang={lang} />} eyebrow={<L ne={t[2]} en={t[3]} lang={lang} />} />
      <main className="mx-auto max-w-7xl px-4 py-12">{content}</main>
    </PublicShell>
  );
}

function Empty({ lang }: { lang: string }) {
  return (
    <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-slate-500">
      <FileText className="mx-auto mb-3" size={32} />
      <L ne="हाल कुनै सामग्री उपलब्ध छैन।" en="No content is currently available." lang={lang} />
    </div>
  );
}
