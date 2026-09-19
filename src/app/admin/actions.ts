'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import * as s from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

async function guard(write = true) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

const text = (f: FormData, k: string) => String(f.get(k) || '').trim();

async function audit(user: { id: string; name?: string | null }, action: string, entity: string, entityId?: string) {
  try {
    await db.insert(s.auditLogs).values({ userId: user.id, userName: user.name || '', action, entity, entityId });
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

export async function createRecord(form: FormData) {
  const user = await guard();
  const module = text(form, 'module');
  const ne = z.string().min(1).max(5000).parse(text(form, 'nameNe'));
  const en = text(form, 'nameEn');
  let rec: { id: string };

  switch (module) {
    case 'notices':
      rec = (await db.insert(s.notices).values({
        slug: text(form, 'slug') || `notice-${Date.now()}`,
        titleNe: ne,
        titleEn: en,
        summaryNe: text(form, 'descriptionNe'),
        summaryEn: text(form, 'descriptionEn'),
        contentNe: text(form, 'contentNe'),
        contentEn: text(form, 'contentEn'),
        status: text(form, 'status') === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        publishedAt: text(form, 'status') === 'PUBLISHED' ? new Date() : null,
        featured: form.get('featured') === 'on',
        attachmentUrl: text(form, 'fileUrl') || null,
      }).returning({ id: s.notices.id }))[0];
      break;

    case 'services':
      rec = (await db.insert(s.services).values({
        slug: text(form, 'slug') || `service-${Date.now()}`,
        nameNe: ne,
        nameEn: en,
        descriptionNe: text(form, 'descriptionNe'),
        descriptionEn: text(form, 'descriptionEn'),
        icon: text(form, 'icon') || 'Landmark',
      }).returning({ id: s.services.id }))[0];
      break;

    case 'savings':
      rec = (await db.insert(s.savingsPlans).values({
        slug: text(form, 'slug') || `savings-${Date.now()}`,
        nameNe: ne,
        nameEn: en,
        descriptionNe: text(form, 'descriptionNe'),
        descriptionEn: text(form, 'descriptionEn'),
        durationNe: text(form, 'durationNe') || '३६५ दिन',
        durationEn: text(form, 'durationEn') || '365 Days',
      }).returning({ id: s.savingsPlans.id }))[0];
      break;

    case 'loans':
      rec = (await db.insert(s.loanProducts).values({
        slug: text(form, 'slug') || `loan-${Date.now()}`,
        nameNe: ne,
        nameEn: en,
        descriptionNe: text(form, 'descriptionNe'),
        descriptionEn: text(form, 'descriptionEn'),
        interestRate: text(form, 'interestRate') || '१०% वार्षिक',
        maxAmount: text(form, 'maxAmount') || 'रु. ५,००,००० सम्म',
      }).returning({ id: s.loanProducts.id }))[0];
      break;

    case 'staff':
      rec = (await db.insert(s.staff).values({
        nameNe: ne,
        nameEn: en,
        positionNe: text(form, 'positionNe') || 'कर्मचारी',
        positionEn: text(form, 'positionEn') || 'Staff Member',
        phone: text(form, 'phone'),
        email: text(form, 'email'),
        photoUrl: text(form, 'photoUrl') || null,
      }).returning({ id: s.staff.id }))[0];
      break;

    case 'management':
    case 'loan-committee':
      rec = (await db.insert(s.committeeMembers).values({
        committee: module === 'management' ? 'management' : 'loan',
        nameNe: ne,
        nameEn: en,
        positionNe: text(form, 'positionNe') || 'सदस्य',
        positionEn: text(form, 'positionEn') || 'Member',
        phone: text(form, 'phone'),
        photoUrl: text(form, 'photoUrl') || null,
      }).returning({ id: s.committeeMembers.id }))[0];
      break;

    case 'centers':
      rec = (await db.insert(s.serviceCenters).values({
        nameNe: ne,
        nameEn: en,
        addressNe: text(form, 'descriptionNe') || 'राख्न बाँकी',
        addressEn: text(form, 'descriptionEn'),
        phone: text(form, 'phone'),
        openingDate: text(form, 'openingDate') || null,
      }).returning({ id: s.serviceCenters.id }))[0];
      break;

    case 'documents':
      rec = (await db.insert(s.documents).values({
        titleNe: ne,
        titleEn: en,
        descriptionNe: text(form, 'descriptionNe'),
        descriptionEn: text(form, 'descriptionEn'),
        fileUrl: text(form, 'fileUrl') || '/docs/sample.pdf',
        category: text(form, 'category') || 'general',
        status: text(form, 'status') === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        publishedAt: text(form, 'status') === 'PUBLISHED' ? new Date() : null,
      }).returning({ id: s.documents.id }))[0];
      break;

    default:
      throw new Error('Unsupported module');
  }

  await audit(user, 'CREATE', module, rec.id);
  revalidatePath('/admin/' + module);
  revalidatePath('/');
}

export async function deleteRecord(form: FormData) {
  const user = await guard();
  const module = text(form, 'module');
  const id = z.string().uuid().parse(text(form, 'id'));

  switch (module) {
    case 'notices':
      await db.delete(s.notices).where(eq(s.notices.id, id));
      break;
    case 'services':
      await db.delete(s.services).where(eq(s.services.id, id));
      break;
    case 'savings':
      await db.delete(s.savingsPlans).where(eq(s.savingsPlans.id, id));
      break;
    case 'loans':
      await db.delete(s.loanProducts).where(eq(s.loanProducts.id, id));
      break;
    case 'staff':
      await db.delete(s.staff).where(eq(s.staff.id, id));
      break;
    case 'management':
    case 'loan-committee':
      await db.delete(s.committeeMembers).where(eq(s.committeeMembers.id, id));
      break;
    case 'centers':
      await db.delete(s.serviceCenters).where(eq(s.serviceCenters.id, id));
      break;
    case 'documents':
      await db.delete(s.documents).where(eq(s.documents.id, id));
      break;
    case 'messages':
      await db.delete(s.contactMessages).where(eq(s.contactMessages.id, id));
      break;
    case 'membership-applications':
      await db.delete(s.membershipApplications).where(eq(s.membershipApplications.id, id));
      break;
    case 'users':
      await db.delete(s.users).where(eq(s.users.id, id));
      break;
    default:
      throw new Error('Unsupported module');
  }

  await audit(user, 'DELETE', module, id);
  revalidatePath('/admin/' + module);
  revalidatePath('/');
}

export async function toggleRecord(form: FormData) {
  const user = await guard();
  const module = text(form, 'module');
  const id = z.string().uuid().parse(text(form, 'id'));
  const value = text(form, 'value');

  switch (module) {
    case 'notices':
      await db.update(s.notices).set({
        status: value === 'PUBLISHED' ? 'PUBLISHED' : value === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT',
        publishedAt: value === 'PUBLISHED' ? new Date() : undefined,
      }).where(eq(s.notices.id, id));
      break;
    case 'services':
      await db.update(s.services).set({ published: value === 'true' }).where(eq(s.services.id, id));
      break;
    case 'savings':
      await db.update(s.savingsPlans).set({ published: value === 'true' }).where(eq(s.savingsPlans.id, id));
      break;
    case 'loans':
      await db.update(s.loanProducts).set({ published: value === 'true' }).where(eq(s.loanProducts.id, id));
      break;
    case 'staff':
      await db.update(s.staff).set({ active: value === 'true' }).where(eq(s.staff.id, id));
      break;
    case 'messages':
      await db.update(s.contactMessages).set({ status: value === 'READ' ? 'READ' : value === 'ARCHIVED' ? 'ARCHIVED' : 'UNREAD' }).where(eq(s.contactMessages.id, id));
      break;
    case 'membership-applications':
      await db.update(s.membershipApplications).set({ status: value === 'APPROVED' ? 'APPROVED' : value === 'REJECTED' ? 'REJECTED' : 'PENDING' }).where(eq(s.membershipApplications.id, id));
      break;
    default:
      throw new Error('Unsupported module');
  }

  await audit(user, 'UPDATE_STATUS', module, id);
  revalidatePath('/admin/' + module);
  revalidatePath('/');
}

export async function updateSetting(form: FormData) {
  const user = await guard();
  const id = z.string().uuid().parse(text(form, 'id'));
  await db.update(s.siteSettings).set({
    valueNe: text(form, 'valueNe'),
    valueEn: text(form, 'valueEn'),
    updatedAt: new Date(),
  }).where(eq(s.siteSettings.id, id));

  await audit(user, 'UPDATE', 'settings', id);
  revalidatePath('/admin/settings');
  revalidatePath('/');
}

export async function updateSection(form: FormData) {
  const user = await guard();
  const id = z.string().uuid().parse(text(form, 'id'));
  await db.update(s.pageSections).set({
    titleNe: text(form, 'titleNe'),
    titleEn: text(form, 'titleEn'),
    contentNe: text(form, 'contentNe'),
    contentEn: text(form, 'contentEn'),
    enabled: form.get('enabled') === 'on',
    updatedAt: new Date(),
  }).where(eq(s.pageSections.id, id));

  await audit(user, 'UPDATE', 'pages', id);
  revalidatePath('/admin/pages');
  revalidatePath('/');
}

export async function createAdminUser(form: FormData) {
  const user = await guard();
  const email = text(form, 'email').toLowerCase();
  const name = text(form, 'name');
  const password = text(form, 'password');
  const role = (text(form, 'role') as any) || 'STAFF';

  if (!email || !password || !name) throw new Error('Missing fields');

  const passwordHash = await bcrypt.hash(password, 10);
  const [created] = await db.insert(s.users).values({
    email,
    name,
    passwordHash,
    role,
    active: true,
  }).returning({ id: s.users.id });

  await audit(user, 'CREATE', 'users', created.id);
  revalidatePath('/admin/users');
}

export async function submitPublicMembership(form: FormData) {
  const fullName = text(form, 'fullName');
  const address = text(form, 'address');
  const phone = text(form, 'phone');
  const citizenshipNo = text(form, 'citizenshipNo');

  if (!fullName || !address || !phone || !citizenshipNo) {
    throw new Error('कृप्या सम्पूर्ण आवश्यक विवरण भर्नुहोस्।');
  }

  await db.insert(s.membershipApplications).values({
    fullName,
    address,
    phone,
    email: text(form, 'email') || null,
    citizenshipNo,
    occupation: text(form, 'occupation') || 'कृषि',
    status: 'PENDING',
  });

  revalidatePath('/admin/membership-applications');
  return { success: true };
}

export async function submitPublicContact(form: FormData) {
  const name = text(form, 'name');
  const phone = text(form, 'phone');
  const subject = text(form, 'subject') || 'सामान्य सोधपुछ';
  const message = text(form, 'message');

  if (!name || !phone || !message) {
    throw new Error('कृप्या सम्पूर्ण विवरण भर्नुहोस्।');
  }

  await db.insert(s.contactMessages).values({
    name,
    phone,
    email: text(form, 'email') || null,
    subject,
    message,
    status: 'UNREAD',
  });

  revalidatePath('/admin/messages');
  return { success: true };
}
