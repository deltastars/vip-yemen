import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BriefcaseBusiness, Building2, Globe2, Code2, Megaphone,
  Clock3, ShieldCheck, Check, X, ArrowLeft, Send, Eye,
  Filter, BarChart3, Archive, Trash2, ChevronDown, Tag,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

type SubmissionStatus = "pending" | "inReview" | "approved" | "rejected" | "archived" | "sold";
type SubmissionCategory = "employment" | "realEstateOffer" | "realEstateRequest" | "productOffer" | "productRequest" | "software";
type AdStatus = "draft" | "scheduled" | "published" | "paused" | "expired";

const departments = [
  { key: "all", label: "الكل", icon: BarChart3 },
  { key: "employment", label: "التوظيف", icon: BriefcaseBusiness },
  { key: "realEstate", label: "التسويق العقاري", icon: Building2 },
  { key: "eMarketing", label: "التسويق الإلكتروني", icon: Globe2 },
  { key: "software", label: "البرمجيات", icon: Code2 },
  { key: "ads", label: "الإعلانات", icon: Megaphone },
  { key: "offers", label: "العروض", icon: Tag },
] as const;

const categoryLabels: Record<SubmissionCategory, string> = {
  employment: "توظيف",
  realEstateOffer: "عرض عقار",
  realEstateRequest: "طلب عقار",
  productOffer: "عرض منتج",
  productRequest: "طلب منتج",
  software: "برمجيات",
};

const statusLabels: Record<SubmissionStatus, string> = {
  pending: "قيد الانتظار",
  inReview: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  archived: "مؤرشف",
  sold: "تم البيع",
};

const statusColors: Record<SubmissionStatus, string> = {
  pending: "#d97706",
  inReview: "#2563eb",
  approved: "#16a34a",
  rejected: "#dc2626",
  archived: "#6b7280",
  sold: "#7c3aed",
};

const adStatusLabel: Record<AdStatus, string> = {
  draft: "مسودة", scheduled: "مجدول", published: "منشور", paused: "متوقف", expired: "منتهي",
};

function getAdDisplayState(ad: { status: AdStatus; startsAt: Date | string; endsAt: Date | string; currentStatus?: AdStatus }): AdStatus {
  if (ad.currentStatus) return ad.currentStatus;
  if (ad.status === "draft" || ad.status === "paused") return ad.status;
  const now = Date.now();
  if (new Date(ad.endsAt).getTime() <= now) return "expired";
  if (new Date(ad.startsAt).getTime() > now) return "scheduled";
  return "published";
}

