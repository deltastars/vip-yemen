import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ShieldCheck, LogOut, BarChart3, Users, BriefcaseBusiness,
  Building2, Globe2, Code2, Megaphone, Tag, Eye, Check, X,
  Settings, FileText, TrendingUp, Clock, ChevronDown,
} from "lucide-react";

type Tab = "overview" | "submissions" | "ads" | "offers" | "settings";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      setUser(JSON.parse(stored));
      setLoading(false);
    } else {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.removeItem("admin_user");
    setLocation("/admin");
  };

  if (loading) return <div className="admin-loading">جارٍ التحميل...</div>;
  if (!user) return null;

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "submissions", label: "الطلبات", icon: FileText },
    { key: "ads", label: "الإعلانات", icon: Megaphone },
    { key: "offers", label: "العروض", icon: Tag },
    { key: "settings", label: "الإعدادات", icon: Settings },
  ] as const;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-right">
          <ShieldCheck size={24} />
          <div>
            <h1>لوحة التحكم الرئيسية</h1>
            <p>مرحبًا {user.name}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
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
        {activeTab === "submissions" && <SubmissionsTab />}
        {activeTab === "ads" && <AdsTab />}
        {activeTab === "offers" && <OffersTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { label: "إجمالي الطلبات", value: "0", icon: FileText, color: "#3B82F6" },
    { label: "قيد المراجعة", value: "0", icon: Clock, color: "#F59E0B" },
    { label: "تمت الموافقة", value: "0", icon: Check, color: "#10B981" },
    { label: "الإعلانات النشطة", value: "0", icon: Megaphone, color: "#8B5CF6" },
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
      <div className="admin-sections">
        <div className="admin-section-card">
          <h3>الأقسام الرئيسية</h3>
          <div className="section-list">
            <div className="section-item"><BriefcaseBusiness size={20} /><span>التوظيف</span><span className="badge">0</span></div>
            <div className="section-item"><Building2 size={20} /><span>التسويق العقاري</span><span className="badge">0</span></div>
            <div className="section-item"><Globe2 size={20} /><span>التسويق الإلكتروني</span><span className="badge">0</span></div>
            <div className="section-item"><Code2 size={20} /><span>البرمجيات</span><span className="badge">0</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionsTab() {
  return (
    <div className="admin-submissions">
      <h2>إدارة الطلبات</h2>
      <div className="admin-filters">
        <select><option>جميع الأقسام</option><option>التوظيف</option><option>العقارات</option><option>التسويق</option><option>البرمجيات</option></select>
        <select><option>جميع الحالات</option><option>قيد الانتظار</option><option>قيد المراجعة</option><option>تمت الموافقة</option><option>مرفوض</option></select>
      </div>
      <div className="admin-empty-state">
        <FileText size={48} />
        <h3>لا توجد طلبات حالياً</h3>
        <p>ستظهر الطلبات هنا عندما يسجل المستخدمون بياناتهم</p>
      </div>
    </div>
  );
}

function AdsTab() {
  return (
    <div className="admin-ads">
      <h2>إدارة الإعلانات</h2>
      <button className="admin-create-btn">+ إنشاء إعلان جديد</button>
      <div className="admin-empty-state">
        <Megaphone size={48} />
        <h3>لا توجد إعلانات حالياً</h3>
        <p>أنشئ إعلانات جديدة لتظهر في شريط الإعلانات</p>
      </div>
    </div>
  );
}

function OffersTab() {
  return (
    <div className="admin-offers">
      <h2>إدارة العروض</h2>
      <button className="admin-create-btn">+ إنشاء عرض جديد</button>
      <div className="admin-empty-state">
        <Tag size={48} />
        <h3>لا توجد عروض حالياً</h3>
        <p>أنشئ عروض ترويجية لتظهر في قسم العروض</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="admin-settings">
      <h2>إعدادات المنصة</h2>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>معلومات الحساب</h3>
          <p>البريد: vipservicesyemen@gmail.com</p>
          <p>المستخدم: المهندس علي درهم الدحان</p>
        </div>
        <div className="settings-card">
          <h3>إعدادات الأمان</h3>
          <button className="admin-btn">تغيير كلمة المرور</button>
        </div>
      </div>
    </div>
  );
}
