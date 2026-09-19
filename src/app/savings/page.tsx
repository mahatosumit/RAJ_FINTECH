import { PublicShell, PageHero, L } from '@/components/public-shell';
import { SavingsCalculator } from '@/components/public-client';
import { publicData } from '@/lib/data';
import { PiggyBank, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const lang = (await searchParams).lang === 'en' ? 'en' : 'ne';
  const data = await publicData();
  const rows = data.savings;

  return (
    <PublicShell lang={lang}>
      <PageHero
        title={<L ne="बचत योजनाहरू" en="Savings Plans" lang={lang} />}
        eyebrow={<L ne="सुरक्षित भविष्य र आकर्षक प्रतिफल" en="Secure Future & High Returns" lang={lang} />}
        description={
          <L
            ne="श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. ले आफ्ना सदस्यहरूका लागि दैनिक बचत, बाल बचत तथा नारी बचत योजनाहरू सञ्चालन गर्दै आएको छ।"
            en="Shree Kusheshwar Baba Agricultural Cooperative Ltd. offers tailored daily, child, and women's savings plans."
            lang={lang}
          />
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Savings Plans Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {rows.map((x: any) => (
            <article
              key={x.id}
              className="flex flex-col justify-between rounded-3xl border bg-white p-7 shadow-sm hover:shadow-md transition border-emerald-900/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0d3429] text-amber-400">
                    <PiggyBank size={24} />
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    <L ne={x.durationNe || ''} en={x.durationEn || ''} lang={lang} />
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0d3429]">
                  <L ne={x.nameNe} en={x.nameEn} lang={lang} />
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  <L ne={x.descriptionNe} en={x.descriptionEn} lang={lang} />
                </p>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">दर तथा लाभ तालिका (Rates):</span>
                  {x.rates?.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-slate-100 py-2">
                      <span className="font-semibold text-slate-700">
                        <L ne={r.labelNe} en={r.labelEn} lang={lang} />
                      </span>
                      <strong className="text-[#0d3429] font-bold">
                        <L ne={r.valueNe} en={r.valueEn} lang={lang} />
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t">
                <Link
                  href="/contact?tab=membership"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0d3429] py-3 text-xs font-bold text-white shadow hover:bg-emerald-900 transition"
                >
                  <Sparkles size={16} className="text-amber-400" />
                  बचत खाता खोल्नुहोस्
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Interactive Savings Calculator */}
        <SavingsCalculator />
      </main>
    </PublicShell>
  );
}