function toLocalDateTimeValue(value: Date | string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [notes, setNotes] = useState("");

  // Data queries
  const { data: submissions = [], refetch: refetchSubmissions } = trpc.submissions.adminList.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );
  const { data: ads = [], refetch: refetchAds } = trpc.advertisements.adminList.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );
  const { data: offers = [], refetch: refetchOffers } = trpc.offers.adminList.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  // Mutations
  const review = trpc.submissions.updateStatus.useMutation({
    onSuccess: () => { refetchSubmissions(); setSelectedSubmission(null); setNotes(""); },
  });
  const createAd = trpc.advertisements.create.useMutation({ onSuccess: () => refetchAds() });
  const updateAd = trpc.advertisements.update.useMutation({ onSuccess: () => refetchAds() });
  const removeAd = trpc.advertisements.remove.useMutation({ onSuccess: () => refetchAds() });
  const createOffer = trpc.offers.create.useMutation({ onSuccess: () => refetchOffers() });
  const updateOfferMut = trpc.offers.update.useMutation({ onSuccess: () => refetchOffers() });
  const removeOffer = trpc.offers.remove.useMutation({ onSuccess: () => refetchOffers() });
  const [adPreview, setAdPreview] = useState({ title: "عنوان الإعلان", message: "سيظهر نص الإعلان هنا بشكل متحرك وبطيء." });
  const [offerForm, setOfferForm] = useState({ title: "", description: "", imageUrl: "", videoUrl: "", category: "", originalPrice: "", offerPrice: "", discountPercent: 0, status: "draft", startsAt: "", endsAt: "", priority: 0, isFeatured: false, contactPhone: "" });

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item: any) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.fullName?.toLowerCase().includes(q) ||
          item.phone?.includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submissions, statusFilter, searchQuery]);

  // Department submissions
  const deptSubmissions = useMemo(() => {
    const map: Record<string, any[]> = {
      employment: filteredSubmissions.filter((s: any) => s.category === "employment"),
      realEstate: filteredSubmissions.filter((s: any) => s.category === "realEstateOffer" || s.category === "realEstateRequest"),
      eMarketing: filteredSubmissions.filter((s: any) => s.category === "productOffer" || s.category === "productRequest"),
      software: filteredSubmissions.filter((s: any) => s.category === "software"),
    };
    return map;
  }, [filteredSubmissions]);

  // Stats
  const stats = useMemo(() => ({
    total: submissions.length,
    pending: submissions.filter((s: any) => s.status === "pending").length,
    inReview: submissions.filter((s: any) => s.status === "inReview").length,
    approved: submissions.filter((s: any) => s.status === "approved").length,
    rejected: submissions.filter((s: any) => s.status === "rejected").length,
    sold: submissions.filter((s: any) => s.status === "sold").length,
    byDept: {
      employment: submissions.filter((s: any) => s.category === "employment").length,
      realEstate: submissions.filter((s: any) => s.category?.startsWith("realEstate")).length,
      eMarketing: submissions.filter((s: any) => s.category?.startsWith("product")).length,
      software: submissions.filter((s: any) => s.category === "software").length,
    },
  }), [submissions]);

  // Auth gate
  if (loading) return <div className="admin-loading">جارٍ التحقق من صلاحية الإدارة...</div>;
  if (!user) return (
    <div className="admin-gate">
      <ShieldCheck size={34} />
      <h1>لوحة إدارة ViP Yemen</h1>
      <p>تسجيل الدخول مطلوب للوصول إلى البيانات الخاصة.</p>
      <button className="button button-primary" onClick={() => startLogin()}>تسجيل الدخول الآمن</button>
      <Link href="/">العودة للمنصة</Link>
    </div>
  );
  if (user.role !== "admin") return (
    <div className="admin-gate">
      <ShieldCheck size={34} />
      <h1>ليس لديك صلاحية الإدارة</h1>
      <p>هذه المنطقة مخصصة لإدارة المنصة فقط.</p>
      <Link href="/">العودة للمنصة</Link>
    </div>
  );

  const submitAd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    createAd.mutate({
      title: String(form.get("title")),
      message: String(form.get("message")),
      linkUrl: String(form.get("linkUrl") || ""),
      startsAt: new Date(String(form.get("startsAt"))),
      endsAt: new Date(String(form.get("endsAt"))),
      priority: Number(form.get("priority") || 0),
      status: String(form.get("status") || "draft") as AdStatus,
    });
    event.currentTarget.reset();
    setAdPreview({ title: "عنوان الإعلان", message: "سيظهر نص الإعلان هنا بشكل متحرك وبطيء." });
  };

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> مركز التحكم</div>
          <h1>إدارة المنصة</h1>
          <p>مرحبًا {user.name || user.email}. إدارة شاملة لجميع أقسام المنصة.</p>
        </div>
        <Link className="button button-dark" href="/">فتح المنصة <ArrowLeft size={16} /></Link>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">إجمالي الطلبات</div>
          <div className="stat-breakdown">
            <span style={{ color: "#d97706" }}>{stats.pending} قيد الانتظار</span>
            <span style={{ color: "#2563eb" }}>{stats.inReview} قيد المراجعة</span>
          </div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">تمت الموافقة</div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">مرفوض</div>
        </div>
        <div className="stat-card stat-sold">
          <div className="stat-number">{stats.sold}</div>
          <div className="stat-label">تم البيع</div>
        </div>
        <div className="stat-card stat-dept">
          <div className="stat-number">{stats.byDept.employment}</div>
          <div className="stat-label">طلبات التوظيف</div>
        </div>
        <div className="stat-card stat-dept">
          <div className="stat-number">{stats.byDept.realEstate}</div>
          <div className="stat-label">العقارات</div>
        </div>
        <div className="stat-card stat-dept">
          <div className="stat-number">{stats.byDept.eMarketing}</div>
          <div className="stat-label">التسويق الإلكتروني</div>
        </div>
        <div className="stat-card stat-dept">
          <div className="stat-number">{stats.byDept.software}</div>
          <div className="stat-label">البرمجيات</div>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="dept-tabs">
        {departments.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`dept-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} />
            <span>{label}</span>
            {key !== "all" && key !== "ads" && (
              <span className="dept-count">{deptSubmissions[key as keyof typeof deptSubmissions]?.length || 0}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab !== "ads" && (
        <div className="admin-filters">
          <div className="filter-group">
            <Filter size={14} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="inReview">قيد المراجعة</option>
              <option value="approved">تمت الموافقة</option>
              <option value="rejected">مرفوض</option>
              <option value="archived">مؤرشف</option>
              <option value="sold">تم البيع</option>
            </select>
          </div>
          <input
            className="filter-search"
            placeholder="بحث في الطلبات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Department Content */}
      <div className="admin-content-area">
        {/* All Submissions / Department Submissions */}
        {activeTab !== "ads" && (
          <section className="admin-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  {activeTab === "all"
                    ? "جميع الطلبات"
                    : activeTab === "employment"
                    ? "قسم التوظيف"
                    : activeTab === "realEstate"
                    ? "قسم التسويق العقاري"
                    : activeTab === "eMarketing"
                    ? "قسم التسويق الإلكتروني"
                    : "قسم البرمجيات"}
                </h2>
                <p>{filteredSubmissions.length} طلبًا في السجل</p>
              </div>
              <ShieldCheck />
            </div>

            <div className="submissions-grid">
              {filteredSubmissions.map((item: any) => (
                <article className="submission-card" key={item.id}>
                  <div className="submission-card-header">
                    <span className="category-badge">{categoryLabels[item.category as SubmissionCategory]}</span>
                    <span
                      className="status-badge"
                      style={{ background: statusColors[item.status as SubmissionStatus] + "18", color: statusColors[item.status as SubmissionStatus] }}
                    >
                      {statusLabels[item.status as SubmissionStatus]}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="submission-meta">
                    <span>👤 {item.fullName}</span>
                    <span>📱 {item.phone}</span>
                    {item.address && <span>📍 {item.address}</span>}
                  </div>
                  <p className="submission-desc">{item.description?.slice(0, 120)}...</p>
                  <div className="submission-date">{new Date(item.createdAt).toLocaleString("ar-YE")}</div>
                  <div className="submission-actions">
                    <button className="action-btn view-btn" onClick={() => { setSelectedSubmission(item); setNotes(item.internalNotes || ""); }}>
                      <Eye size={14} /> عرض
                    </button>
                    <button
                      className="action-btn approve-btn"
                      onClick={() => review.mutate({ id: item.id, status: "approved" })}
                    >
                      <Check size={14} /> اعتماد
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => review.mutate({ id: item.id, status: "rejected" })}
                    >
                      <X size={14} /> رفض
                    </button>
                  </div>
                </article>
              ))}
              {!filteredSubmissions.length && <div className="empty-state">لا توجد طلبات في هذا القسم.</div>}
            </div>
          </section>
        )}

        {/* Ads Section */}
        {activeTab === "ads" && (
          <>
            <section className="admin-panel">
              <div className="panel-heading">
                <div>
                  <h2>إنشاء إعلان ترويجي جديد</h2>
                  <p>يظهر تلقائيًا في شريط الإعلانات العلوي خلال الفترة المحددة.</p>
                </div>
                <Megaphone />
              </div>
              <form className="admin-form" onSubmit={submitAd}>
                <label>عنوان الإعلان<input name="title" required maxLength={220} onChange={(e) => setAdPreview((v) => ({ ...v, title: e.target.value || "عنوان الإعلان" }))} /></label>
                <label>نص الشريط<input name="message" required maxLength={500} onChange={(e) => setAdPreview((v) => ({ ...v, message: e.target.value || "سيظهر نص الإعلان هنا بشكل متحرك وبطيء." }))} /></label>
                <label>رابط اختياري<input name="linkUrl" type="url" placeholder="https://..." /></label>
                <div className="form-two">
                  <label>يبدأ في<input name="startsAt" type="datetime-local" required /></label>
                  <label>ينتهي في<input name="endsAt" type="datetime-local" required /></label>
                </div>
                <label>الأولوية<input name="priority" type="number" defaultValue={0} min={-100} max={100} /></label>
                <label>حالة الإعلان<select name="status" defaultValue="draft">
                  <option value="draft">مسودة</option>
                  <option value="scheduled">مجدول</option>
                  <option value="published">منشور الآن</option>
                  <option value="paused">متوقف</option>
                </select></label>
                <div className="ad-preview">
                  <span><Megaphone size={14} /> معاينة مباشرة</span>
                  <strong>{adPreview.title}</strong>
                  <small>{adPreview.message}</small>
                </div>
                <button className="button button-primary full" disabled={createAd.isPending}>حفظ ونشر الإعلان <Send size={16} /></button>
              </form>
            </section>

            <section className="admin-panel" style={{ marginTop: "22px" }}>
              <div className="panel-heading">
                <div>
                  <h2>الإعلانات الحالية</h2>
                  <p>{ads.length} إعلانًا في السجل</p>
                </div>
                <Clock3 />
              </div>
              <div className="admin-list">
                {ads.map((ad: any) => (
                  <article className="admin-item" key={ad.id}>
                    <div>
                      <strong>{ad.title}</strong>
                      <p>{ad.message}</p>
                      <small>{new Date(ad.startsAt).toLocaleString("ar-YE")} — {new Date(ad.endsAt).toLocaleString("ar-YE")}</small>
                      <span className={`ad-status ad-status-${getAdDisplayState(ad)}`}>{adStatusLabel[getAdDisplayState(ad)]}</span>
                    </div>
                    <details className="ad-edit">
                      <summary>تحرير</summary>
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        updateAd.mutate({
                          id: ad.id,
                          title: String(form.get("title")),
                          message: String(form.get("message")),
                          linkUrl: String(form.get("linkUrl") || ""),
                          startsAt: new Date(String(form.get("startsAt"))),
                          endsAt: new Date(String(form.get("endsAt"))),
                          priority: Number(form.get("priority") || 0),
                          status: String(form.get("status")) as AdStatus,
                        });
                      }}>
                        <input name="title" defaultValue={ad.title} />
                        <input name="message" defaultValue={ad.message} />
                        <input name="linkUrl" defaultValue={ad.linkUrl || ""} />
                        <div className="form-two">
                          <input name="startsAt" type="datetime-local" defaultValue={toLocalDateTimeValue(ad.startsAt)} />
                          <input name="endsAt" type="datetime-local" defaultValue={toLocalDateTimeValue(ad.endsAt)} />
                        </div>
                        <input name="priority" type="number" defaultValue={ad.priority} />
                        <select name="status" defaultValue={getAdDisplayState(ad)}>
                          <option value="draft">مسودة</option>
                          <option value="scheduled">مجدول</option>
                          <option value="published">منشور</option>
                          <option value="paused">متوقف</option>
                          <option value="expired">منتهي</option>
                        </select>
                        <button type="submit" disabled={updateAd.isPending}>حفظ</button>
                      </form>
                    </details>
                    <div className="item-actions">
                      <button className="danger" onClick={() => removeAd.mutate({ id: ad.id })}>حذف</button>
                    </div>
                  </article>
                ))}
                {!ads.length && <div className="empty-state">لا توجد إعلانات محفوظة بعد.</div>}
              </div>
            </section>
          </>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <>
            <section className="admin-panel">
              <div className="panel-heading">
                <div>
                  <h2>إنشاء عرض ترويجي جديد</h2>
                  <p>يظهر العرض في قسم العروض على واجهة المنصة.</p>
                </div>
                <Tag />
              </div>
              <form className="admin-offer-form" onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                createOffer.mutate({
                  title: String(form.get("title")),
                  description: String(form.get("description")),
                  imageUrl: String(form.get("imageUrl") || ""),
                  videoUrl: String(form.get("videoUrl") || ""),
                  category: String(form.get("category") || ""),
                  originalPrice: String(form.get("originalPrice") || ""),
                  offerPrice: String(form.get("offerPrice") || ""),
                  discountPercent: Number(form.get("discountPercent") || 0),
                  status: String(form.get("status") || "draft") as any,
                  startsAt: form.get("startsAt") ? new Date(String(form.get("startsAt"))) : undefined,
                  endsAt: form.get("endsAt") ? new Date(String(form.get("endsAt"))) : undefined,
                  priority: Number(form.get("priority") || 0),
                  isFeatured: form.get("isFeatured") === "on",
                  contactPhone: String(form.get("contactPhone") || ""),
                });
                event.currentTarget.reset();
              }}>
                <label>عنوان العرض<input name="title" required maxLength={220} placeholder="مثال: تخفيض 30% على الأجهزة" /></label>
                <label>وصف العرض<textarea name="description" required minLength={5} placeholder="تفاصيل العرض والشروط..." /></label>
                <label>رابط الصورة<input name="imageUrl" placeholder="https://... أو /manus-storage/..." /></label>
                <label>رابط الفيديو (اختياري)<input name="videoUrl" placeholder="رابط فيديو قصير للعرض" /></label>
                <div className="form-two">
                  <label>التصنيف<input name="category" placeholder="مثال: إلكترونيات، عقارات" /></label>
                  <label>رقم التواصل<input name="contactPhone" placeholder="رقم واتساب" /></label>
                </div>
                <div className="form-two">
                  <label>السعر الأصلي<input name="originalPrice" placeholder="اختياري" /></label>
                  <label>سعر العرض<input name="offerPrice" placeholder="اختياري" /></label>
                </div>
                <div className="form-two">
                  <label>نسبة الخصم (%)<input name="discountPercent" type="number" min={0} max={100} defaultValue={0} /></label>
                  <label>الأولوية<input name="priority" type="number" defaultValue={0} min={-100} max={100} /></label>
                </div>
                <div className="form-two">
                  <label>يبدأ في<input name="startsAt" type="datetime-local" /></label>
                  <label>ينتهي في<input name="endsAt" type="datetime-local" /></label>
                </div>
                <label>الحالة<select name="status" defaultValue="draft">
                  <option value="draft">مسودة</option>
                  <option value="published">منشور الآن</option>
                  <option value="scheduled">مجدول</option>
                </select></label>
                <label className="check-row"><input name="isFeatured" type="checkbox" /> عرض مميز (يظهر في الأعلى)</label>
                <button className="button button-primary full" disabled={createOffer.isPending}>حفظ ونشر العرض <Send size={16} /></button>
              </form>
            </section>

            <section className="admin-panel" style={{ marginTop: "22px" }}>
              <div className="panel-heading">
                <div>
                  <h2>العروض الحالية</h2>
                  <p>{offers.length} عرض في السجل</p>
                </div>
                <Tag />
              </div>
              <div className="admin-list">
                {offers.map((offer: any) => (
                  <div className="offer-admin-card" key={offer.id}>
                    {offer.imageUrl && <img src={offer.imageUrl} alt={offer.title} loading="lazy" />}
                    <div className="offer-admin-info">
                      <strong>{offer.title}</strong>
                      <p>{offer.description?.slice(0, 100)}...</p>
                      <small>{offer.category} | {offer.status} | {offer.isFeatured ? "مميز" : "عادي"}</small>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => updateOfferMut.mutate({ id: offer.id, status: offer.status === "published" ? "paused" : "published" })}>
                        {offer.status === "published" ? "إيقاف" : "نشر"}
                      </button>
                      <button className="danger" onClick={() => { if (window.confirm("حذف هذا العرض؟")) removeOffer.mutate({ id: offer.id }); }}>حذف</button>
                    </div>
                  </div>
                ))}
                {!offers.length && <div className="empty-state">لا توجد عروض محفوظة بعد.</div>}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="submission-modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تفاصيل الطلب</h2>
              <button className="modal-close" onClick={() => setSelectedSubmission(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <span className="detail-label">نوع الطلب</span>
                <span className="category-badge">{categoryLabels[selectedSubmission.category as SubmissionCategory]}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">العنوان</span>
                <span className="detail-value">{selectedSubmission.title}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">الاسم الكامل</span>
                <span className="detail-value">{selectedSubmission.fullName}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">رقم الهاتف</span>
                <span className="detail-value">{selectedSubmission.phone}</span>
              </div>
              {selectedSubmission.address && (
                <div className="detail-section">
                  <span className="detail-label">العنوان</span>
                  <span className="detail-value">{selectedSubmission.address}</span>
                </div>
              )}
              {selectedSubmission.organizationName && (
                <div className="detail-section">
                  <span className="detail-label">اسم المنشأة</span>
                  <span className="detail-value">{selectedSubmission.organizationName}</span>
                </div>
              )}
              {selectedSubmission.profession && (
                <div className="detail-section">
                  <span className="detail-label">المهنة / النوع</span>
                  <span className="detail-value">{selectedSubmission.profession}</span>
                </div>
              )}
              {selectedSubmission.propertyType && (
                <div className="detail-section">
                  <span className="detail-label">نوع العقار</span>
                  <span className="detail-value">{selectedSubmission.propertyType}</span>
                </div>
              )}
              {selectedSubmission.productType && (
                <div className="detail-section">
                  <span className="detail-label">نوع المنتج</span>
                  <span className="detail-value">{selectedSubmission.productType}</span>
                </div>
              )}
              {selectedSubmission.price && (
                <div className="detail-section">
                  <span className="detail-label">السعر / الميزانية</span>
                  <span className="detail-value">{selectedSubmission.price}</span>
                </div>
              )}
              <div className="detail-section">
                <span className="detail-label">التفاصيل</span>
                <p className="detail-desc">{selectedSubmission.description}</p>
              </div>
              {selectedSubmission.requirements && (
                <div className="detail-section">
                  <span className="detail-label">الشروط والمتطلبات</span>
                  <p className="detail-desc">{selectedSubmission.requirements}</p>
                </div>
              )}
              <div className="detail-section">
                <span className="detail-label">تاريخ الإنشاء</span>
                <span className="detail-value">{new Date(selectedSubmission.createdAt).toLocaleString("ar-YE")}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">الحالة الحالية</span>
                <span className="status-badge" style={{ background: statusColors[selectedSubmission.status as SubmissionStatus] + "18", color: statusColors[selectedSubmission.status as SubmissionStatus] }}>
                  {statusLabels[selectedSubmission.status as SubmissionStatus]}
                </span>
              </div>
              <div className="detail-section">
                <span className="detail-label">ملاحظات داخلية</span>
                <textarea
                  className="notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="إضافة ملاحظات داخلية..."
                />
              </div>
              <div className="detail-section">
                <span className="detail-label">إرسال واتساب مباشر</span>
                <a
                  href={`https://wa.me/${selectedSubmission.phone?.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-link"
                >
                  💬 التواصل عبر واتساب
                </a>
              </div>
            </div>
            <div className="modal-actions">
              <button className="action-btn approve-btn" onClick={() => review.mutate({ id: selectedSubmission.id, status: "approved", internalNotes: notes })}>
                <Check size={14} /> اعتماد ونشر
              </button>
              <button className="action-btn" style={{ background: "#2563eb", color: "#fff" }} onClick={() => review.mutate({ id: selectedSubmission.id, status: "inReview", internalNotes: notes })}>
                <Clock3 size={14} /> قيد المراجعة
              </button>
              <button className="action-btn reject-btn" onClick={() => review.mutate({ id: selectedSubmission.id, status: "rejected", internalNotes: notes })}>
                <X size={14} /> رفض
              </button>
              <button className="action-btn" style={{ background: "#6b7280", color: "#fff" }} onClick={() => review.mutate({ id: selectedSubmission.id, status: "archived", internalNotes: notes })}>
                <Archive size={14} /> أرشفة
              </button>
              {selectedSubmission.category?.startsWith("product") && (
                <button className="action-btn" style={{ background: "#7c3aed", color: "#fff" }} onClick={() => review.mutate({ id: selectedSubmission.id, status: "sold", internalNotes: notes })}>
                  <Check size={14} /> تم البيع
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
