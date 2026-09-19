import { notFound } from 'next/navigation';
import { db } from '@/db';
import * as s from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { ensureSeeded } from '@/lib/data';
import { createRecord, deleteRecord, toggleRecord, updateSection, updateSetting, createAdminUser } from '../actions';
import { Plus, Search, Trash2, CheckCircle, Archive, Eye, ExternalLink, XCircle, UserPlus } from 'lucide-react';

const valid = [
  'notices',
  'services',
  'savings',
  'loans',
  'pages',
  'management',
  'loan-committee',
  'staff',
  'centers',
  'documents',
  'gallery',
  'messages',
  'membership-applications',
  'service-requests',
  'settings',
  'users',
  'audit',
];

const labels: Record<string, string> = {
  notices: 'Notices & News',
  services: 'Services',
  savings: 'Savings Plans',
  loans: 'Loan Products',
  pages: 'Homepage & Page Sections',
  management: 'Management Committee (24 Members)',
  'loan-committee': 'Loan Committee (3 Members)',
  staff: 'Staff Directory',
  centers: 'Branches & Service Centers',
  documents: 'Documents & Bylaws',
  gallery: 'Photo Gallery Albums',
  messages: 'Contact Messages & Feedback',
  'membership-applications': 'Online Membership Applications',
  'service-requests': 'Service & Loan Requests',
  settings: 'Site Settings',
  users: 'Admin Users & Roles',
  audit: 'System Audit Logs',
};

type Row = {
  id: string;
  nameNe?: string;
  nameEn?: string;
  position?: string;
  phone?: string;
  status?: string;
  detail?: string;
  createdAt?: Date;
  valueNe?: string;
  valueEn?: string;
  raw?: unknown;
};

export const dynamic = 'force-dynamic';

