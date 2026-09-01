import { useEffect, useState } from "react";
import { Download, X, RefreshCw, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { useAutoUpdate, APP_VERSION } from "@/lib/useAutoUpdate";

export function AutoUpdateBanner() {
  const {
    hasUpdate,
    updateInfo,
    isChecking,
    lastChecked,
    dismissUpdate,
    dismissPermanently,
    checkForUpdate,
    applyUpdate,
  } = useAutoUpdate();

  const [expanded, setExpanded] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      const timer = setTimeout(() => setShowNotificationPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setShowNotificationPrompt(false);
      }
    }
  };

  if (!hasUpdate || !updateInfo) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
      {/* Main update banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #102A43 0%, #1A3A5C 50%, #0B2034 100%)",
          borderBottom: "2px solid #F3B71B",
        }}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(243,183,27,0.3), transparent)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        <div className="container mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Update info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Update icon with pulse */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#F3B71B" }}
                >
                  <Download size={18} color="#102A43" strokeWidth={2.5} />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: "#22C55E",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold text-sm md:text-base"
                    style={{ color: "#F3B71B" }}
                  >
                    تحديث جديد متاح!
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: "rgba(243,183,27,0.2)",
                      color: "#F3B71B",
                    }}
                  >
                    الإصدار {updateInfo.latestVersion}
                  </span>
                </div>
                <p className="text-xs md:text-sm opacity-80 truncate" style={{ color: "#E2E8F0" }}>
                  النسخة الحالية: {APP_VERSION} ← الإصدار الأحدث متاح للتحميل
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Expand details */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 rounded-lg transition-all hover:bg-white/10"
                style={{ color: "#E2E8F0" }}
                aria-label="تفاصيل التحديث"
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Download button */}
              <a
                href={updateInfo.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "#F3B71B",
                  color: "#102A43",
                }}
              >
                <Download size={16} strokeWidth={2.5} />
                <span className="hidden md:inline">تحديث الآن</span>
                <span className="md:hidden">تحديث</span>
              </a>

              {/* Apply update (PWA) */}
              <button
                onClick={applyUpdate}
                className="p-2 rounded-lg transition-all hover:bg-white/10"
                style={{ color: "#22C55E" }}
                title="تطبيق التحديث على التطبيق"
              >
                <RefreshCw size={18} />
              </button>

              {/* Dismiss */}
              <button
                onClick={dismissUpdate}
                className="p-2 rounded-lg transition-all hover:bg-white/10"
                style={{ color: "#94A3B8" }}
                aria-label="إخفاء"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div
              className="mt-3 pt-3 border-t"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: "#CBD5E1" }}>
                <div>
                  <span className="font-medium opacity-70">تاريخ النشر: </span>
                  <span>
                    {new Date(updateInfo.publishedAt).toLocaleDateString("ar-YE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-medium opacity-70">آخر فحص: </span>
                  <span>
                    {lastChecked
                      ? lastChecked.toLocaleTimeString("ar-YE")
                      : "جارٍ الفحص..."}
                  </span>
                </div>
              </div>

              {updateInfo.releaseNotes && (
                <div className="mt-2">
                  <span className="font-medium opacity-70 text-xs">ملاحظات الإصدار: </span>
                  <p
                    className="text-xs mt-1 max-h-20 overflow-y-auto whitespace-pre-wrap"
                    style={{ color: "#94A3B8" }}
                  >
                    {updateInfo.releaseNotes.slice(0, 500)}
                    {updateInfo.releaseNotes.length > 500 ? "..." : ""}
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <a
                  href={updateInfo.releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:no-underline"
                  style={{ color: "#F3B71B" }}
                >
                  عرض الإصدار على GitHub
                </a>
                <span className="opacity-30">|</span>
                <button
                  onClick={dismissPermanently}
                  className="text-xs hover:underline"
                  style={{ color: "#94A3B8" }}
                >
                  لا تظهر لهذا الإصدار
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification permission prompt */}
      {showNotificationPrompt && (
        <div
          className="container mx-auto px-4 py-2"
          style={{ backgroundColor: "rgba(16,42,67,0.95)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell size={14} style={{ color: "#F3B71B" }} />
              <span className="text-xs" style={{ color: "#E2E8F0" }}>
                اسمح بالإشعارات لتلقي تنبيهات التحديث فوراً
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestNotificationPermission}
                className="text-xs px-3 py-1 rounded font-medium"
                style={{ backgroundColor: "#F3B71B", color: "#102A43" }}
              >
                تفعيل
              </button>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                className="text-xs opacity-50 hover:opacity-100"
                style={{ color: "#E2E8F0" }}
              >
                لاحقاً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
