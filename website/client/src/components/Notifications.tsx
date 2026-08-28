import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, X, Megaphone, Tag, Clock, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link_url: string | null;
  created_at: string;
}

interface NotificationsProps {
  language: "ar" | "en";
}

const typeColors: Record<NotificationType, string> = {
  info: "#2563eb",
  success: "#16a34a",
  warning: "#d97706",
  error: "#dc2626",
};

const typeIcons: Record<NotificationType, React.ReactNode> = {
  info: <AlertCircle size={16} />,
  success: <Check size={16} />,
  warning: <Clock size={16} />,
  error: <X size={16} />,
};

export function Notifications({ language }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulated notifications for demo (replace with real API)
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: "1",
        title: language === "ar" ? "مرحبًا بك في ViP Yemen" : "Welcome to ViP Yemen",
        message: language === "ar" ? "تم إعداد حسابك بنجاح" : "Your account has been set up successfully",
        type: "success",
        is_read: false,
        link_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: language === "ar" ? "عرض جديد متاح" : "New offer available",
        message: language === "ar" ? "تم نشر عرض ترويجي جديد" : "A new promotional offer has been published",
        type: "info",
        is_read: false,
        link_url: "#offers",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setNotifications(demoNotifications);
  }, [language]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (language === "ar") {
      if (minutes < 1) return "الآن";
      if (minutes < 60) return `منذ ${minutes} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      return `منذ ${days} يوم`;
    }
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="notifications-wrapper">
      {/* Bell Icon */}
      <button
        className="notifications-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>{language === "ar" ? "الإشعارات" : "Notifications"}</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                <CheckCheck size={14} />
                {language === "ar" ? "تعيين الكل كمقروء" : "Mark all as read"}
              </button>
            )}
            <button className="close-panel" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell size={32} />
                <p>{language === "ar" ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.is_read ? "read" : "unread"}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.link_url) {
                      window.location.hash = notification.link_url;
                    }
                  }}
                >
                  <div
                    className="notification-icon"
                    style={{ backgroundColor: typeColors[notification.type] + "20", color: typeColors[notification.type] }}
                  >
                    {typeIcons[notification.type]}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTime(notification.created_at)}</div>
                  </div>
                  {!notification.is_read && <div className="notification-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="notifications-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

// Toast notification component
interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{typeIcons[type]}</div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}
