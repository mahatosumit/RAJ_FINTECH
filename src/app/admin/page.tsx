import { getAdminStats, publicData } from '@/lib/data';
import {
  FileText,
  Users,
  Landmark,
  PiggyBank,
  HandCoins,
  FolderOpen,
  Image,
  MessageSquare,
  Building2,
  ClipboardList,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getAdminStats();
  const { notices, services, savings, loans } = await publicData();

  const cards = [
    { label: 'Pending Memberships', val: stats.pendingApps, icon: ClipboardList, color: 'bg-amber-50 border-amber-200 text-amber-700', link: '/admin/membership-applications' },
    { label: 'Unread Messages', val: stats.unreadMsgs, icon: MessageSquare, color: 'bg-emerald-50 border-emerald-200 text-emerald-800', link: '/admin/messages' },
    { label: 'Published Notices', val: notices.length, icon: FileText, color: 'bg-blue-50 border-blue-200 text-blue-800', link: '/admin/notices' },
    { label: 'Service Centers', val: stats.totalCenters, icon: Building2, color: 'bg-purple-50 border-purple-200 text-purple-800', link: '/admin/centers' },
    { label: 'Active Staff', val: stats.totalStaff, icon: Users, color: 'bg-teal-50 border-teal-200 text-teal-800', link: '/admin/staff' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Studio Overview</span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि.
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time management dashboard for content, membership applications, staff, and notice publication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/notices"
            className="flex items-center gap-2 rounded-xl bg-[#0d3429] px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-emerald-900"
          >
            <PlusCircle size={16} />
            Publish Notice
          </Link>
        </div>
      </div>

      {/* Primary Analytical Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.link}
              className={`group flex flex-col justify-between rounded-2xl border p-5 transition hover:shadow-md ${c.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 shadow-sm">
                  <Icon size={20} />
                </span>
                <span className="text-3xl font-extrabold">{c.val}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold">{c.label}</span>
                <ArrowRight size={14} className="opacity-0 transition group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cooperative Content Overview Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800">Frequent Administrative Actions</h2>
          <p className="mt-1 text-xs text-slate-500">Direct shortcuts to manage essential institutional data</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/management"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Users size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Management Committee</strong>
                <span className="text-[11px] text-slate-500">Manage 24 members & positions</span>
              </div>
            </Link>

            <Link
              href="/admin/loan-committee"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Users size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Loan Committee</strong>
                <span className="text-[11px] text-slate-500">Manage loan board members</span>
              </div>
            </Link>

            <Link
              href="/admin/savings"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <PiggyBank size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Savings Plans</strong>
                <span className="text-[11px] text-slate-500">Update rates & duration</span>
              </div>
            </Link>

            <Link
              href="/admin/loans"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <HandCoins size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Loan Products</strong>
                <span className="text-[11px] text-slate-500">Edit interest rates & limits</span>
              </div>
            </Link>

            <Link
              href="/admin/documents"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <FolderOpen size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Documents Library</strong>
                <span className="text-[11px] text-slate-500">Upload official PDFs & forms</span>
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Image size={20} className="text-emerald-700" />
              <div>
                <strong className="block text-xs font-bold text-slate-800">Photo Gallery</strong>
                <span className="text-[11px] text-slate-500">Manage albums & media</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Live Status Summary */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800">Service Center Status & Announcement</h2>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 border border-amber-200">
            <span className="inline-block rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">Upcoming Opening</span>
            <h3 className="mt-2 text-sm font-bold text-slate-800">सेवा केन्द्र (नरही बजार)</h3>
            <p className="mt-1 text-xs text-slate-600">
              करैयामाई गाउँपालिका–८, नरही बजारमा नयाँ सेवा केन्द्र सञ्चालन मिति: <strong>२०८३/०५/०१</strong>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Active Products</h3>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="text-slate-600">Active Services</span>
              <strong className="text-slate-900">{services.length} Published</strong>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="text-slate-600">Savings Products</span>
              <strong className="text-slate-900">{savings.length} Plans</strong>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="text-slate-600">Loan Products</span>
              <strong className="text-slate-900">{loans.length} Products</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
