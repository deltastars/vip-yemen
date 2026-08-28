// =============================================================================
// ViP Yemen - Automation System
// =============================================================================
// Handles auto-publishing, auto-expiring, auto-archiving, and auto-notifications

import { supabase } from "./supabase";

// =============================================================================
// Auto-Expire: Mark expired submissions and offers
// =============================================================================
export async function autoExpireSubmissions() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "expired" })
    .lt("expires_at", now)
    .in("status", ["approved", "published"])
    .select("id, title, full_name");

  if (error) {
    console.error("Auto-expire submissions failed:", error);
    return [];
  }

  // Send notifications for expired submissions
  for (const sub of data || []) {
    await createNotification(
      "system",
      "انتهت صلاحية الطلب",
      `انتهت صلاحية طلب "${sub.title}"`,
      "warning"
    );
  }

  return data || [];
}

export async function autoExpireOffers() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("offers")
    .update({ status: "expired" })
    .lt("ends_at", now)
    .in("status", ["published"])
    .select("id, title");

  if (error) {
    console.error("Auto-expire offers failed:", error);
    return [];
  }

  return data || [];
}

export async function autoExpireAdvertisements() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("advertisements")
    .update({ status: "expired" })
    .lt("ends_at", now)
    .in("status", ["published"])
    .select("id, title");

  if (error) {
    console.error("Auto-expire advertisements failed:", error);
    return [];
  }

  return data || [];
}

// =============================================================================
// Auto-Publish: Publish scheduled items when their time arrives
// =============================================================================
export async function autoPublishSubmissions() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("submissions")
    .update({ 
      status: "approved",
      published_at: now 
    })
    .lte("scheduled_publish_at", now)
    .eq("status", "scheduled")
    .select("id, title, full_name, user_id");

  if (error) {
    console.error("Auto-publish submissions failed:", error);
    return [];
  }

  // Notify users about published submissions
  for (const sub of data || []) {
    if (sub.user_id) {
      await createNotification(
        sub.user_id,
        "تم نشر طلبك",
        `تم نشر طلب "${sub.title}" على المنصة`,
        "success",
        "#listings"
      );
    }
  }

  return data || [];
}

export async function autoPublishOffers() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("offers")
    .update({ 
      status: "published",
      starts_at: now 
    })
    .lte("starts_at", now)
    .eq("status", "scheduled")
    .select("id, title, created_by");

  if (error) {
    console.error("Auto-publish offers failed:", error);
    return [];
  }

  return data || [];
}

export async function autoPublishAdvertisements() {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("advertisements")
    .update({ 
      status: "published",
      starts_at: now 
    })
    .lte("starts_at", now)
    .eq("status", "scheduled")
    .select("id, title, created_by");

  if (error) {
    console.error("Auto-publish advertisements failed:", error);
    return [];
  }

  return data || [];
}

// =============================================================================
// Auto-Archive: Archive old items
// =============================================================================
export async function autoArchiveSubmissions() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "archived" })
    .lt("updated_at", thirtyDaysAgo)
    .in("status", ["expired", "rejected"])
    .select("id, title");

  if (error) {
    console.error("Auto-archive submissions failed:", error);
    return [];
  }

  return data || [];
}

// =============================================================================
// Auto-Notifications: Create notifications for events
// =============================================================================
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  linkUrl?: string
) {
  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      link_url: linkUrl || null,
    });

  if (error) {
    console.error("Create notification failed:", error);
    return null;
  }

  return true;
}

// =============================================================================
// Auto-Notifications for submission status changes
// =============================================================================
export async function notifySubmissionStatusChange(
  submissionId: string,
  newStatus: string,
  userId: string
) {
  const statusMessages: Record<string, { ar: string; en: string }> = {
    approved: {
      ar: "تمت الموافقة على طلبك وسيتم نشره قريباً",
      en: "Your request has been approved and will be published soon",
    },
    rejected: {
      ar: "تم رفض طلبك. يرجى مراجعة البيانات والمحاولة مرة أخرى",
      en: "Your request has been rejected. Please review your data and try again",
    },
    inReview: {
      ar: "طلبك قيد المراجعة من الإدارة",
      en: "Your request is under review by the admin",
    },
    published: {
      ar: "تم نشر طلبك على المنصة",
      en: "Your request has been published on the platform",
    },
    sold: {
      ar: "تم البيع بنجاح! شكراً لاستخدامك المنصة",
      en: "Sold successfully! Thank you for using the platform",
    },
  };

  const message = statusMessages[newStatus];
  if (!message) return;

  // Get submission title
  const { data: submission } = await supabase
    .from("submissions")
    .select("title")
    .eq("id", submissionId)
    .single();

  await createNotification(
    userId,
    message.ar,
    `${submission?.title || ""} - ${message.en}`,
    newStatus === "approved" || newStatus === "published" ? "success" :
    newStatus === "rejected" ? "error" : "info",
    "#listings"
  );
}

// =============================================================================
// Auto-Notifications for new submissions (to admin)
// =============================================================================
export async function notifyAdminNewSubmission(
  submissionId: string,
  category: string,
  fullName: string
) {
  // Get all admin users
  const { data: admins } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin");

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    employment: { ar: "توظيف", en: "Employment" },
    realEstateOffer: { ar: "عرض عقار", en: "Property offer" },
    realEstateRequest: { ar: "طلب عقار", en: "Property request" },
    productOffer: { ar: "عرض منتج", en: "Product offer" },
    productRequest: { ar: "طلب منتج", en: "Product request" },
    software: { ar: "برمجيات", en: "Software" },
  };

  const catLabel = categoryLabels[category] || { ar: category, en: category };

  for (const admin of admins || []) {
    await createNotification(
      admin.id,
      "طلب جديد",
      `طلب جديد من ${fullName} - قسم ${catLabel.ar}`,
      "info",
      "/admin"
    );
  }
}

// =============================================================================
// Run all automation tasks
// =============================================================================
export async function runAutomationTasks() {
  console.log("[Automation] Running automation tasks...");
  
  try {
    // Auto-expire
    await autoExpireSubmissions();
    await autoExpireOffers();
    await autoExpireAdvertisements();
    
    // Auto-publish
    await autoPublishSubmissions();
    await autoPublishOffers();
    await autoPublishAdvertisements();
    
    // Auto-archive
    await autoArchiveSubmissions();
    
    console.log("[Automation] All tasks completed successfully");
  } catch (error) {
    console.error("[Automation] Error running tasks:", error);
  }
}

// =============================================================================
// Initialize automation (run on app load and periodically)
// =============================================================================
let automationInterval: ReturnType<typeof setInterval> | null = null;

export function startAutomation() {
  // Run immediately
  runAutomationTasks();
  
  // Run every 5 minutes
  automationInterval = setInterval(runAutomationTasks, 5 * 60 * 1000);
  
  console.log("[Automation] Started (runs every 5 minutes)");
}

export function stopAutomation() {
  if (automationInterval) {
    clearInterval(automationInterval);
    automationInterval = null;
    console.log("[Automation] Stopped");
  }
}
