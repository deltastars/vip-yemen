import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, ownerProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { createSubmissionAttachment } from "./db";
import {
  createAdvertisement,
  decorateAdvertisement,
  createSubmission,
  deleteAdvertisement,
  listActiveAdvertisements,
  listAdminAdvertisements,
  listAdminSubmissions,
  listPublicSubmissions,
  updateAdvertisement,
  updateSubmissionStatus,
  listPublishedSiteAssets,
  listAdminSiteAssets,
  createSiteAsset,
  updateSiteAsset,
  listPublishedSiteThemes,
  listAdminSiteThemes,
  createSiteTheme,
  activateSiteTheme,
  listPublishedSiteSections,
  listAdminSiteSections,
  createSiteSection,
  updateSiteSection,
  recordSiteRevision,
  listSiteRevisions,
  restoreSiteRevision,
  listPublishedOffers,
  listAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "./db";

const categorySchema = z.enum(["employment", "realEstateOffer", "realEstateRequest", "productOffer", "productRequest", "software"]);
const statusSchema = z.enum(["pending", "inReview", "approved", "rejected", "archived", "sold"]);
const adStatusSchema = z.enum(["draft", "scheduled", "published", "paused", "expired"]);
const dateInput = z.coerce.date();
const safeAssetUrl = z.string().trim().min(1).max(1000).refine(value => value.startsWith("/manus-storage/") || value.startsWith("https://"), { message: "يجب أن يكون رابط الأصل من التخزين أو HTTPS" });
const assetDataUrl = z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).optional();
const themeConfigSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
}).strict();

export const normalizeYemenPhone = (value: string) => value.trim().replace(/[\s()-]/g, "");
export const isValidYemenPhone = (value: string) => /^(?:(?:\+|00)?967)?7[0-9]{8}$/.test(normalizeYemenPhone(value));

