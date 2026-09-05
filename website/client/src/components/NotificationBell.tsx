import { useEffect, useState, useCallback, useRef } from "react";
import { Bell, Download, Check, X, RefreshCw } from "lucide-react";
import { useAutoUpdate, APP_VERSION } from "@/lib/useAutoUpdate";
import { getAppLinks } from "@/lib/appSettings";

interface BellNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: "update" | "info";
  action?: { label: string; onClick: () => void };
}

/**
 * جرس الإشعارات — أي تنبيه تحديث يظهر هنا فقط داخل القائمة المنسدلة،
 * ولا يظهر أي شريط أو نص أعلى شاشة المتجر إطلاقًا.
 */
export function NotificationBell() {
  const { hasUpdate, updateInfo, checkForUpdate, applyUpdate } = useAutoUpdate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BellNotification[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const dismissNotification = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  }, []);

  // Build the notification list: update notice (inside the bell) + welcome note
  useEffect(() => {
    const list: BellNotification[] = [];

    if (hasUpdate && updateInfo) {
      const links = getAppLinks();
      const target = links.androidUrl || links.iosUrl || links.directApkUrl;
      list.push({
        id: "update",
        title: `تحديث جديد متاح — الإصدار ${updateInfo.latestVersion}`,
        message: `النسخة الحالية ${APP_VERSION}. يمكنك التحديث للحصول على آخر التحسينات.`,
        time: "الآن",
        kind: "update",
        action: target
          ? {
              label: "الانتقال للتحديث",
              onClick: () => window.open(target, "_blank", "noopener"),
            }
          : undefined,
      });
    }

    list.push({
      id: "welcome",
      title: "مرحبًا بك في ViP Yemen",
      message: "منصتك الشاملة للتوظيف والتسويق العقاري والإلكتروني والبرمجيات.",
      time: "اليوم",
      kind: "info",
    });

    setItems(list);
  }, [hasUpdate, updateInfo, refreshKey]);

  // Re-check links when the admin saves new store URLs
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener("vipyemen:app-links-changed", handler);
    return () => window.removeEventListener("vipyemen:app-links-changed", handler);
  }, []);

  // Quiet background version check — never surfaces UI outside the bell
  useEffect(() => {
    checkForUpdate();
    const timer = setInterval(checkForUpdate, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [checkForUpdate]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasUpdateItem = items.some(n => n.kind === "update");

  return (
    <div className="notification-bell-wrap" ref={containerRef}>
      <button
        type="button"
        className="notification-bell-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="الإشعارات والتنبيهات"
        aria-expanded={open}
      >
        <Bell size={19} />
        {hasUpdateItem && <span className="notification-bell-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="notification-bell-panel" role="dialog" aria-label="قائمة الإشعارات">
          <div className="notification-bell-header">
            <span>الإشعارات والتنبيهات</span>
            {items.length > 0 && (
              <button
                type="button"
                className="notification-bell-clear"
                onClick={() => {
                  setItems(prev => prev.filter(n => n.kind !== "update"));
                  try { sessionStorage.setItem("vipyemen-update-dismissed", APP_VERSION); } catch { /* ignore */ }
                }}
              >
                <Check size={13} /> تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="notification-bell-list">
            {items.length === 0 && (
              <div className="notification-bell-empty">لا توجد إشعارات جديدة حاليًا</div>
            )}
            {items.map(n => (
              <div className={`notification-bell-item ${n.kind}`} key={n.id}>
                <div className="notification-bell-item-head">
                  <strong>{n.title}</strong>
                  <button
                    type="button"
                    className="notification-bell-dismiss"
                    onClick={() => dismissNotification(n.id)}
                    aria-label="إخفاء الإشعار"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p>{n.message}</p>
                <div className="notification-bell-item-foot">
                  <span className="notification-bell-time">{n.time}</span>
                  {n.kind === "update" && (
                    <span className="notification-bell-actions">
                      <button
                        type="button"
                        onClick={() => { checkForUpdate(); }}
                        title="فحص الآن"
                      >
                        <RefreshCw size={13} />
                      </button>
                      {n.action && (
                        <button
                          type="button"
                          className="notification-bell-cta"
                          onClick={n.action.onClick}
                        >
                          <Download size={13} /> {n.action.label}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => { try { sessionStorage.setItem("vipyemen-update-dismissed", APP_VERSION); } catch { /* ignore */ } dismissNotification(n.id); }}
                        title="لا تُظهر تحديث هذا الإصدار"
                      >
                        تجاهل
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
