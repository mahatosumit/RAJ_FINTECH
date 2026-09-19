import { PublicShell, PageHero, L } from '@/components/public-shell';
import { OnlineMembershipForm, PublicContactForm } from '@/components/public-client';
import { settingsMap } from '@/lib/data';
import { MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const lang = params.lang === 'en' ? 'en' : 'ne';
  const tab = params.tab || 'contact';
  const st = await settingsMap();

  return (
    <PublicShell lang={lang}>
      <PageHero
        title={<L ne="सम्पर्क तथा सदस्यता" en="Contact & Membership" lang={lang} />}
        eyebrow={<L ne="हामी तपाईंका लागि सदैव उपलब्ध छौँ" en="We are here to assist you" lang={lang} />}
        description={
          <L
            ne="श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. सँग जोडिनुहोस् वा संस्थागत सोधपुछका लागि सन्देश पठाउनुहोस्।"
            en="Connect with Shree Kusheshwar Baba Agricultural Cooperative Ltd. or send us an inquiry."
            lang={lang}
          />
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b pb-4">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 font-bold text-xs">
            <Link
              href={`/contact?tab=contact${lang === 'en' ? '&lang=en' : ''}`}
              className={`px-5 py-2.5 rounded-xl transition ${
                tab !== 'membership' ? 'bg-[#0d3429] text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सम्पर्क फारम (Contact Us)
            </Link>
            <Link
              href={`/contact?tab=membership${lang === 'en' ? '&lang=en' : ''}`}
              className={`px-5 py-2.5 rounded-xl transition ${
                tab === 'membership' ? 'bg-amber-500 text-[#0d3429] shadow font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              अनलाइन सदस्यता आवेदन (Online Member Application)
            </Link>
          </div>
        </div>

        {tab === 'membership' ? (
          <OnlineMembershipForm />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <aside className="rounded-3xl bg-[#0d3429] p-8 text-white space-y-8 shadow-xl">
              <div>
                <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-[#0d3429] uppercase mb-2">
                  Institutional Profile
                </span>
                <h2 className="text-xl font-extrabold text-white">सम्पर्क विवरण (Contact Info)</h2>
              </div>

              <div className="space-y-6">
                <Info
                  icon={<MapPin size={20} />}
                  label="प्रधान कार्यालय (Head Office)"
                  value="करैयामाई गाउँपालिका–५, टोल ढोढिया, बारा"
                />
                <Info
                  icon={<MapPin size={20} />}
                  label="सेवा केन्द्र (Narahi Service Center)"
                  value="करैयामाई गाउँपालिका–८, नरही बजार, बारा (उद्घाटन: २०८३/०५/०१)"
                />
                <Info
                  icon={<Phone size={20} />}
                  label="सम्पर्क फोन नम्बर (Phone)"
                  value="9829458061 / 9811841938"
                  href="tel:9811841938"
                />
                <Info
                  icon={<Mail size={20} />}
                  label="इमेल ठेगाना (Email)"
                  value="info@kusheshwarbaba.coop.np"
                />
                <Info
                  icon={<Globe size={20} />}
                  label="वेबसाइट (Website)"
                  value="www.kusheshwarbaba.coop.np"
                />
              </div>

              <div className="rounded-2xl bg-emerald-900/60 p-5 border border-emerald-700/50">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">कार्यालय समय (Office Hours)</h3>
                <p className="text-xs text-emerald-100">आइतबार देखि शुक्रबार: बिहान १०:०० देखि दिउँसो ४:०० सम्म</p>
                <p className="text-[11px] text-emerald-300/80 mt-1">* सार्वजनिक बिदाका दिन कार्यालय बन्द रहनेछ।</p>
              </div>
            </aside>

            <PublicContactForm />
          </div>
        )}
      </main>
    </PublicShell>
  );
}

function Info({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-amber-400 shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">{label}</p>
        {href ? (
          <a className="font-semibold text-white hover:text-amber-300 text-sm" href={href}>
            {value}
          </a>
        ) : (
          <p className="font-semibold text-white text-sm leading-snug">{value}</p>
        )}
      </div>
    </div>
  );
}
