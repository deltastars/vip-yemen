/**
 * تم تعطيل شريط التحديث العلوي نهائيًا.
 * The top-of-screen update banner has been retired permanently.
 *
 * Update notices now live ONLY inside the bell icon (NotificationBell),
 * per the platform requirement: no texts above the store screen calling
 * for updates. This export is kept so existing imports keep compiling.
 */
export function AutoUpdateBanner(): null {
  return null;
}
