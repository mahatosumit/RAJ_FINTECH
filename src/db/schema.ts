import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "ADMIN", "EDITOR", "STAFF"]);
export const statusEnum = pgEnum("content_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const messageStatusEnum = pgEnum("message_status", ["UNREAD", "READ", "ARCHIVED"]);
export const appStatusEnum = pgEnum("application_status", ["PENDING", "APPROVED", "REJECTED"]);

const id = () => uuid("id").defaultRandom().primaryKey();
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("users", {
  id: id(), email: text("email").notNull(), name: text("name").notNull(), passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("STAFF").notNull(), active: boolean("active").default(true).notNull(), lastLoginAt: timestamp("last_login_at", { withTimezone: true }), ...timestamps,
}, (t) => [uniqueIndex("users_email_idx").on(t.email)]);

export const siteSettings = pgTable("site_settings", {
  id: id(), key: text("key").notNull(), valueNe: text("value_ne").default("").notNull(), valueEn: text("value_en").default("").notNull(), group: text("group_name").default("general").notNull(), ...timestamps,
}, (t) => [uniqueIndex("settings_key_idx").on(t.key)]);

export const pageSections = pgTable("page_sections", {
  id: id(), key: text("key").notNull(), titleNe: text("title_ne").default("").notNull(), titleEn: text("title_en").default("").notNull(),
  contentNe: text("content_ne").default("").notNull(), contentEn: text("content_en").default("").notNull(), imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0).notNull(), enabled: boolean("enabled").default(true).notNull(), ...timestamps,
}, (t) => [uniqueIndex("sections_key_idx").on(t.key)]);

export const serviceCenters = pgTable("service_centers", {
  id: id(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), addressNe: text("address_ne").notNull(), addressEn: text("address_en").default("").notNull(), phone: text("phone"), openingDate: text("opening_date"), displayOrder: integer("display_order").default(0).notNull(), active: boolean("active").default(true).notNull(), ...timestamps,
});

export const committeeMembers = pgTable("committee_members", {
  id: id(), committee: text("committee").notNull(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), positionNe: text("position_ne").notNull(), positionEn: text("position_en").default("").notNull(), phone: text("phone"), photoUrl: text("photo_url"), displayOrder: integer("display_order").default(0).notNull(), published: boolean("published").default(true).notNull(), ...timestamps,
});

export const staff = pgTable("staff", {
  id: id(), centerId: uuid("center_id").references(() => serviceCenters.id, { onDelete: "set null" }), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), positionNe: text("position_ne").notNull(), positionEn: text("position_en").default("").notNull(), phone: text("phone"), email: text("email"), photoUrl: text("photo_url"), displayOrder: integer("display_order").default(0).notNull(), active: boolean("active").default(true).notNull(), ...timestamps,
});

export const objectives = pgTable("objectives", {
  id: id(), textNe: text("text_ne").notNull(), textEn: text("text_en").default("").notNull(), displayOrder: integer("display_order").default(0).notNull(), enabled: boolean("enabled").default(true).notNull(), ...timestamps,
});

export const services = pgTable("services", {
  id: id(), slug: text("slug").notNull(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), descriptionNe: text("description_ne").default("").notNull(), descriptionEn: text("description_en").default("").notNull(), icon: text("icon").default("Landmark").notNull(), imageUrl: text("image_url"), displayOrder: integer("display_order").default(0).notNull(), published: boolean("published").default(true).notNull(), ...timestamps,
}, (t) => [uniqueIndex("services_slug_idx").on(t.slug)]);

export const savingsPlans = pgTable("savings_plans", {
  id: id(), slug: text("slug").notNull(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), descriptionNe: text("description_ne").default("").notNull(), descriptionEn: text("description_en").default("").notNull(), durationNe: text("duration_ne"), durationEn: text("duration_en"), rates: jsonb("rates").$type<Array<{labelNe:string;labelEn:string;valueNe:string;valueEn:string}>>().default([]).notNull(), displayOrder: integer("display_order").default(0).notNull(), published: boolean("published").default(true).notNull(), ...timestamps,
}, (t) => [uniqueIndex("savings_slug_idx").on(t.slug)]);

