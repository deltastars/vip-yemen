/**
 * إعدادات روابط التطبيق — تُدار من لوحة التحكم
 * App store links — managed exclusively from the admin dashboard.
 *
 * The "تنزيل التطبيق" buttons stay silent (empty state) until the admin
 * saves an official store URL in: لوحة التحكم ← الإعدادات ← روابط التطبيق.
 * No GitHub repository links are ever exposed to end users.
 */

export interface AppLinkSettings {
  androidUrl: string;
  iosUrl: string;
  directApkUrl: string;
}

const STORAGE_KEY = "vipyemen-app-links-v1";

const DEFAULTS: AppLinkSettings = {
  androidUrl: "",
  iosUrl: "",
  directApkUrl: "",
};

/** Public links visible to all visitors (set by admin, empty until configured). */
export function getAppLinks(): AppLinkSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<AppLinkSettings>;
    return {
      androidUrl: typeof parsed.androidUrl === "string" ? parsed.androidUrl : "",
      iosUrl: typeof parsed.iosUrl === "string" ? parsed.iosUrl : "",
      directApkUrl: typeof parsed.directApkUrl === "string" ? parsed.directApkUrl : "",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Persist links from the admin dashboard. */
export function saveAppLinks(links: Partial<AppLinkSettings>): void {
  const next: AppLinkSettings = { ...getAppLinks(), ...links };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Same-tab listeners
    window.dispatchEvent(new CustomEvent("vipyemen:app-links-changed"));
  } catch {
    // Storage unavailable — links simply stay empty for this session
  }
}

/** True when at least one store link has been configured by the admin. */
export function hasAnyStoreLink(links: AppLinkSettings = getAppLinks()): boolean {
  return Boolean(links.androidUrl || links.iosUrl || links.directApkUrl);
}

/**
 * Guard every outbound link: only https storefronts are allowed, never
 * github.com/repo paths (releases belong to the maintainer, not end users).
 */
export function sanitizeStoreUrl(value: string): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed, "https://example.invalid");
    if (url.protocol !== "https:") return "";
    if (/github\.com$/i.test(url.hostname) && /\/releases/i.test(url.pathname)) return "";
    return url.toString();
  } catch {
    return "";
  }
}
