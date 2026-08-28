import { and, desc, eq, gt, inArray, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { advertisements, InsertAdvertisement, InsertSiteAsset, InsertSiteSection, InsertSiteTheme, InsertSubmission, InsertUser, siteAssets, siteContentRevisions, siteSections, siteThemes, submissionAttachments, submissions, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      const value = user[field] ?? null;
      values[field] = value;
      updateSet[field] = value;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createSubmission(input: InsertSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(submissions).values(input);
  return Number(result[0].insertId);
}

export async function createSubmissionAttachment(input: { submissionId: number; storageKey: string; storageUrl: string; originalName: string; mimeType: string; byteSize: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(submissionAttachments).values(input);
}

export async function listPublicSubmissions(category?: InsertSubmission["category"]) {
  const db = await getDb();
  if (!db) return [];
  const conditions = category
    ? and(eq(submissions.status, "approved"), eq(submissions.category, category))
    : eq(submissions.status, "approved");
  return db.select({
    id: submissions.id,
    category: submissions.category,
    status: submissions.status,
    title: submissions.title,
    description: submissions.description,
    propertyType: submissions.propertyType,
    productType: submissions.productType,
    price: submissions.price,
    publishedAt: submissions.publishedAt,
    createdAt: submissions.createdAt,
  }).from(submissions).where(conditions).orderBy(desc(submissions.publishedAt));
}

export async function listAdminSubmissions(status?: InsertSubmission["status"]) {
  const db = await getDb();
  if (!db) return [];
  const conditions = status ? eq(submissions.status, status) : undefined;
  return db.select().from(submissions).where(conditions).orderBy(desc(submissions.createdAt));
}

export async function updateSubmissionStatus(id: number, status: InsertSubmission["status"], reviewedBy: number, internalNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(submissions).set({
    status,
    reviewedBy,
    reviewedAt: new Date(),
    publishedAt: status === "approved" ? new Date() : null,
    internalNotes: internalNotes ?? undefined,
  }).where(eq(submissions.id, id));
}

export async function listActiveAdvertisements(now = new Date()) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: advertisements.id,
    title: advertisements.title,
    message: advertisements.message,
    linkUrl: advertisements.linkUrl,
    startsAt: advertisements.startsAt,
    endsAt: advertisements.endsAt,
    priority: advertisements.priority,
  }).from(advertisements).where(and(
    inArray(advertisements.status, ["published", "scheduled"]),
    lte(advertisements.startsAt, now),
    gt(advertisements.endsAt, now),
  )).orderBy(desc(advertisements.priority), desc(advertisements.startsAt));
}

export type AdvertisementLifecycle = "draft" | "scheduled" | "published" | "paused" | "expired";
export function computeAdvertisementStatus(ad: { status: AdvertisementLifecycle; startsAt: Date; endsAt: Date }, now = new Date()): AdvertisementLifecycle {
  if (ad.status === "draft" || ad.status === "paused") return ad.status;
  if (ad.endsAt <= now) return "expired";
  if (ad.startsAt > now) return "scheduled";
  return "published";
}

export function decorateAdvertisement<T extends { status: AdvertisementLifecycle; startsAt: Date; endsAt: Date }>(row: T, now = new Date()) {
  return { ...row, currentStatus: computeAdvertisementStatus(row, now) };
}

export async function listAdminAdvertisements() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(advertisements).orderBy(desc(advertisements.createdAt));
  return rows.map((row) => decorateAdvertisement(row));
}

export async function createAdvertisement(input: InsertAdvertisement) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(advertisements).values(input);
  return Number(result[0].insertId);
}

export async function updateAdvertisement(id: number, input: Partial<InsertAdvertisement>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(advertisements).set(input).where(eq(advertisements.id, id));
}

export async function deleteAdvertisement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.delete(advertisements).where(eq(advertisements.id, id));
}

export async function listPublishedSiteAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteAssets).where(eq(siteAssets.isPublished, 1)).orderBy(desc(siteAssets.updatedAt));
}

export async function listAdminSiteAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteAssets).orderBy(desc(siteAssets.updatedAt));
}

export async function createSiteAsset(input: InsertSiteAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(siteAssets).values(input);
  return Number(result[0].insertId);
}

export async function updateSiteAsset(id: number, input: Partial<InsertSiteAsset>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(siteAssets).set(input).where(eq(siteAssets.id, id));
}

export async function listPublishedSiteThemes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteThemes).where(eq(siteThemes.isActive, 1)).orderBy(desc(siteThemes.updatedAt));
}

export async function listAdminSiteThemes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteThemes).orderBy(desc(siteThemes.updatedAt));
}

export async function createSiteTheme(input: InsertSiteTheme) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(siteThemes).values(input);
  return Number(result[0].insertId);
}

export async function activateSiteTheme(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(siteThemes).set({ isActive: 0 });
  await db.update(siteThemes).set({ isActive: 1 }).where(eq(siteThemes.id, id));
}

export async function listPublishedSiteSections() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSections).where(eq(siteSections.isPublished, 1)).orderBy(siteSections.sortOrder, siteSections.id);
}

export async function listAdminSiteSections() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSections).orderBy(siteSections.sortOrder, siteSections.id);
}

export async function createSiteSection(input: InsertSiteSection) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(siteSections).values(input);
  return Number(result[0].insertId);
}

export async function updateSiteSection(id: number, input: Partial<InsertSiteSection>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(siteSections).set(input).where(eq(siteSections.id, id));
}

export async function recordSiteRevision(input: { entityType: "asset" | "theme" | "section"; entityId: number; action: "create" | "update" | "publish"; snapshot: unknown; createdBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(siteContentRevisions).values(input);
}

export async function listSiteRevisions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteContentRevisions).orderBy(desc(siteContentRevisions.createdAt)).limit(50);
}

export async function restoreSiteRevision(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const rows = await db.select().from(siteContentRevisions).where(eq(siteContentRevisions.id, id)).limit(1);
  const revision = rows[0];
  if (!revision) throw new Error("Revision not found");
  const snapshot = revision.snapshot as Record<string, unknown>;
  if (revision.entityType === "asset") await db.update(siteAssets).set({ name: String(snapshot.name), url: String(snapshot.url), altText: String(snapshot.altText), isPublished: Number(snapshot.isPublished) }).where(eq(siteAssets.id, revision.entityId));
  if (revision.entityType === "theme") await db.update(siteThemes).set({ name: String(snapshot.name), config: snapshot.config, isActive: Number(snapshot.isActive) }).where(eq(siteThemes.id, revision.entityId));
  if (revision.entityType === "section") await db.update(siteSections).set({ slug: String(snapshot.slug), title: String(snapshot.title), description: snapshot.description ? String(snapshot.description) : null, sortOrder: Number(snapshot.sortOrder), isPublished: Number(snapshot.isPublished) }).where(eq(siteSections.id, revision.entityId));
}
