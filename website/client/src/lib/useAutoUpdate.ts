import { useState, useEffect, useCallback, useRef } from "react";

// Current app version - must be updated with each release
export const APP_VERSION = "2.5.0";

// GitHub API endpoint for releases
const GITHUB_API_URL = "https://api.github.com/repos/deltastars/vip-yemen/releases/latest";

// Check interval: every 30 minutes
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  releaseUrl: string;
  downloadUrl: string;
  releaseNotes: string;
  publishedAt: string;
}

interface UseAutoUpdateReturn {
  hasUpdate: boolean;
  updateInfo: UpdateInfo | null;
  isChecking: boolean;
  lastChecked: Date | null;
  dismissUpdate: () => void;
  dismissPermanently: () => void;
  checkForUpdate: () => Promise<void>;
  applyUpdate: () => void;
}

/**
 * Parse semver version string to comparable number
 */
function parseVersion(version: string): number {
  const cleaned = version.replace(/^v/, "").split("-")[0];
  const parts = cleaned.split(".").map(Number);
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}

/**
 * Compare two versions, returns true if latest > current
 */
function isNewerVersion(current: string, latest: string): boolean {
  return parseVersion(latest) > parseVersion(current);
}

export function useAutoUpdate(): UseAutoUpdateReturn {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const dismissedRef = useRef<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if user permanently dismissed this version
  const isPermanentlyDismissed = useCallback((): boolean => {
    try {
      const dismissedVersion = localStorage.getItem("vipyemen-dismissed-update");
      return dismissedVersion === APP_VERSION;
    } catch {
      return false;
    }
  }, []);

  // Check if user temporarily dismissed this version
  const isTemporarilyDismissed = useCallback((): boolean => {
    try {
      const dismissed = sessionStorage.getItem("vipyemen-update-dismissed");
      return dismissed === APP_VERSION;
    } catch {
      return false;
    }
  }, []);

  // Check for update from GitHub API
  const checkForUpdate = useCallback(async () => {
    if (dismissedRef.current || isPermanentlyDismissed()) return;

    setIsChecking(true);
    try {
      const response = await fetch(GITHUB_API_URL, {
        headers: { Accept: "application/vnd.github.v3+json" },
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();
      const latestVersion = data.tag_name?.replace(/^v/, "") || "";

      if (latestVersion && isNewerVersion(APP_VERSION, latestVersion)) {
        // Find APK download URL
        const apkAsset = data.assets?.find(
          (a: { name: string }) =>
            a.name.includes(".apk") && !a.name.includes("debug")
        );

        const info: UpdateInfo = {
          hasUpdate: true,
          latestVersion,
          releaseUrl: data.html_url || "",
          downloadUrl: apkAsset?.browser_download_url || data.html_url || "",
          releaseNotes: data.body || "",
          publishedAt: data.published_at || "",
        };

        setUpdateInfo(info);
        setHasUpdate(true);

        // Send browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("تحديث جديد متاح - ViP Yemen", {
            body: `الإصدار ${latestVersion} جاهز للتحميل`,
            icon: "/images/vip-logo.svg",
            badge: "/images/vip-logo.svg",
            tag: "vip-update",
          });
        }
      }
    } catch {
      // Silently fail - network errors should not disrupt the user
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [isPermanentlyDismissed]);

  // Dismiss update temporarily (until next check)
  const dismissUpdate = useCallback(() => {
    setHasUpdate(false);
    dismissedRef.current = true;
    try {
      sessionStorage.setItem("vipyemen-update-dismissed", APP_VERSION);
    } catch {
      // Ignore
    }
  }, []);

  // Dismiss update permanently for this version
  const dismissPermanently = useCallback(() => {
    setHasUpdate(false);
    dismissedRef.current = true;
    try {
      localStorage.setItem("vipyemen-dismissed-update", APP_VERSION);
    } catch {
      // Ignore
    }
  }, []);

  // Apply update - for PWA: reload to get new service worker
  // For Android: download APK
  const applyUpdate = useCallback(() => {
    // Try to update service worker first
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          // Tell waiting service worker to activate
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        // Force reload to get latest version
        window.location.reload();
      });
    } else {
      // Just reload
      window.location.reload();
    }
  }, []);

  // Set up periodic checks
  useEffect(() => {
    // Check immediately on mount
    checkForUpdate();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkForUpdate, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkForUpdate]);

  // Request notification permission on first visit
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      // Don't auto-request - wait for user interaction
    }
  }, []);

  return {
    hasUpdate,
    updateInfo,
    isChecking,
    lastChecked,
    dismissUpdate,
    dismissPermanently,
    checkForUpdate,
    applyUpdate,
  };
}

/**
 * Register service worker and handle updates
 */
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Check for updates every hour
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New content available, notify user
            console.log("[ViP Yemen] New version available");
          }
        });
      });

      // Listen for controlling service worker change
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    } catch (error) {
      console.warn("[ViP Yemen] Service worker registration failed:", error);
    }
  });
}
