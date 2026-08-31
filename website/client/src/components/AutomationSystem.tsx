import { useState, useMemo } from "react";
import { 
  Zap, Bell, Clock, Mail, MessageCircle, Calendar, CheckCircle2,
  AlertTriangle, Play, Pause, Settings, Plus, Eye, Trash2,
  ArrowRight, Timer, Repeat, Users, FileText, TrendingUp
} from "lucide-react";

type Language = "ar" | "en";

interface AutomationRule {
  id: string;
  name: string;
  nameEn: string;
  trigger: "new_submission" | "payment_received" | "contract_signed" | "invoice_overdue" | "scheduled" | "manual";
  action: "send_email" | "send_whatsapp" | "create_task" | "update_status" | "send_notification";
  target: string;
  message: string;
  messageEn: string;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
  createdAt: string;
}

interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  action: string;
  target: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  details: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  link?: string;
}

const t = (lang: Language, ar: string, en: string) => lang === "ar" ? ar : en;
function genId() { return `AUT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }

const TRIGGERS = [
  { value: "new_submission", ar: "طلب جديد", en: "New Submission", icon: FileText, color: "#2563EB" },
  { value: "payment_received", ar: "دفعة مستلمة", en: "Payment Received", icon: TrendingUp, color: "#059669" },
  { value: "contract_signed", ar: "تم توقيع عقد", en: "Contract Signed", icon: CheckCircle2, color: "#7C3AED" },
  { value: "invoice_overdue", ar: "فاتورة متأخرة", en: "Invoice Overdue", icon: AlertTriangle, color: "#DC2626" },
  { value: "scheduled", ar: "مجدول", en: "Scheduled", icon: Clock, color: "#D97706" },
  { value: "manual", ar: "يدوي", en: "Manual", icon: Play, color: "#6B7280" },
];

const ACTIONS = [
  { value: "send_email", ar: "إرسال بريد", en: "Send Email", icon: Mail, color: "#2563EB" },
  { value: "send_whatsapp", ar: "إرسال واتساب", en: "Send WhatsApp", icon: MessageCircle, color: "#059669" },
  { value: "create_task", ar: "إنشاء مهمة", en: "Create Task", icon: FileText, color: "#7C3AED" },
  { value: "update_status", ar: "تحديث الحالة", en: "Update Status", icon: ArrowRight, color: "#D97706" },
  { value: "send_notification", ar: "إرسال إشعار", en: "Send Notification", icon: Bell, color: "#DC2626" },
];

export function AutomationSystem({ language }: { language: Language }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"rules" | "logs" | "notifications">("rules");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "", nameEn: "", trigger: "new_submission" as AutomationRule["trigger"],
    action: "send_email" as AutomationRule["action"], target: "",
    message: "", messageEn: ""
  });

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter(r => r.enabled).length,
    totalRuns: rules.reduce((s, r) => s + r.runCount, 0),
    unreadNotifications: notifications.filter(n => !n.read).length,
    recentLogs: logs.slice(0, 10),
  }), [rules, notifications, logs]);

  const addRule = () => {
    if (!form.name) return;
    const rule: AutomationRule = {
      id: genId(), name: form.name, nameEn: form.nameEn || form.name,
      trigger: form.trigger, action: form.action, target: form.target,
      message: form.message, messageEn: form.messageEn || form.message,
      enabled: true, runCount: 0, createdAt: new Date().toISOString()
    };
    setRules([rule, ...rules]);
    setShowForm(false);
    setForm({ name: "", nameEn: "", trigger: "new_submission", action: "send_email", target: "", message: "", messageEn: "" });
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const testRule = (rule: AutomationRule) => {
    const log: AutomationLog = {
      id: genId(), ruleId: rule.id, ruleName: rule.name,
      action: ACTIONS.find(a => a.value === rule.action)?.ar || rule.action,
      target: rule.target || "admin@vipyemen.com",
      status: "success", timestamp: new Date().toISOString(),
      details: t(language, "تم الاختبار بنجاح", "Test completed successfully")
    };
    setLogs([log, ...logs]);
    setRules(rules.map(r => r.id === rule.id ? { ...r, runCount: r.runCount + 1, lastRun: new Date().toISOString() } : r));
  };

  const tabs = [
    { id: "rules" as const, label: t(language, "قواعد الأتمتة", "Automation Rules"), icon: Zap },
    { id: "logs" as const, label: t(language, "سجل التنفيذ", "Execution Log"), icon: Clock },
    { id: "notifications" as const, label: t(language, "الإشعارات", "Notifications"), icon: Bell },
  ];

  return (
    <div className="accounting-system">
      <style>{`
        .auto-rule-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .auto-rule-card:hover { border-color: #F3B71B; }
        .auto-rule-card.disabled { opacity: 0.6; }
        .auto-rule-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .auto-rule-info { flex: 1; }
        .auto-rule-name { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
        .auto-rule-desc { font-size: 12px; color: #6B7280; }
        .auto-rule-meta { display: flex; gap: 12px; font-size: 11px; color: #9CA3AF; margin-top: 6px; }
        .auto-rule-actions { display: flex; gap: 8px; align-items: center; }
        .toggle-switch { width: 44px; height: 24px; border-radius: 12px; background: #D1D5DB; position: relative; cursor: pointer; transition: background 0.2s; }
        .toggle-switch.on { background: #059669; }
        .toggle-switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: white; transition: transform 0.2s; }
        .toggle-switch.on::after { transform: translateX(20px); }
        .log-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
        .log-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .notification-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: background 0.15s; }
        .notification-item:hover { background: #F9FAFB; }
        .notification-item.unread { background: #EFF6FF; }
        .notification-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563EB; flex-shrink: 0; margin-top: 6px; }
      `}</style>

      <div className="accounting-header">
        <h2><Zap size={24} /> {t(language, "نظام الأتمتة المتكامل", "Integrated Automation System")}</h2>
        <p>{t(language, "أتمتة المهام والإشعارات والتنبيهات تلقائياً", "Automate tasks, notifications, and alerts automatically")}</p>
      </div>

      <div className="accounting-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`accounting-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} /> {tab.label}
            {tab.id === "notifications" && stats.unreadNotifications > 0 && <span style={{ background: "#DC2626", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{stats.unreadNotifications}</span>}
          </button>
        ))}
      </div>

      <div className="accounting-body">
        {activeTab === "rules" && (
          <div>
            <div className="stats-grid">
              <div className="stat-card profit">
                <div className="stat-icon" style={{ background: "#2563EB", color: "white" }}><Zap size={18} /></div>
                <div className="stat-label">{t(language, "إجمالي القواعد", "Total Rules")}</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-card revenue">
                <div className="stat-icon" style={{ background: "#059669", color: "white" }}><Play size={18} /></div>
                <div className="stat-label">{t(language, "قواعد نشطة", "Active Rules")}</div>
                <div className="stat-value">{stats.active}</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-icon" style={{ background: "#D97706", color: "white" }}><Repeat size={18} /></div>
                <div className="stat-label">{t(language, "إجمالي التنفيذات", "Total Runs")}</div>
                <div className="stat-value">{stats.totalRuns}</div>
              </div>
              <div className="stat-card expense">
                <div className="stat-icon" style={{ background: "#7C3AED", color: "white" }}><Users size={18} /></div>
                <div className="stat-label">{t(language, "الإشعارات غير المقروءة", "Unread")}</div>
                <div className="stat-value">{stats.unreadNotifications}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "قاعدة جديدة", "New Rule")}</button>
            </div>

            {rules.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
                <Zap size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>{t(language, "لا توجد قواعد أتمتة بعد", "No automation rules yet")}</p>
              </div>
            )}

            {rules.map(rule => {
              const trigger = TRIGGERS.find(t => t.value === rule.trigger);
              const action = ACTIONS.find(a => a.value === rule.action);
              return (
                <div key={rule.id} className={`auto-rule-card ${!rule.enabled ? "disabled" : ""}`}>
                  <div className="auto-rule-icon" style={{ background: `${trigger?.color || "#6B7280"}15` }}>
                    {trigger && <trigger.icon size={20} color={trigger.color} />}
                  </div>
                  <div className="auto-rule-info">
                    <div className="auto-rule-name">{language === "ar" ? rule.name : rule.nameEn}</div>
                    <div className="auto-rule-desc">
                      {t(language, " عند", "When")} <strong>{language === "ar" ? trigger?.ar : trigger?.en}</strong> {t(language, " → ", " → ")} <strong>{language === "ar" ? action?.ar : action?.en}</strong>
                    </div>
                    <div className="auto-rule-meta">
                      <span>🔄 {rule.runCount} {t(language, "مرات", "runs")}</span>
                      {rule.lastRun && <span>⏱️ {rule.lastRun.slice(0, 16).replace("T", " ")}</span>}
                    </div>
                  </div>
                  <div className="auto-rule-actions">
                    <button className="action-btn" onClick={() => testRule(rule)}><Play size={12} /> {t(language, "اختبار", "Test")}</button>
                    <div className={`toggle-switch ${rule.enabled ? "on" : ""}`} onClick={() => toggleRule(rule.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>{t(language, "سجل التنفيذ", "Execution Log")}</h3>
            {logs.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
                <Clock size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>{t(language, "لا توجد سجلات بعد", "No logs yet")}</p>
              </div>
            )}
            {logs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-icon" style={{ background: log.status === "success" ? "#D1FAE5" : log.status === "failed" ? "#FEE2E2" : "#FEF3C7" }}>
                  {log.status === "success" ? <CheckCircle2 size={16} color="#059669" /> : log.status === "failed" ? <AlertTriangle size={16} color="#DC2626" /> : <Clock size={16} color="#D97706" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{log.ruleName}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{log.action} → {log.target}</div>
                </div>
                <div style={{ textAlign: "left", fontSize: 12, color: "#9CA3AF" }}>
                  {log.timestamp.slice(0, 16).replace("T", " ")}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>{t(language, "الإشعارات", "Notifications")}</h3>
            {notifications.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
                <Bell size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>{t(language, "لا توجد إشعارات", "No notifications")}</p>
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} className={`notification-item ${!n.read ? "unread" : ""}`} onClick={() => setNotifications(notifications.map(nn => nn.id === n.id ? { ...nn, read: true } : nn))}>
                {!n.read && <div className="notification-dot" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{n.timestamp.slice(0, 16).replace("T", " ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t(language, "قاعدة أتمتة جديدة", "New Automation Rule")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "اسم القاعدة (عربي)", "Rule Name (Arabic)")}</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "اسم القاعدة (إنجليزي)", "Rule Name (English)")}</label>
                  <input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "المُحفِّز", "Trigger")}</label>
                  <select value={form.trigger} onChange={e => setForm({ ...form, trigger: e.target.value as any })}>
                    {TRIGGERS.map(tr => <option key={tr.value} value={tr.value}>{language === "ar" ? tr.ar : tr.en}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t(language, "الإجراء", "Action")}</label>
                  <select value={form.action} onChange={e => setForm({ ...form, action: e.target.value as any })}>
                    {ACTIONS.map(a => <option key={a.value} value={a.value}>{language === "ar" ? a.ar : a.en}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "الرسالة (عربي)", "Message (Arabic)")}</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "الرسالة (إنجليزي)", "Message (English)")}</label>
                  <textarea value={form.messageEn} onChange={e => setForm({ ...form, messageEn: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "الجهة المستهدفة", "Target")}</label>
                  <input value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder={t(language, "بريد أو رقم هاتف", "Email or phone number")} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addRule}>{t(language, "حفظ القاعدة", "Save Rule")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