const submissionInput = z.object({
  category: categorySchema,
  title: z.string().trim().min(3).max(220),
  description: z.string().trim().min(10).max(10000),
  fullName: z.string().trim().min(2).max(180),
  phone: z.string().trim().transform(normalizeYemenPhone).refine(isValidYemenPhone, { message: "أدخل رقم هاتف يمني صالحًا يبدأ بـ 7 أو بمفتاح اليمن" }),
  address: z.string().trim().max(300).optional(),
  organizationName: z.string().trim().max(220).optional(),
  profession: z.string().trim().max(180).optional(),
  requirements: z.string().trim().max(10000).optional(),
  propertyType: z.string().trim().max(80).optional(),
  productType: z.string().trim().max(100).optional(),
  price: z.string().trim().max(80).optional(),
  attachments: z.array(z.object({ name: z.string().trim().min(1).max(255), mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4", "video/webm", "video/quicktime"]), dataUrl: z.string().regex(/^data:(image\/(jpeg|png|webp)|application\/pdf|video\/(mp4|webm|quicktime));base64,[A-Za-z0-9+/=]+$/) })).max(6).optional(),
});

export const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ ok: true, service: "vipyemen" })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  advertisements: router({
    active: publicProcedure.query(() => listActiveAdvertisements()),
    adminList: adminProcedure.query(async () => (await listAdminAdvertisements()).map(ad => decorateAdvertisement(ad))),
    create: adminProcedure.input(z.object({
      title: z.string().trim().min(2).max(220),
      message: z.string().trim().min(2).max(500),
      linkUrl: z.string().url().max(1000).optional().or(z.literal("")),
      status: adStatusSchema.default("draft"),
      startsAt: dateInput,
      endsAt: dateInput,
      priority: z.number().int().min(-100).max(100).default(0),
    })).mutation(async ({ input, ctx }) => {
      if (input.endsAt <= input.startsAt) throw new TRPCError({ code: "BAD_REQUEST", message: "تاريخ نهاية الإعلان يجب أن يكون بعد تاريخ البداية" });
      const id = await createAdvertisement({ ...input, linkUrl: input.linkUrl || null, createdBy: ctx.user.id });
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().trim().min(2).max(220).optional(),
      message: z.string().trim().min(2).max(500).optional(),
      linkUrl: z.string().url().max(1000).optional().or(z.literal("")),
      status: adStatusSchema.optional(),
      startsAt: dateInput.optional(),
      endsAt: dateInput.optional(),
      priority: z.number().int().min(-100).max(100).optional(),
    })).mutation(async ({ input }) => {
      if (input.startsAt && input.endsAt && input.endsAt <= input.startsAt) throw new TRPCError({ code: "BAD_REQUEST", message: "تاريخ نهاية الإعلان يجب أن يكون بعد تاريخ البداية" });
      const { id, ...patch } = input;
      await updateAdvertisement(id, { ...patch, linkUrl: patch.linkUrl === "" ? null : patch.linkUrl });
      return { success: true } as const;
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteAdvertisement(input.id);
      return { success: true } as const;
    }),
  }),
  siteContent: router({
    publishedAssets: publicProcedure.query(() => listPublishedSiteAssets()),
    publishedThemes: publicProcedure.query(() => listPublishedSiteThemes()),
    publishedSections: publicProcedure.query(() => listPublishedSiteSections()),
    canManage: adminProcedure.query(({ ctx }) => ctx.user.openId === ENV.ownerOpenId),
    adminAssets: ownerProcedure.query(() => listAdminSiteAssets()),
    revisions: ownerProcedure.query(() => listSiteRevisions()),
    restoreRevision: ownerProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => restoreSiteRevision(input.id)),
    createAsset: ownerProcedure.input(z.object({ kind: z.enum(["image", "banner", "icon"]), name: z.string().trim().min(2).max(160), url: safeAssetUrl.optional().or(z.literal("")), dataUrl: assetDataUrl, altText: z.string().trim().min(2).max(220), isPublished: z.boolean().default(false) })).mutation(async ({ input, ctx }) => { let url = input.url || ""; if (input.dataUrl) { const [header, encoded] = input.dataUrl.split(",", 2); const mimeType = header?.match(/^data:(image\/(?:jpeg|png|webp));base64$/)?.[1]; const buffer = Buffer.from(encoded || "", "base64"); if (!mimeType || buffer.byteLength > 8 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "الصورة غير صالحة أو تتجاوز 8 ميغابايت" }); const uploaded = await storagePut(`site-assets/${ctx.user.id}/${Date.now()}-${input.name}`, buffer, mimeType); url = uploaded.url; } if (!url) throw new TRPCError({ code: "BAD_REQUEST", message: "أدخل رابط الأصل أو ارفع صورة" }); const id = await createSiteAsset({ kind: input.kind, name: input.name, url, altText: input.altText, isPublished: input.isPublished ? 1 : 0, createdBy: ctx.user.id }); await recordSiteRevision({ entityType: "asset", entityId: id, action: input.isPublished ? "publish" : "create", snapshot: { name: input.name, url, altText: input.altText, isPublished: input.isPublished ? 1 : 0 }, createdBy: ctx.user.id }); return id; }),
    updateAsset: ownerProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(2).max(160).optional(), url: safeAssetUrl.optional(), altText: z.string().trim().min(2).max(220).optional(), isPublished: z.boolean().optional() })).mutation(async ({ input, ctx }) => { const current = (await listAdminSiteAssets()).find(row => row.id === input.id); if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "الأصل غير موجود" }); const { id, isPublished, ...rest } = input; const patch = { ...rest, ...(isPublished === undefined ? {} : { isPublished: isPublished ? 1 : 0 }) }; await updateSiteAsset(id, patch); await recordSiteRevision({ entityType: "asset", entityId: id, action: isPublished === undefined ? "update" : "publish", snapshot: { name: rest.name ?? current.name, url: rest.url ?? current.url, altText: rest.altText ?? current.altText, isPublished: isPublished === undefined ? current.isPublished : (isPublished ? 1 : 0) }, createdBy: ctx.user.id }); return { success: true }; }),
    adminThemes: ownerProcedure.query(() => listAdminSiteThemes()),
    createTheme: ownerProcedure.input(z.object({ name: z.string().trim().min(2).max(120), config: themeConfigSchema })).mutation(async ({ input, ctx }) => { const id = await createSiteTheme({ ...input, isActive: 0, createdBy: ctx.user.id }); await recordSiteRevision({ entityType: "theme", entityId: id, action: "create", snapshot: { name: input.name, config: input.config, isActive: 0 }, createdBy: ctx.user.id }); return id; }),
    activateTheme: ownerProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input, ctx }) => { const current = (await listAdminSiteThemes()).find(row => row.id === input.id); if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "الثيم غير موجود" }); await recordSiteRevision({ entityType: "theme", entityId: input.id, action: "publish", snapshot: { name: current.name, config: current.config, isActive: current.isActive }, createdBy: ctx.user.id }); await activateSiteTheme(input.id); return { success: true }; }),
    adminSections: ownerProcedure.query(() => listAdminSiteSections()),
    createSection: ownerProcedure.input(z.object({ slug: z.string().trim().regex(/^[a-z0-9-]{2,100}$/), title: z.string().trim().min(2).max(160), description: z.string().trim().max(2000).optional(), sortOrder: z.number().int().min(0).max(10000).default(0), isPublished: z.boolean().default(true) })).mutation(async ({ input, ctx }) => { const id = await createSiteSection({ ...input, isPublished: input.isPublished ? 1 : 0, createdBy: ctx.user.id }); await recordSiteRevision({ entityType: "section", entityId: id, action: input.isPublished ? "publish" : "create", snapshot: { slug: input.slug, title: input.title, description: input.description || null, sortOrder: input.sortOrder, isPublished: input.isPublished ? 1 : 0 }, createdBy: ctx.user.id }); return id; }),
    updateSection: ownerProcedure.input(z.object({ id: z.number().int().positive(), slug: z.string().trim().regex(/^[a-z0-9-]{2,100}$/).optional(), title: z.string().trim().min(2).max(160).optional(), description: z.string().trim().max(2000).optional(), sortOrder: z.number().int().min(0).max(10000).optional(), isPublished: z.boolean().optional() })).mutation(async ({ input, ctx }) => { const current = (await listAdminSiteSections()).find(row => row.id === input.id); if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "القسم غير موجود" }); const { id, isPublished, ...rest } = input; await updateSiteSection(id, { ...rest, ...(isPublished === undefined ? {} : { isPublished: isPublished ? 1 : 0 }) }); await recordSiteRevision({ entityType: "section", entityId: id, action: isPublished === undefined ? "update" : "publish", snapshot: { slug: rest.slug ?? current.slug, title: rest.title ?? current.title, description: rest.description ?? current.description, sortOrder: rest.sortOrder ?? current.sortOrder, isPublished: isPublished === undefined ? current.isPublished : (isPublished ? 1 : 0) }, createdBy: ctx.user.id }); return { success: true }; }),
  }),
  offers: router({
    list: publicProcedure.query(() => listPublishedOffers()),
    adminList: adminProcedure.query(() => listAdminOffers()),
    create: adminProcedure.input(z.object({
      title: z.string().trim().min(2).max(220),
      description: z.string().trim().min(5).max(10000),
      imageUrl: z.string().max(1000).optional(),
      videoUrl: z.string().max(1000).optional(),
      imageDataUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).optional(),
      videoDataUrl: z.string().regex(/^data:video\/(mp4|webm|quicktime);base64,[A-Za-z0-9+/=]+$/).optional(),
      category: z.string().max(100).optional(),
      originalPrice: z.string().max(80).optional(),
      offerPrice: z.string().max(80).optional(),
      discountPercent: z.number().int().min(0).max(100).optional(),
      status: z.enum(["draft", "scheduled", "published", "paused", "expired"]).default("draft"),
      startsAt: dateInput.optional(),
      endsAt: dateInput.optional(),
      priority: z.number().int().min(-100).max(100).default(0),
      isFeatured: z.boolean().default(false),
      contactPhone: z.string().max(32).optional(),
    })).mutation(async ({ input, ctx }) => {
      const { imageDataUrl, videoDataUrl, ...rest } = input;
      let imageUrl = rest.imageUrl;
      let videoUrl = rest.videoUrl;
      if (imageDataUrl) {
        const [header, encoded] = imageDataUrl.split(",", 2);
        const mimeType = header?.match(/^data:(image\/(?:jpeg|png|webp));base64$/)?.[1];
        const buffer = Buffer.from(encoded || "", "base64");
        if (!mimeType || buffer.byteLength > 8 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "صورة العرض غير صالحة أو تتجاوز 8 ميغابايت" });
        const uploaded = await storagePut(`offers/${Date.now()}-${rest.title.slice(0, 40)}-image`, buffer, mimeType);
        imageUrl = uploaded.url;
      }
      if (videoDataUrl) {
        const [header, encoded] = videoDataUrl.split(",", 2);
        const mimeType = header?.match(/^data:(video\/(?:mp4|webm|quicktime));base64$/)?.[1];
        const buffer = Buffer.from(encoded || "", "base64");
        if (!mimeType || buffer.byteLength > 25 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "فيديو العرض غير صالح أو يتجاوز 25 ميغابايت" });
        const uploaded = await storagePut(`offers/${Date.now()}-${rest.title.slice(0, 40)}-video`, buffer, mimeType);
        videoUrl = uploaded.url;
      }
      const id = await createOffer({
        ...rest,
        imageUrl,
        videoUrl,
        isFeatured: rest.isFeatured ? 1 : 0,
        startsAt: rest.startsAt || undefined,
        endsAt: rest.endsAt || undefined,
        createdBy: ctx.user.id,
      });
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().trim().min(2).max(220).optional(),
      description: z.string().trim().min(5).max(10000).optional(),
      imageUrl: z.string().max(1000).optional(),
      videoUrl: z.string().max(1000).optional(),
      imageDataUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).optional(),
      videoDataUrl: z.string().regex(/^data:video\/(mp4|webm|quicktime);base64,[A-Za-z0-9+/=]+$/).optional(),
      category: z.string().max(100).optional(),
      originalPrice: z.string().max(80).optional(),
      offerPrice: z.string().max(80).optional(),
      discountPercent: z.number().int().min(0).max(100).optional(),
      status: z.enum(["draft", "scheduled", "published", "paused", "expired"]).optional(),
      startsAt: dateInput.optional(),
      endsAt: dateInput.optional(),
      priority: z.number().int().min(-100).max(100).optional(),
      isFeatured: z.boolean().optional(),
      contactPhone: z.string().max(32).optional(),
    })).mutation(async ({ input }) => {
      const { id, isFeatured, imageDataUrl, videoDataUrl, ...patch } = input;
      const updateData: Record<string, unknown> = { ...patch };
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured ? 1 : 0;
      if (imageDataUrl) {
        const [header, encoded] = imageDataUrl.split(",", 2);
        const mimeType = header?.match(/^data:(image\/(?:jpeg|png|webp));base64$/)?.[1];
        const buffer = Buffer.from(encoded || "", "base64");
        if (!mimeType || buffer.byteLength > 8 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "صورة العرض غير صالحة أو تتجاوز 8 ميغابايت" });
        const uploaded = await storagePut(`offers/${Date.now()}-${String(patch.title || "offer").slice(0, 40)}-image`, buffer, mimeType);
        updateData.imageUrl = uploaded.url;
      }
      if (videoDataUrl) {
        const [header, encoded] = videoDataUrl.split(",", 2);
        const mimeType = header?.match(/^data:(video\/(?:mp4|webm|quicktime));base64$/)?.[1];
        const buffer = Buffer.from(encoded || "", "base64");
        if (!mimeType || buffer.byteLength > 25 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "فيديو العرض غير صالح أو يتجاوز 25 ميغابايت" });
        const uploaded = await storagePut(`offers/${Date.now()}-${String(patch.title || "offer").slice(0, 40)}-video`, buffer, mimeType);
        updateData.videoUrl = uploaded.url;
      }
      await updateOffer(id, updateData as any);
      return { success: true } as const;
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteOffer(input.id);
      return { success: true } as const;
    }),
  }),
  submissions: router({
    create: publicProcedure.input(submissionInput).mutation(async ({ input }) => {
      const { attachments = [], ...submission } = input;
      const id = await createSubmission(submission);
      for (const attachment of attachments) {
        const encoded = attachment.dataUrl.split(",", 2)[1] ?? "";
        const buffer = Buffer.from(encoded, "base64");
        const maxBytes = attachment.mimeType.startsWith("video/") ? 25 * 1024 * 1024 : 8 * 1024 * 1024;
        if (buffer.byteLength > maxBytes) throw new TRPCError({ code: "BAD_REQUEST", message: attachment.mimeType.startsWith("video/") ? "حجم الفيديو يتجاوز 25 ميغابايت" : "حجم المرفق يتجاوز 8 ميغابايت" });
        const uploaded = await storagePut(`submissions/${id}/${attachment.name}`, buffer, attachment.mimeType);
        await createSubmissionAttachment({ submissionId: id, storageKey: uploaded.key, storageUrl: uploaded.url, originalName: attachment.name, mimeType: attachment.mimeType, byteSize: buffer.byteLength });
      }
      return { id, status: "pending" as const };
    }),
    publicList: publicProcedure.input(z.object({ category: categorySchema.optional() }).optional()).query(({ input }) => listPublicSubmissions(input?.category)),
    adminList: adminProcedure.input(z.object({ status: statusSchema.optional() }).optional()).query(({ input }) => listAdminSubmissions(input?.status)),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: statusSchema, internalNotes: z.string().max(10000).optional() })).mutation(async ({ input, ctx }) => {
      await updateSubmissionStatus(input.id, input.status, ctx.user.id, input.internalNotes);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
