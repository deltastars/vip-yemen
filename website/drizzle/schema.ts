import { index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["employment", "realEstateOffer", "realEstateRequest", "productOffer", "productRequest", "software"]).notNull(),
  status: mysqlEnum("status", ["pending", "inReview", "approved", "rejected", "archived", "sold"]).default("pending").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  address: varchar("address", { length: 300 }),
  organizationName: varchar("organizationName", { length: 220 }),
  profession: varchar("profession", { length: 180 }),
  requirements: text("requirements"),
  propertyType: varchar("propertyType", { length: 80 }),
  productType: varchar("productType", { length: 100 }),
  price: varchar("price", { length: 80 }),
  publishedAt: timestamp("publishedAt"),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: int("reviewedBy"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("submissions_status_idx").on(table.status),
  categoryIdx: index("submissions_category_idx").on(table.category),
  createdAtIdx: index("submissions_created_at_idx").on(table.createdAt),
}));

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

export const submissionAttachments = mysqlTable("submission_attachments", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1000 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  byteSize: int("byteSize").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  submissionIdx: index("submission_attachments_submission_idx").on(table.submissionId),
}));

export type SubmissionAttachment = typeof submissionAttachments.$inferSelect;
export type InsertSubmissionAttachment = typeof submissionAttachments.$inferInsert;

export const advertisements = mysqlTable("advertisements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  message: varchar("message", { length: 500 }).notNull(),
  linkUrl: varchar("linkUrl", { length: 1000 }),
  status: mysqlEnum("status", ["draft", "scheduled", "published", "paused", "expired"]).default("draft").notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  priority: int("priority").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  activeWindowIdx: index("advertisements_window_idx").on(table.status, table.startsAt, table.endsAt),
  priorityIdx: index("advertisements_priority_idx").on(table.priority),
}));

export type Advertisement = typeof advertisements.$inferSelect;
export type InsertAdvertisement = typeof advertisements.$inferInsert;

export const siteAssets = mysqlTable("site_assets", {
  id: int("id").autoincrement().primaryKey(),
  kind: mysqlEnum("kind", ["image", "banner", "icon"]).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  altText: varchar("altText", { length: 220 }).notNull(),
  isPublished: int("isPublished").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ kindIdx: index("site_assets_kind_idx").on(table.kind), publishedIdx: index("site_assets_published_idx").on(table.isPublished) }));
export type SiteAsset = typeof siteAssets.$inferSelect;
export type InsertSiteAsset = typeof siteAssets.$inferInsert;

export const siteThemes = mysqlTable("site_themes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  config: json("config").notNull(),
  isActive: int("isActive").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SiteTheme = typeof siteThemes.$inferSelect;
export type InsertSiteTheme = typeof siteThemes.$inferInsert;

export const siteSections = mysqlTable("site_sections", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ sortIdx: index("site_sections_sort_idx").on(table.sortOrder), publishedIdx: index("site_sections_published_idx").on(table.isPublished) }));
export type SiteSection = typeof siteSections.$inferSelect;
export type InsertSiteSection = typeof siteSections.$inferInsert;

export const siteContentRevisions = mysqlTable("site_content_revisions", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entityType", ["asset", "theme", "section"]).notNull(),
  entityId: int("entityId").notNull(),
  action: mysqlEnum("action", ["create", "update", "publish"]).notNull(),
  snapshot: json("snapshot").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ entityIdx: index("site_content_revisions_entity_idx").on(table.entityType, table.entityId), createdIdx: index("site_content_revisions_created_idx").on(table.createdAt) }));
export type SiteContentRevision = typeof siteContentRevisions.$inferSelect;
export type InsertSiteContentRevision = typeof siteContentRevisions.$inferInsert;

export const offers = mysqlTable("offers", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  videoUrl: varchar("videoUrl", { length: 1000 }),
  category: varchar("category", { length: 100 }),
  originalPrice: varchar("originalPrice", { length: 80 }),
  offerPrice: varchar("offerPrice", { length: 80 }),
  discountPercent: int("discountPercent"),
  status: mysqlEnum("status", ["draft", "scheduled", "published", "paused", "expired"]).default("draft").notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  priority: int("priority").default(0).notNull(),
  isFeatured: int("isFeatured").default(0).notNull(),
  contactPhone: varchar("contactPhone", { length: 32 }),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("offers_status_idx").on(table.status),
  featuredIdx: index("offers_featured_idx").on(table.isFeatured),
  priorityIdx: index("offers_priority_idx").on(table.priority),
}));
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = typeof offers.$inferInsert;

export const offerAttachments = mysqlTable("offer_attachments", {
  id: int("id").autoincrement().primaryKey(),
  offerId: int("offerId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1000 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  offerIdx: index("offer_attachments_offer_idx").on(table.offerId),
}));
export type OfferAttachment = typeof offerAttachments.$inferSelect;
export type InsertOfferAttachment = typeof offerAttachments.$inferInsert;
