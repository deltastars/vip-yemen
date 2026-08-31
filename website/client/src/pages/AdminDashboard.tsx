import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ShieldCheck, LogOut, BarChart3, Users, BriefcaseBusiness,
  Building2, Globe2, Code2, Megaphone, Tag, Eye, Check, X,
  Settings, FileText, TrendingUp, Clock, ChevronDown, Fingerprint,
  Camera, Edit3, Trash2, Archive, RefreshCw, Download, Upload,
  Bell, Lock, UserCheck, AlertCircle, Search, Filter,
  BookOpen, FileSignature, Zap, ArrowLeft
} from "lucide-react";
import { AccountingSystem } from "../components/AccountingSystem";
import { EContractsSystem } from "../components/EContracts";
import { ArchiveSystem } from "../components/ArchiveSystem";
import { AutomationSystem } from "../components/AutomationSystem";
import { 
  registerBiometric, isBiometricSupported, isBiometricRegistered, removeBiometric,
  logSecurityEvent, getAuditLogs, destroySession
} from "../lib/security";

type Tab = "overview" | "employment" | "realestate" | "emarketing" | "software" | "ads" | "offers" | "accounting" | "contracts" | "archive" | "automation" | "settings";
type SubmissionStatus = "pending" | "reviewing" | "approved" | "rejected" | "archived" | "sold";

interface Submission {
  id: string;
  category: string;
  title: string;
  description: string;
  fullName: string;
  phone: string;
  address?: string;
  status: SubmissionStatus;
  createdAt: string;
  notes?: string;
}

interface Ad {
  id: string;
  title: string;
  message: string;
  linkUrl?: string;
  status: "draft" | "published" | "paused";
  startsAt: string;
  endsAt: string;
  priority: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent?: number;
  imageUrl?: string;
  videoUrl?: string;
  isFeatured: boolean;
  status: "draft" | "published";
  startsAt: string;
  endsAt: string;
}

