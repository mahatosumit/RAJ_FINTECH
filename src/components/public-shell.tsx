import Link from "next/link";
import { Menu, Phone, MapPin, Landmark, Sparkles, UserPlus, Lock } from "lucide-react";
import { settingsMap } from "@/lib/data";

const nav = [
  ['/', 'गृहपृष्ठ', 'Home'],
  ['/about', 'हाम्रो बारेमा', 'About Us'],
  ['/services', 'सेवाहरू', 'Services'],
  ['/savings', 'बचत योजना', 'Savings Plans'],
  ['/loans', 'कर्जा योजना', 'Loan Products'],
  ['/management-committee', 'सञ्चालक समिति', 'Board Committee'],
  ['/loan-committee', 'कर्जा समिति', 'Loan Committee'],
  ['/staff', 'कर्मचारी', 'Staff Members'],
  ['/service-centers', 'सेवा केन्द्र', 'Service Centers'],
  ['/notices', 'सूचनाहरू', 'Notices'],
  ['/documents', 'कागजातहरू', 'Documents'],
  ['/gallery', 'ग्यालरी', 'Gallery'],
  ['/contact', 'सम्पर्क', 'Contact'],
];

export function L({ ne, en, lang }: { ne: string; en: string; lang: string }) {
  return <>{lang === 'en' ? (en || 'To be updated') : (ne || 'राख्न बाँकी')}</>;
}