export const loanProducts = pgTable("loan_products", {
  id: id(), slug: text("slug").notNull(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), descriptionNe: text("description_ne").default("").notNull(), descriptionEn: text("description_en").default("").notNull(), eligibilityNe: text("eligibility_ne").default("राख्न बाँकी").notNull(), eligibilityEn: text("eligibility_en").default("To be updated").notNull(), documentsNe: text("documents_ne").default("राख्न बाँकी").notNull(), documentsEn: text("documents_en").default("To be updated").notNull(), interestRate: text("interest_rate").default("राख्न बाँकी / To be updated").notNull(), processingFee: text("processing_fee").default("राख्न बाँकी / To be updated").notNull(), maxAmount: text("max_amount").default("राख्न बाँकी / To be updated").notNull(), tenure: text("tenure").default("राख्न बाँकी / To be updated").notNull(), published: boolean("published").default(true).notNull(), ...timestamps,
}, (t) => [uniqueIndex("loans_slug_idx").on(t.slug)]);

export const noticeCategories = pgTable("notice_categories", { id: id(), nameNe: text("name_ne").notNull(), nameEn: text("name_en").default("").notNull(), slug: text("slug").notNull(), ...timestamps }, (t) => [uniqueIndex("notice_cat_slug_idx").on(t.slug)]);
export const notices = pgTable("notices", {
  id: id(), categoryId: uuid("category_id").references(() => noticeCategories.id, { onDelete: "set null" }), slug: text("slug").notNull(), titleNe: text("title_ne").notNull(), titleEn: text("title_en").default("").notNull(), summaryNe: text("summary_ne").default("").notNull(), summaryEn: text("summary_en").default("").notNull(), contentNe: text("content_ne").default("").notNull(), contentEn: text("content_en").default("").notNull(), featuredImage: text("featured_image"), attachmentUrl: text("attachment_url"), publishedAt: timestamp("published_at", { withTimezone: true }), expiresAt: timestamp("expires_at", { withTimezone: true }), author: text("author"), status: statusEnum("status").default("DRAFT").notNull(), featured: boolean("featured").default(false).notNull(), ...timestamps,
}, (t) => [uniqueIndex("notices_slug_idx").on(t.slug)]);

export const documents = pgTable("documents", { id: id(), titleNe: text("title_ne").notNull(), titleEn: text("title_en").default("").notNull(), descriptionNe: text("description_ne").default("").notNull(), descriptionEn: text("description_en").default("").notNull(), category: text("category").default("general").notNull(), fileUrl: text("file_url").notNull(), mimeType: text("mime_type"), status: statusEnum("status").default("DRAFT").notNull(), publishedAt: timestamp("published_at", { withTimezone: true }), ...timestamps });
export const galleryAlbums = pgTable("gallery_albums", { id: id(), titleNe: text("title_ne").notNull(), titleEn: text("title_en").default("").notNull(), descriptionNe: text("description_ne").default("").notNull(), descriptionEn: text("description_en").default("").notNull(), published: boolean("published").default(true).notNull(), ...timestamps });
export const galleryImages = pgTable("gallery_images", { id: id(), albumId: uuid("album_id").references(() => galleryAlbums.id, { onDelete: "cascade" }).notNull(), imageUrl: text("image_url").notNull(), captionNe: text("caption_ne").default("").notNull(), captionEn: text("caption_en").default("").notNull(), altText: text("alt_text").default("").notNull(), displayOrder: integer("display_order").default(0).notNull(), featured: boolean("featured").default(false).notNull(), ...timestamps });
export const media = pgTable("media", { id: id(), fileName: text("file_name").notNull(), storageKey: text("storage_key").notNull(), url: text("url").notNull(), mimeType: text("mime_type").notNull(), size: integer("size").notNull(), altText: text("alt_text").default("").notNull(), uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }), ...timestamps });

export const contactMessages = pgTable("contact_messages", { id: id(), name: text("name").notNull(), phone: text("phone").notNull(), email: text("email"), subject: text("subject").notNull(), message: text("message").notNull(), status: messageStatusEnum("status").default("UNREAD").notNull(), ipHash: text("ip_hash"), ...timestamps });

export const membershipApplications = pgTable("membership_applications", {
  id: id(),
  fullName: text("full_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  citizenshipNo: text("citizenship_no").notNull(),
  occupation: text("occupation").default("कृषि").notNull(),
  status: appStatusEnum("status").default("PENDING").notNull(),
  notes: text("notes"),
  ...timestamps,
});

export const serviceRequests = pgTable("service_requests", {
  id: id(),
  serviceName: text("service_name").notNull(),
  applicantName: text("applicant_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  details: text("details"),
  status: appStatusEnum("status").default("PENDING").notNull(),
  ...timestamps,
});

export const auditLogs = pgTable("audit_logs", { id: id(), userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), userName: text("user_name"), action: text("action").notNull(), entity: text("entity").notNull(), entityId: text("entity_id"), ipAddress: text("ip_address"), userAgent: text("user_agent"), metadata: jsonb("metadata"), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull() });