// Load data from localStorage
function loadData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      setUser(JSON.parse(stored));
      setLoading(false);
    } else {
      setLocation("/admin");
    }
    
    // Check biometric support
    isBiometricSupported().then(setBiometricSupported);
    setBiometricRegistered(localStorage.getItem("biometric_registered") === "true");
  }, [setLocation]);

  const handleLogout = () => {
    logSecurityEvent("LOGOUT", `User: ${user?.email}`);
    destroySession();
    localStorage.removeItem("admin_user");
    setLocation("/admin");
  };

  const handleRegisterBiometric = async () => {
    if (user?.email) {
      const result = await registerBiometric(user.email);
      if (result.success) {
        setBiometricRegistered(true);
        logSecurityEvent("BIOMETRIC_REGISTERED", `User: ${user.email}`);
        alert("تم تسجيل البصمة بنجاح! يمكنك الآن استخدامها لتسجيل الدخول.");
      } else {
        logSecurityEvent("BIOMETRIC_REGISTRATION_FAILED", result.error || "Unknown error");
        alert(result.error || "فشل تسجيل البصمة. تأكد من أن جهازك يدعم البصمة.");
      }
    }
  };

  const handleRemoveBiometric = () => {
    if (user?.email && confirm("هل أنت متأكد من حذف البصمة؟")) {
      removeBiometric(user.email);
      setBiometricRegistered(false);
      logSecurityEvent("BIOMETRIC_REMOVED", `User: ${user.email}`);
      alert("تم حذف البصمة بنجاح");
    }
  };

  if (loading) return <div className="admin-loading">جارٍ التحميل...</div>;
  if (!user) return null;

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "employment", label: "التوظيف", icon: BriefcaseBusiness },
    { key: "realestate", label: "العقارات", icon: Building2 },
    { key: "emarketing", label: "التسويق", icon: Globe2 },
    { key: "software", label: "البرمجيات", icon: Code2 },
    { key: "ads", label: "الإعلانات", icon: Megaphone },
    { key: "offers", label: "العروض", icon: Tag },
    { key: "accounting", label: "المحاسبة", icon: BookOpen },
    { key: "contracts", label: "العقود", icon: FileSignature },
    { key: "archive", label: "الأرشيف", icon: Archive },
    { key: "automation", label: "الأتمتة", icon: Zap },
    { key: "settings", label: "الإعدادات", icon: Settings },
  ] as const;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-right">
          <a href="/" className="admin-back-btn" aria-label="العودة للرئيسية">
            <ArrowLeft size={16} />
            <span>الرئيسية</span>
          </a>
          <ShieldCheck size={24} />
          <div>
            <h1>لوحة التحكم الرئيسية</h1>
            <p>مرحبًا {user.name} | {user.email}</p>
          </div>
        </div>
        <div className="admin-header-left">
          {biometricSupported && (
            <button 
              onClick={handleRegisterBiometric} 
              className={`admin-bio-btn ${biometricRegistered ? "registered" : ""}`}
            >
              <Fingerprint size={18} />
              <span>{biometricRegistered ? "البصمة مُفعّلة ✓" : "تفعيل البصمة"}</span>
            </button>
          )}
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="admin-content">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "employment" && <DepartmentTab category="employment" title="قسم التوظيف" icon={BriefcaseBusiness} />}
        {activeTab === "realestate" && <DepartmentTab category="realEstateOffer" title="قسم التسويق العقاري" icon={Building2} />}
        {activeTab === "emarketing" && <DepartmentTab category="productOffer" title="قسم التسويق الإلكتروني" icon={Globe2} />}
        {activeTab === "software" && <DepartmentTab category="software" title="قسم البرمجيات" icon={Code2} />}
        {activeTab === "ads" && <AdsTab />}
        {activeTab === "offers" && <OffersTab />}
        {activeTab === "accounting" && <AccountingSystem language="ar" />}
        {activeTab === "contracts" && <EContractsSystem language="ar" />}
        {activeTab === "archive" && <ArchiveSystem language="ar" />}
        {activeTab === "automation" && <AutomationSystem language="ar" />}
        {activeTab === "settings" && <SettingsTab user={user} />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const submissions = loadData<Submission[]>("admin_submissions", []);
  const ads = loadData<Ad[]>("admin_ads", []);
  const offers = loadData<Offer[]>("admin_offers", []);

  const stats = [
    { label: "إجمالي الطلبات", value: submissions.length.toString(), icon: FileText, color: "#3B82F6" },
    { label: "قيد المراجعة", value: submissions.filter(s => s.status === "pending").length.toString(), icon: Clock, color: "#F59E0B" },
    { label: "تمت الموافقة", value: submissions.filter(s => s.status === "approved").length.toString(), icon: Check, color: "#10B981" },
    { label: "الإعلانات النشطة", value: ads.filter(a => a.status === "published").length.toString(), icon: Megaphone, color: "#8B5CF6" },
    { label: "العروض النشطة", value: offers.filter(o => o.status === "published").length.toString(), icon: Tag, color: "#EC4899" },
    { label: "التوظيف", value: submissions.filter(s => s.category === "employment").length.toString(), icon: BriefcaseBusiness, color: "#F97316" },
    { label: "العقارات", value: submissions.filter(s => s.category.includes("realEstate")).length.toString(), icon: Building2, color: "#06B6D4" },
    { label: "البرمجيات", value: submissions.filter(s => s.category === "software").length.toString(), icon: Code2, color: "#8B5CF6" },
  ];

  return (
    <div className="admin-overview">
      <h2>نظرة عامة على المنصة</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + "20", color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-sections">
        <div className="overview-section">
          <h3>آخر الطلبات</h3>
          {submissions.length === 0 ? (
            <p className="empty-state">لا توجدطلبات بعد</p>
          ) : (
            <div className="recent-list">
              {submissions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="recent-item">
                  <span className="recent-title">{sub.title}</span>
                  <span className={`status-badge status-${sub.status}`}>
                    {sub.status === "pending" ? "قيد المراجعة" :
                     sub.status === "approved" ? "تمت الموافقة" :
                     sub.status === "rejected" ? "مرفوض" : sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overview-section">
          <h3>الإجراءات السريعة</h3>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => window.location.href = "/#employment"}>
              <BriefcaseBusiness size={20} />
              <span>إدارة التوظيف</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = "/#real-estate"}>
              <Building2 size={20} />
              <span>إدارة العقارات</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = "/#e-marketing"}>
              <Globe2 size={20} />
              <span>إدارة التسويق</span>
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = "/downloads.html"}>
              <Download size={20} />
              <span>صفحة التحميل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentTab({ category, title, icon: Icon }: { category: string; title: string; icon: any }) {
  const [submissions, setSubmissions] = useState<Submission[]>(() => 
    loadData<Submission[]>("admin_submissions", []).filter(s => 
      s.category === category || s.category.includes(category)
    )
  );
  const [filter, setFilter] = useState<SubmissionStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = submissions.filter(s => {
    const matchesFilter = filter === "all" || s.status === filter;
    const matchesSearch = s.title.includes(search) || s.fullName.includes(search) || s.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, status: SubmissionStatus) => {
    const allSubmissions = loadData<Submission[]>("admin_submissions", []);
    const updated = allSubmissions.map(s => s.id === id ? { ...s, status } : s);
    saveData("admin_submissions", updated);
    setSubmissions(updated.filter(s => s.category === category || s.category.includes(category)));
  };

  const addNote = (id: string, note: string) => {
    const allSubmissions = loadData<Submission[]>("admin_submissions", []);
    const updated = allSubmissions.map(s => s.id === id ? { ...s, notes: note } : s);
    saveData("admin_submissions", updated);
    setSubmissions(updated.filter(s => s.category === category || s.category.includes(category)));
  };

  return (
    <div className="admin-department">
      <div className="department-header">
        <h2><Icon size={24} /> {title}</h2>
        <p>{submissions.length} طلب إجمالي</p>
      </div>

      <div className="department-filters">
        <div className="filter-group">
          <Search size={16} />
          <input
            type="text"
            placeholder="بحث بالاسم أو العنوان أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">الكل ({submissions.length})</option>
            <option value="pending">قيد المراجعة ({submissions.filter(s => s.status === "pending").length})</option>
            <option value="reviewing">قيد المراجعة ({submissions.filter(s => s.status === "reviewing").length})</option>
            <option value="approved">تمت الموافقة ({submissions.filter(s => s.status === "approved").length})</option>
            <option value="rejected">مرفوض ({submissions.filter(s => s.status === "rejected").length})</option>
            <option value="archived">مؤرشفة ({submissions.filter(s => s.status === "archived").length})</option>
          </select>
        </div>
      </div>

      <div className="submissions-list">
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <Icon size={48} />
            <p>لا توجدطلبات في هذا القسم</p>
            <p className="empty-hint">سيظهر الطلبات هنا عندما يسجل المستخدمون بياناتهم</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => (
            <div key={sub.id} className="submission-card" onClick={() => setSelectedSubmission(sub)}>
              <div className="submission-info">
                <h4>{sub.title}</h4>
                <p>{sub.fullName} • {sub.phone}</p>
                <p className="submission-date">{new Date(sub.createdAt).toLocaleDateString("ar-YE")}</p>
              </div>
              <div className="submission-actions">
                <span className={`status-badge status-${sub.status}`}>
                  {sub.status === "pending" ? "قيد المراجعة" :
                   sub.status === "approved" ? "تمت الموافقة" :
                   sub.status === "rejected" ? "مرفوض" :
                   sub.status === "archived" ? "مؤرشفة" : sub.status}
                </span>
                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => updateStatus(sub.id, "approved")} className="action-btn approve" title="موافقة">
                    <Check size={14} />
                  </button>
                  <button onClick={() => updateStatus(sub.id, "rejected")} className="action-btn reject" title="رفض">
                    <X size={14} />
                  </button>
                  <button onClick={() => updateStatus(sub.id, "archived")} className="action-btn archive" title="أرشفة">
                    <Archive size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedSubmission && (
        <div className="submission-modal" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedSubmission.title}</h3>
              <button onClick={() => setSelectedSubmission(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><label>الاسم:</label><span>{selectedSubmission.fullName}</span></div>
              <div className="detail-row"><label>الهاتف:</label><span>{selectedSubmission.phone}</span></div>
              {selectedSubmission.address && <div className="detail-row"><label>العنوان:</label><span>{selectedSubmission.address}</span></div>}
              <div className="detail-row"><label>الوصف:</label><span>{selectedSubmission.description}</span></div>
              <div className="detail-row"><label>التاريخ:</label><span>{new Date(selectedSubmission.createdAt).toLocaleString("ar-YE")}</span></div>
              
              <div className="modal-actions">
                <button onClick={() => updateStatus(selectedSubmission.id, "approved")} className="btn btn-success">
                  <Check size={16} /> موافقة
                </button>
                <button onClick={() => updateStatus(selectedSubmission.id, "rejected")} className="btn btn-danger">
                  <X size={16} /> رفض
                </button>
                <button onClick={() => updateStatus(selectedSubmission.id, "archived")} className="btn btn-secondary">
                  <Archive size={16} /> أرشفة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdsTab() {
  const [ads, setAds] = useState<Ad[]>(() => loadData<Ad[]>("admin_ads", []));
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [form, setForm] = useState({ title: "", message: "", linkUrl: "", priority: "0", startsAt: "", endsAt: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: Ad = {
      id: Date.now().toString(),
      title: form.title,
      message: form.message,
      linkUrl: form.linkUrl || undefined,
      status: "draft",
      startsAt: form.startsAt || new Date().toISOString(),
      endsAt: form.endsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: parseInt(form.priority) || 0
    };
    
    const updated = editingAd 
      ? ads.map(a => a.id === editingAd.id ? { ...newAd, id: editingAd.id, status: editingAd.status } : a)
      : [...ads, newAd];
    
    setAds(updated);
    saveData("admin_ads", updated);
    setShowForm(false);
    setEditingAd(null);
    setForm({ title: "", message: "", linkUrl: "", priority: "0", startsAt: "", endsAt: "" });
  };

  const togglePublish = (id: string) => {
    const updated = ads.map(a => a.id === id ? { ...a, status: (a.status === "published" ? "draft" : "published") as Ad["status"] } : a);
    setAds(updated);
    saveData("admin_ads", updated);
  };

  const deleteAd = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      const updated = ads.filter(a => a.id !== id);
      setAds(updated);
      saveData("admin_ads", updated);
    }
  };

  return (
    <div className="admin-ads">
      <div className="section-header">
        <h2><Megaphone size={24} /> إدارة الإعلانات الترويجية</h2>
        <button onClick={() => { setShowForm(true); setEditingAd(null); }} className="btn btn-primary">
          + إعلان جديد
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAd ? "تعديل إعلان" : "إضافة إعلان جديد"}</h3>
              <button onClick={() => { setShowForm(false); setEditingAd(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <label>
                عنوان الإعلان *
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              </label>
              <label>
                نص الإعلان *
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required rows={3} />
              </label>
              <label>
                رابط (اختياري)
                <input type="url" value={form.linkUrl} onChange={(e) => setForm({...form, linkUrl: e.target.value})} />
              </label>
              <div className="form-row">
                <label>
                  الأولوية
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
                    <option value="0">عادية</option>
                    <option value="1">متوسطة</option>
                    <option value="2">عالية</option>
                    <option value="3">عاجلة</option>
                  </select>
                </label>
                <label>
                  تاريخ البداية
                  <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({...form, startsAt: e.target.value})} />
                </label>
                <label>
                  تاريخ النهاية
                  <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({...form, endsAt: e.target.value})} />
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">حفظ</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingAd(null); }} className="btn btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ads-list">
        {ads.length === 0 ? (
          <div className="empty-state">
            <Megaphone size={48} />
            <p>لا توجدإعلانات بعد</p>
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className={`ad-card ${ad.status}`}>
              <div className="ad-info">
                <h4>{ad.title}</h4>
                <p>{ad.message}</p>
                <div className="ad-meta">
                  <span className={`status-badge status-${ad.status}`}>
                    {ad.status === "published" ? "منشور" : ad.status === "draft" ? "مسودة" : "متوقف"}
                  </span>
                  <span>الأولوية: {ad.priority}</span>
                </div>
              </div>
              <div className="ad-actions">
                <button onClick={() => togglePublish(ad.id)} className={`btn ${ad.status === "published" ? "btn-warning" : "btn-success"}`}>
                  {ad.status === "published" ? "إيقاف" : "نشر"}
                </button>
                <button onClick={() => { setEditingAd(ad); setForm({ title: ad.title, message: ad.message, linkUrl: ad.linkUrl || "", priority: ad.priority.toString(), startsAt: ad.startsAt.slice(0, 16), endsAt: ad.endsAt.slice(0, 16) }); setShowForm(true); }} className="btn btn-secondary">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => deleteAd(ad.id)} className="btn btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>(() => loadData<Offer[]>("admin_offers", []));
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState({ title: "", description: "", discountPercent: "", isFeatured: false, startsAt: "", endsAt: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: Offer = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      discountPercent: form.discountPercent ? parseInt(form.discountPercent) : undefined,
      isFeatured: form.isFeatured,
      status: "draft",
      startsAt: form.startsAt || new Date().toISOString(),
      endsAt: form.endsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const updated = editingOffer
      ? offers.map(o => o.id === editingOffer.id ? { ...newOffer, id: editingOffer.id, status: editingOffer.status } : o)
      : [...offers, newOffer];
    
    setOffers(updated);
    saveData("admin_offers", updated);
    setShowForm(false);
    setEditingOffer(null);
    setForm({ title: "", description: "", discountPercent: "", isFeatured: false, startsAt: "", endsAt: "" });
  };

  const togglePublish = (id: string) => {
    const updated = offers.map(o => o.id === id ? { ...o, status: (o.status === "published" ? "draft" : "published") as Offer["status"] } : o);
    setOffers(updated);
    saveData("admin_offers", updated);
  };

  const deleteOffer = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العرض؟")) {
      const updated = offers.filter(o => o.id !== id);
      setOffers(updated);
      saveData("admin_offers", updated);
    }
  };

  return (
    <div className="admin-offers">
      <div className="section-header">
        <h2><Tag size={24} /> إدارة العروض الترويجية</h2>
        <button onClick={() => { setShowForm(true); setEditingOffer(null); }} className="btn btn-primary">
          + عرض جديد
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingOffer ? "تعديل عرض" : "إضافة عرض جديد"}</h3>
              <button onClick={() => { setShowForm(false); setEditingOffer(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <label>
                عنوان العرض *
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              </label>
              <label>
                وصف العرض *
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required rows={3} />
              </label>
              <div className="form-row">
                <label>
                  نسبة الخصم (%)
                  <input type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => setForm({...form, discountPercent: e.target.value})} />
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({...form, isFeatured: e.target.checked})} />
                  عرض مميز
                </label>
              </div>
              <div className="form-row">
                <label>
                  تاريخ البداية
                  <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({...form, startsAt: e.target.value})} />
                </label>
                <label>
                  تاريخ النهاية
                  <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({...form, endsAt: e.target.value})} />
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">حفظ</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingOffer(null); }} className="btn btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="offers-list">
        {offers.length === 0 ? (
          <div className="empty-state">
            <Tag size={48} />
            <p>لا توجدعروض بعد</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className={`offer-card-admin ${offer.status}`}>
              <div className="offer-info">
                <h4>
                  {offer.isFeatured && <span className="featured-badge">مميز ⭐</span>}
                  {offer.title}
                </h4>
                <p>{offer.description}</p>
                {offer.discountPercent && <span className="discount-badge">خصم {offer.discountPercent}%</span>}
                <div className="offer-meta">
                  <span className={`status-badge status-${offer.status}`}>
                    {offer.status === "published" ? "منشور" : "مسودة"}
                  </span>
                </div>
              </div>
              <div className="offer-actions">
                <button onClick={() => togglePublish(offer.id)} className={`btn ${offer.status === "published" ? "btn-warning" : "btn-success"}`}>
                  {offer.status === "published" ? "إيقاف" : "نشر"}
                </button>
                <button onClick={() => { setEditingOffer(offer); setForm({ title: offer.title, description: offer.description, discountPercent: offer.discountPercent?.toString() || "", isFeatured: offer.isFeatured, startsAt: offer.startsAt.slice(0, 16), endsAt: offer.endsAt.slice(0, 16) }); setShowForm(true); }} className="btn btn-secondary">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => deleteOffer(offer.id)} className="btn btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: any }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setMessage("تم تغيير كلمة المرور بنجاح! (في وضع التطوير فقط)");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="admin-settings">
      <h2><Settings size={24} /> الإعدادات</h2>

      <div className="settings-section">
        <h3>معلومات الحساب</h3>
        <div className="settings-info">
          <div className="info-row"><label>البريد الإلكتروني:</label><span>{user.email}</span></div>
          <div className="info-row"><label>الاسم:</label><span>{user.name}</span></div>
          <div className="info-row"><label>الصلاحية:</label><span>{user.role}</span></div>
          <div className="info-row"><label>آخر دخول:</label><span>{new Date(user.loginTime).toLocaleString("ar-YE")}</span></div>
        </div>
      </div>

      <div className="settings-section">
        <h3>تغيير كلمة المرور</h3>
        <form onSubmit={handleChangePassword}>
          <label>
            كلمة المرور الحالية
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            كلمة المرور الجديدة
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
          </label>
          <label>
            تأكيد كلمة المرور
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
          {message && <div className={`message ${message.includes("بنجاح") ? "success" : "error"}`}>{message}</div>}
          <button type="submit" className="btn btn-primary">تغيير كلمة المرور</button>
        </form>
      </div>

      <div className="settings-section">
        <h3>الأمان والخصوصية</h3>
        <div className="security-info">
          <p>🔒 جميع البيانات محفوظة محلياً في متصفحك</p>
          <p>🛡️ لا توجد بيانات تُرسل لخادم خارجي</p>
          <p>📱 يمكنك استخدام البصمة لتسجيل الدخول السريع</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>الإصدار والمعلومات</h3>
        <div className="version-info">
          <p>الإصدار: v1.4.1</p>
          <p>آخر تحديث: {new Date().toLocaleDateString("ar-YE")}</p>
          <p>المطور: المهندس علي درهم الدحان</p>
        </div>
      </div>
    </div>
  );
}