export async function PublicShell({ children, lang = 'ne' }: { children: React.ReactNode; lang?: string }) {
  const st = await settingsMap();
  const q = lang === 'en' ? '?lang=en' : '';

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-800 font-sans">
      {/* Top Banner - Service Centre Announcement */}
      <div className="bg-[#0b2b22] text-amber-300 py-1.5 px-4 text-xs font-semibold">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>
              <strong className="font-bold text-white">विशेष सूचना:</strong> नयाँ सेवा केन्द्र (नरही बजार, करैयामाई–८) मिति <span className="underline font-bold text-amber-200">२०८३/०५/०१</span> देखि सञ्चालन हुँदैछ!
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200">
            <span>प्रधान कार्यालय: करैयामाई–५, ढोढिया, बारा</span>
            <span>|</span>
            <a href="tel:9811841938" className="hover:text-white flex items-center gap-1 font-bold">
              <Phone size={12} /> 9811841938
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href={'/' + q} className="flex min-w-0 items-center gap-3 group">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0d3429] text-amber-400 shadow-md transition group-hover:scale-105">
              <Landmark size={24} />
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-base sm:text-lg font-extrabold text-[#0d3429]">
                <L ne={st.organization_name?.valueNe || 'श्री कुशेश्वर बाबा कृषि सहकारी संस्था लिमिटेड'} en={st.organization_name?.valueEn || 'Shree Kusheshwar Baba Krishi Sahakari Sanstha Limited'} lang={lang} />
              </strong>
              <small className="block truncate font-semibold text-amber-700 text-xs">
                "<L ne={st.tagline?.valueNe || 'विश्वास, बचत र समृद्धिको आधार'} en={st.tagline?.valueEn || 'The Foundation of Trust, Savings and Prosperity'} lang={lang} />"
              </small>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Quick Online Membership CTA */}
            <Link
              href="/contact?tab=membership"
              className="hidden lg:flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-[#0d3429] shadow transition hover:bg-amber-400"
            >
              <UserPlus size={15} />
              <L ne="अनलाइन सदस्यता" en="Online Member" lang={lang} />
            </Link>

            {/* Admin Login Shortcut */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-800/20 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#0d3429] transition hover:bg-emerald-100"
              title="Admin Studio Login"
            >
              <Lock size={14} />
              <span className="hidden sm:inline">Admin Studio</span>
            </Link>

            {/* Language Selector */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
              <Link className={`px-2 py-1 rounded-lg ${lang === 'ne' ? 'bg-[#0d3429] text-white' : 'text-slate-600'}`} href="?lang=ne">
                नेपाली
              </Link>
              <Link className={`px-2 py-1 rounded-lg ${lang === 'en' ? 'bg-[#0d3429] text-white' : 'text-slate-600'}`} href="?lang=en">
                EN
              </Link>
            </div>

            {/* Mobile Drawer Toggle */}
            <details className="relative lg:hidden">
              <summary className="list-none rounded-xl border p-2 cursor-pointer hover:bg-slate-100" aria-label="Open menu">
                <Menu size={20} />
              </summary>
              <nav className="absolute right-0 mt-3 w-64 rounded-2xl border bg-white p-3 shadow-2xl space-y-1">
                {nav.map((x) => (
                  <Link className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900" key={x[0]} href={x[0] + q}>
                    <L ne={x[1]} en={x[2]} lang={lang} />
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden max-w-7xl items-center gap-5 border-t border-slate-100 px-4 py-2.5 text-xs font-bold lg:flex overflow-x-auto">
          {nav.map((x) => (
            <Link className="text-slate-700 hover:text-emerald-700 transition whitespace-nowrap" key={x[0]} href={x[0] + q}>
              <L ne={x[1]} en={x[2]} lang={lang} />
            </Link>
          ))}
        </nav>
      </header>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="mt-20 bg-[#0a261e] text-emerald-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-[#0a261e]">
                <Landmark size={22} />
              </span>
              <strong className="block text-sm font-bold text-white leading-tight">
                <L ne={st.organization_name?.valueNe || 'श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि.'} en={st.organization_name?.valueEn || 'Shree Kusheshwar Baba Cooperative Ltd.'} lang={lang} />
              </strong>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              "<L ne={st.tagline?.valueNe || 'विश्वास, बचत र समृद्धिको आधार'} en={st.tagline?.valueEn || 'The Foundation of Trust, Savings and Prosperity'} lang={lang} />"
            </p>
            <div className="text-xs space-y-1 text-emerald-300">
              <p>स्थापना: २०६८ | दर्ता नं: १२४/०६८/०६९</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-sm text-amber-400 uppercase tracking-wider">
              <L ne="मुख्य सेवाहरू" en="Our Services" lang={lang} />
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li><Link href={`/savings${q}`} className="hover:text-amber-300">साधारण बचत योजना (३६५ दिन)</Link></li>
              <li><Link href={`/savings${q}`} className="hover:text-amber-300">बाल बचत योजना</Link></li>
              <li><Link href={`/savings${q}`} className="hover:text-amber-300">नारी बचत योजना</Link></li>
              <li><Link href={`/loans${q}`} className="hover:text-amber-300">सहुलियतपूर्ण कर्जा</Link></li>
              <li><Link href={`/loans${q}`} className="hover:text-amber-300">कृषि कर्जा</Link></li>
              <li><Link href={`/loans${q}`} className="hover:text-amber-300">व्यवसायिक कर्जा</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-sm text-amber-400 uppercase tracking-wider">
              <L ne="द्रुत लिङ्कहरू" en="Quick Links" lang={lang} />
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li><Link href={`/management-committee${q}`} className="hover:text-amber-300">सञ्चालक समिति (२४ जना)</Link></li>
              <li><Link href={`/loan-committee${q}`} className="hover:text-amber-300">कर्जा समिति (३ जना)</Link></li>
              <li><Link href={`/staff${q}`} className="hover:text-amber-300">कर्मचारी विवरण</Link></li>
              <li><Link href={`/service-centers${q}`} className="hover:text-amber-300">सेवा केन्द्र (नरही बजार)</Link></li>
              <li><Link href={`/notices${q}`} className="hover:text-amber-300">सूचना तथा समाचार</Link></li>
              <li><Link href={`/documents${q}`} className="hover:text-amber-300">फारम तथा विनियमावली</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
              <L ne="सम्पर्क ठेगाना" en="Contact Us" lang={lang} />
            </h3>
            <div className="text-xs text-emerald-100/80 space-y-2">
              <p className="flex gap-2">
                <MapPin size={16} className="shrink-0 text-amber-400" />
                <span>प्रधान कार्यालय: करैयामाई गाउँपालिका–५, ढोढिया, बारा</span>
              </p>
              <p className="flex gap-2">
                <MapPin size={16} className="shrink-0 text-amber-400" />
                <span>सेवा केन्द्र: करैयामाई गाउँपालिका–८, नरही बजार, बारा (उद्घाटन: २०८३/०५/०१)</span>
              </p>
              <p className="flex gap-2">
                <Phone size={16} className="shrink-0 text-amber-400" />
                <span>सम्पर्क: 9829458061 / 9811841938</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900 px-4 py-5 text-center text-xs text-emerald-400">
          © {new Date().getFullYear()} श्री कुशेश्वर बाबा कृषि सहकारी संस्था लिमिटेड. सर्वाधिकार सुरक्षित।
        </div>
      </footer>
    </div>
  );
}

export function PageHero({ title, eyebrow, description }: { title: React.ReactNode; eyebrow?: React.ReactNode; description?: React.ReactNode }) {
  return (
    <section className="border-b bg-gradient-to-br from-[#eaf3ef] via-[#f2f8f5] to-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {eyebrow && <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-amber-700">{eyebrow}</p>}
        <h1 className="text-2xl font-black text-[#0d3429] sm:text-4xl lg:text-5xl leading-tight">{title}</h1>
        {description && <p className="mt-3.5 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
