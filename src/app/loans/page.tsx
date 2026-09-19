import { PublicShell, PageHero, L } from '@/components/public-shell';
import { LoanCalculator } from '@/components/public-client';
import { publicData } from '@/lib/data';
import { HandCoins, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const lang = (await searchParams).lang === 'en' ? 'en' : 'ne';
  const data = await publicData();
  const rows = data.loans;

  return (
    <PublicShell lang={lang}>
      <PageHero
        title={<L ne="कर्जा सेवाहरू" en="Loan Products" lang={lang} />}
        eyebrow={<L ne="सहुलियतपूर्ण तथा कृषि कर्जा" en="Concessional & Agriculture Loans" lang={lang} />}
        description={
          <L
            ne="कृषक, व्यवसायी तथा उद्यमशील सदस्यहरूका लागि सुलभ ब्याजदरमा प्रदान गरिने कर्जा योजनाहरू।"
            en="Accessible loan schemes for farmers, entrepreneurs, and member businesses."
            lang={lang}
          />
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Loan Product Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {rows.map((x: any) => (
            <article
              key={x.id}
              className="flex flex-col justify-between rounded-3xl border bg-white p-7 shadow-sm hover:shadow-md transition border-amber-900/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-[#0d3429]">
                    <HandCoins size={24} />
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {x.interestRate}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0d3429]">
                  <L ne={x.nameNe} en={x.nameEn} lang={lang} />
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  <L ne={x.descriptionNe} en={x.descriptionEn} lang={lang} />
                </p>

                <dl className="mt-6 space-y-3 border-t pt-4 text-xs">
                  <div>
                    <dt className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">अधिकतम सीमा (Max Limit):</dt>
                    <dd className="font-extrabold text-slate-900 text-sm mt-0.5">{x.maxAmount}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">आवश्यक योग्यता (Eligibility):</dt>
                    <dd className="font-medium text-slate-700 mt-0.5"><L ne={x.eligibilityNe} en={x.eligibilityEn} lang={lang} /></dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">आवश्यक कागजात (Documents):</dt>
                    <dd className="font-medium text-slate-700 mt-0.5"><L ne={x.documentsNe} en={x.documentsEn} lang={lang} /></dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 pt-4 border-t">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0d3429] py-3 text-xs font-bold text-white shadow hover:bg-emerald-900 transition"
                >
                  कर्जाका लागि आवेदन दिनुहोस्
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Interactive Loan EMI Calculator */}
        <LoanCalculator />
      </main>
    </PublicShell>
  );
}