import Link from 'next/link';
import { signOut } from '@/auth';
import {
  LayoutDashboard,
  FileText,
  Landmark,
  Users,
  Building2,
  HandCoins,
  PiggyBank,
  Bell,
  Image,
  FolderOpen,
  MessageSquare,
  Settings,
  ScrollText,
  LogOut,
  Menu,
  Home,
  ShieldCheck,
  UserCheck,
  ClipboardList
} from 'lucide-react';

type NavItem = [string, string, React.ComponentType<{ size?: number }>];

const groups: Array<[string, NavItem[]]> = [
  [
    'Organization',
    [
      ['management', 'Management Committee', Users],
      ['loan-committee', 'Loan Committee', Users],
      ['staff', 'Staff Members', UserCheck],
      ['centers', 'Branches & Centers', Building2],
    ],
  ],
  [
    'Content',
    [
      ['notices', 'Notices & News', FileText],
      ['services', 'Services', Landmark],
      ['savings', 'Savings Plans', PiggyBank],
      ['loans', 'Loan Products', HandCoins],
      ['pages', 'Page Sections', FolderOpen],
    ],
  ],
  [
    'Applications & Messages',
    [
      ['membership-applications', 'Membership Apps', ClipboardList],
      ['messages', 'Contact Messages', MessageSquare],
      ['service-requests', 'Service Requests', ClipboardList],
    ],
  ],
  [
    'Media',
    [
      ['documents', 'Documents Library', FileText],
      ['gallery', 'Photo Gallery', Image],
    ],
  ],
  [
    'Users & System',
    [
      ['users', 'Admin Users & Roles', ShieldCheck],
      ['settings', 'Site Settings', Settings],
      ['audit', 'Audit Logs', ScrollText],
    ],
  ],
];

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; role?: string };
}) {
  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto bg-[#0d3429] px-4 py-6 text-white lg:block">
        <Link href="/admin" className="flex items-center gap-3 border-b border-emerald-800/60 pb-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 font-bold text-[#0d3429]">
            <Landmark size={20} />
          </span>
          <div>
            <strong className="block text-sm font-bold leading-tight">Admin Studio</strong>
            <small className="text-[11px] text-emerald-200">श्री कुशेश्वर बाबा सहकारी</small>
          </div>
        </Link>

        <nav className="mt-5 space-y-5">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-emerald-800/40 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800/80"
          >
            <LayoutDashboard size={19} />
            Dashboard Overview
          </Link>

          {groups.map(([title, items]) => (
            <div key={title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                {title}
              </p>
              <div className="space-y-1">
                {items.map(([slug, label, Icon]) => (
                  <Link
                    key={slug}
                    href={'/admin/' + slug}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-emerald-100/90 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur sm:px-7">
          <details className="lg:hidden">
            <summary aria-label="Admin menu" className="cursor-pointer rounded-lg p-2 hover:bg-slate-100">
              <Menu size={22} />
            </summary>
            <div className="absolute left-3 top-14 w-64 rounded-xl border bg-white p-3 shadow-xl">
              <Link className="block rounded-lg p-2 text-sm font-semibold hover:bg-slate-100" href="/admin">
                Dashboard Overview
              </Link>
              {groups.flatMap((g) => g[1]).map(([slug, label]) => (
                <Link className="block rounded-lg p-2 text-xs hover:bg-slate-100" key={slug} href={'/admin/' + slug}>
                  {label}
                </Link>
              ))}
            </div>
          </details>

          <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">
            <Home size={14} />
            <span>/</span>
            <span className="font-semibold text-slate-700">Institutional CMS Admin Studio</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/messages" className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="Messages">
              <Bell size={19} />
            </Link>
            <div className="hidden text-right sm:block">
              <strong className="block text-xs font-bold text-slate-800">{user.name || 'Admin'}</strong>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                {user.role}
              </span>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button
                type="submit"
                title="Sign out"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-red-600"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </header>

        <main className="p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