export default async function Module({ params }: { params: Promise<{ module: string }> }) {
  const module = (await params).module;
  if (!valid.includes(module)) notFound();
  await ensureSeeded();
  let rows: Row[] = [];

  if (module === 'notices') {
    rows = (await db.select().from(s.notices).orderBy(desc(s.notices.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.titleNe,
      nameEn: x.titleEn,
      status: x.status,
      detail: x.summaryNe,
      createdAt: x.createdAt,
    }));
  } else if (module === 'services') {
    rows = (await db.select().from(s.services).orderBy(asc(s.services.displayOrder))).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      status: x.published ? 'Published' : 'Hidden',
      detail: x.descriptionNe,
    }));
  } else if (module === 'savings') {
    rows = (await db.select().from(s.savingsPlans).orderBy(asc(s.savingsPlans.displayOrder))).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      status: x.published ? 'Published' : 'Hidden',
      detail: x.durationNe || '',
    }));
  } else if (module === 'loans') {
    rows = (await db.select().from(s.loanProducts)).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      status: x.published ? 'Published' : 'Hidden',
      detail: `${x.interestRate} | ${x.maxAmount}`,
    }));
  } else if (module === 'staff') {
    rows = (await db.select().from(s.staff).orderBy(asc(s.staff.displayOrder))).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      position: x.positionNe,
      phone: x.phone || '',
      status: x.active ? 'Active' : 'Inactive',
    }));
  } else if (module === 'management' || module === 'loan-committee') {
    rows = (
      await db
        .select()
        .from(s.committeeMembers)
        .where(eq(s.committeeMembers.committee, module === 'management' ? 'management' : 'loan'))
        .orderBy(asc(s.committeeMembers.displayOrder))
    ).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      position: x.positionNe,
      status: x.published ? 'Published' : 'Hidden',
    }));
  } else if (module === 'centers') {
    rows = (await db.select().from(s.serviceCenters)).map((x) => ({
      id: x.id,
      nameNe: x.nameNe,
      nameEn: x.nameEn,
      detail: x.addressNe,
      phone: x.phone || '',
      status: x.active ? 'Active' : 'Inactive',
    }));
  } else if (module === 'documents') {
    rows = (await db.select().from(s.documents).orderBy(desc(s.documents.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.titleNe,
      nameEn: x.titleEn,
      status: x.status,
      detail: x.fileUrl,
    }));
  } else if (module === 'messages') {
    rows = (await db.select().from(s.contactMessages).orderBy(desc(s.contactMessages.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.name,
      nameEn: x.subject,
      phone: x.phone,
      status: x.status,
      detail: x.message,
      createdAt: x.createdAt,
    }));
  } else if (module === 'membership-applications') {
    rows = (await db.select().from(s.membershipApplications).orderBy(desc(s.membershipApplications.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.fullName,
      nameEn: `नागरिकता नं: ${x.citizenshipNo}`,
      phone: x.phone,
      status: x.status,
      detail: `ठेगाना: ${x.address} | पेशा: ${x.occupation}`,
      createdAt: x.createdAt,
    }));
  } else if (module === 'service-requests') {
    rows = (await db.select().from(s.serviceRequests).orderBy(desc(s.serviceRequests.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.applicantName,
      nameEn: x.serviceName,
      phone: x.phone,
      status: x.status,
      detail: x.details || '',
      createdAt: x.createdAt,
    }));
  } else if (module === 'users') {
    rows = (await db.select().from(s.users)).map((x) => ({
      id: x.id,
      nameNe: x.name,
      nameEn: x.email,
      status: x.role,
      detail: x.active ? 'Active' : 'Disabled',
      createdAt: x.createdAt,
    }));
  } else if (module === 'audit') {
    rows = (await db.select().from(s.auditLogs).orderBy(desc(s.auditLogs.createdAt)).limit(100)).map((x) => ({
      id: x.id,
      nameNe: x.action,
      nameEn: x.entity,
      status: x.userName || 'System',
      detail: x.entityId || '',
      createdAt: x.createdAt,
    }));
  } else if (module === 'gallery') {
    rows = (await db.select().from(s.galleryAlbums).orderBy(desc(s.galleryAlbums.createdAt))).map((x) => ({
      id: x.id,
      nameNe: x.titleNe,
      nameEn: x.titleEn,
      status: x.published ? 'Published' : 'Hidden',
      detail: x.descriptionNe,
    }));
  } else if (module === 'settings') {
    const settings = await db.select().from(s.siteSettings).orderBy(asc(s.siteSettings.group));
    return <SettingsEditor rows={settings} />;
  } else if (module === 'pages') {
    const sections = await db.select().from(s.pageSections).orderBy(asc(s.pageSections.displayOrder));
    return <SectionsEditor rows={sections} />;
  }

  const canCreate = !['messages', 'membership-applications', 'service-requests', 'audit', 'gallery'].includes(module);

  return (
    <div className="space-y-6">
      <Header title={labels[module]} count={rows.length} />

      {module === 'users' && (
        <details className="rounded-2xl border bg-white shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 p-5 font-bold text-[#0d3429]">
            <UserPlus size={20} /> Add New Admin User
          </summary>
          <form action={createAdminUser} className="grid gap-4 border-t p-5 sm:grid-cols-4">
            <Field name="name" label="Full Name *" required />
            <Field name="email" label="Email Address *" required />
            <Field name="password" label="Password *" required />
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Role *</span>
              <select className="w-full rounded-xl border bg-slate-50 p-2.5 text-xs outline-none focus:border-emerald-600" name="role">
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="EDITOR">EDITOR</option>
                <option value="STAFF">STAFF</option>
              </select>
            </label>
            <div className="sm:col-span-4">
              <button className="rounded-xl bg-[#0d3429] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-900" type="submit">
                Create Admin Account
              </button>
            </div>
          </form>
        </details>
      )}

      {canCreate && module !== 'users' && (
        <details className="rounded-2xl border bg-white shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 p-5 font-bold text-[#0d3429]">
            <Plus size={20} /> Add New Entry to {labels[module]}
          </summary>
          <CreateForm module={module} />
        </details>
      )}

      {/* Table search bar */}
      <div className="flex max-w-md items-center gap-2 rounded-xl border bg-white px-3 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input aria-label="Search records" placeholder="Search entries by name or title…" className="w-full bg-transparent py-2.5 text-xs outline-none" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600">
              <th className="p-4 font-bold">Name / Title</th>
              <th className="p-4 font-bold">Details / Position</th>
              <th className="p-4 font-bold">Status / Role</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80">
                <td className="p-4">
                  <strong className="block font-bold text-slate-900">{r.nameNe}</strong>
                  <span className="text-[11px] text-slate-500">{r.nameEn}</span>
                </td>
                <td className="p-4 max-w-xs">
                  <span className="block truncate font-medium text-slate-700">{r.position || r.detail || r.phone}</span>
                  {r.position && <small className="text-slate-500">{r.phone}</small>}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      r.status === 'PUBLISHED' || r.status === 'Published' || r.status === 'Active' || r.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : r.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {r.status || '—'}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    {module === 'messages' && r.status === 'UNREAD' && (
                      <Action module={module} id={r.id} value="READ" icon={<CheckCircle size={15} />} title="Mark read" />
                    )}
                    {module === 'membership-applications' && r.status === 'PENDING' && (
                      <>
                        <Action module={module} id={r.id} value="APPROVED" icon={<CheckCircle size={15} />} title="Approve application" />
                        <Action module={module} id={r.id} value="REJECTED" icon={<XCircle size={15} />} title="Reject application" />
                      </>
                    )}
                    {module === 'notices' && r.status !== 'PUBLISHED' && (
                      <Action module={module} id={r.id} value="PUBLISHED" icon={<CheckCircle size={15} />} title="Publish notice" />
                    )}
                    {['services', 'savings', 'loans', 'staff'].includes(module) && (
                      <Action
                        module={module}
                        id={r.id}
                        value={r.status === 'Published' || r.status === 'Active' ? 'false' : 'true'}
                        icon={<Eye size={15} />}
                        title="Toggle visibility"
                      />
                    )}
                    {!['audit', 'gallery'].includes(module) && (
                      <form action={deleteRecord}>
                        <input type="hidden" name="module" value={module} />
                        <input type="hidden" name="id" value={r.id} />
                        <button className="rounded-lg border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50" title="Delete record">
                          <Trash2 size={15} />
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-12 text-center text-slate-500">No records found. Create an entry using the form above.</p>}
      </div>
    </div>
  );
}

function Header({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Institutional Content</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-xs text-slate-500">{count} total entries in database</p>
      </div>
      <a className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline" target="_blank" href="/">
        <ExternalLink size={14} /> Open Public Site
      </a>
    </div>
  );
}

function CreateForm({ module }: { module: string }) {
  return (
    <form action={createRecord} className="grid gap-5 border-t p-5 sm:grid-cols-2">
      <input type="hidden" name="module" value={module} />
      <fieldset className="space-y-3 rounded-xl border p-4">
        <legend className="px-2 text-xs font-bold text-emerald-800">नेपाली सामग्री (Nepali)</legend>
        <Field name="nameNe" label="Name / Title (NE) *" required />
        <Field name="positionNe" label="Position / Designation (NE)" />
        <Area name="descriptionNe" label="Summary / Address (NE)" />
        <Area name="contentNe" label="Detailed Content (NE)" />
      </fieldset>
      <fieldset className="space-y-3 rounded-xl border p-4">
        <legend className="px-2 text-xs font-bold text-slate-700">English Content</legend>
        <Field name="nameEn" label="Name / Title (EN)" />
        <Field name="positionEn" label="Position / Designation (EN)" />
        <Area name="descriptionEn" label="Summary / Address (EN)" />
        <Area name="contentEn" label="Detailed Content (EN)" />
      </fieldset>

      <div className="space-y-4 sm:col-span-2">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="slug" label="Slug (optional)" />
          <Field name="phone" label="Phone Number" />
          <Field name="fileUrl" label="Attachment / Photo URL" />
        </div>
        <div className="flex items-center gap-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-700">Status</span>
            <select className="rounded-xl border bg-slate-50 p-2 text-xs outline-none" name="status">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
        <button className="rounded-xl bg-[#0d3429] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-900" type="submit">
          Save Entry to Database
        </button>
      </div>
    </form>
  );
}

function Field({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-700">{label}</span>
      <input className="w-full rounded-xl border bg-slate-50/50 p-2.5 text-xs outline-none focus:border-emerald-600 focus:bg-white" name={name} required={required} />
    </label>
  );
}

function Area({ name, label }: { name: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-700">{label}</span>
      <textarea className="w-full min-h-20 rounded-xl border bg-slate-50/50 p-2.5 text-xs outline-none focus:border-emerald-600 focus:bg-white" name={name} />
    </label>
  );
}

function Action({ module, id, value, icon, title }: { module: string; id: string; value: string; icon: React.ReactNode; title: string }) {
  return (
    <form action={toggleRecord}>
      <input type="hidden" name="module" value={module} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="value" value={value} />
      <button className="rounded-lg border border-emerald-200 p-1.5 text-emerald-700 transition hover:bg-emerald-50" title={title}>
        {icon}
      </button>
    </form>
  );
}

function SettingsEditor({ rows }: { rows: (typeof s.siteSettings.$inferSelect)[] }) {
  return (
    <div className="space-y-6">
      <Header title="Institution Site Settings" count={rows.length} />
      <div className="grid gap-4">
        {rows.map((x) => (
          <form action={updateSetting} className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-[180px_1fr_1fr_auto]" key={x.id}>
            <input type="hidden" name="id" value={x.id} />
            <strong className="self-center text-xs font-bold text-slate-800 uppercase">{x.key.replaceAll('_', ' ')}</strong>
            <Field name="valueNe" label="नेपाली" required />
            <Field name="valueEn" label="English" required />
            <button className="rounded-xl bg-[#0d3429] px-4 py-2 text-xs font-bold text-white self-end hover:bg-emerald-900">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}

function SectionsEditor({ rows }: { rows: (typeof s.pageSections.$inferSelect)[] }) {
  return (
    <div className="space-y-6">
      <Header title="Homepage & Page Sections" count={rows.length} />
      <div className="grid gap-5">
        {rows.map((x) => (
          <form action={updateSection} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4" key={x.id}>
            <input type="hidden" name="id" value={x.id} />
            <div className="flex items-center justify-between border-b pb-3">
              <strong className="text-sm font-bold text-slate-900 capitalize">{x.key} Section</strong>
              <label className="text-xs font-semibold text-slate-700">
                <input type="checkbox" name="enabled" defaultChecked={x.enabled} className="mr-1" /> Section Active
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="space-y-3">
                <Field name="titleNe" label="Section Title (NE)" required />
                <Area name="contentNe" label="Section Content (NE)" />
              </fieldset>
              <fieldset className="space-y-3">
                <Field name="titleEn" label="Section Title (EN)" required />
                <Area name="contentEn" label="Section Content (EN)" />
              </fieldset>
            </div>
            <button className="rounded-xl bg-[#0d3429] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-900">
              Save Section Changes
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
