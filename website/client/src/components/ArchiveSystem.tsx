import { useState, useMemo } from "react";
import { 
  Archive, Search, Filter, Tag, Folder, FolderOpen, FileText, 
  Calendar, Clock, Eye, Download, Trash2, Plus, CheckCircle2,
  ChevronDown, ChevronRight, Hash, Layers
} from "lucide-react";

type Language = "ar" | "en";

interface ArchiveDocument {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  tags: string[];
  description: string;
  fileType: "pdf" | "image" | "doc" | "contract" | "invoice" | "other";
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  indexedAt: string;
  status: "active" | "archived" | "pending";
  relatedTo?: string;
  priority: "high" | "medium" | "low";
}

const t = (lang: Language, ar: string, en: string) => lang === "ar" ? ar : en;
function genId() { return `ARC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }

const CATEGORIES = [
  { ar: "عقود", en: "Contracts", icon: "📝", color: "#2563EB" },
  { ar: "فواتير", en: "Invoices", icon: "🧾", color: "#059669" },
  { ar: "توظيف", en: "Employment", icon: "💼", color: "#7C3AED" },
  { ar: "عقاري", en: "Real Estate", icon: "🏠", color: "#D97706" },
  { ar: "تسويق", en: "Marketing", icon: "📢", color: "#DC2626" },
  { ar: "إداري", en: "Administrative", icon: "📋", color: "#6B7280" },
  { ar: "قانوني", en: "Legal", icon: "⚖️", color: "#1D4ED8" },
  { ar: "مالي", en: "Financial", icon: "💰", color: "#059669" },
  { ar: "أخرى", en: "Other", icon: "📦", color: "#9CA3AF" },
];

const FILE_TYPES = {
  pdf: { icon: "📄", color: "#DC2626" },
  image: { icon: "🖼️", color: "#2563EB" },
  doc: { icon: "📝", color: "#059669" },
  contract: { icon: "📋", color: "#7C3AED" },
  invoice: { icon: "🧾", color: "#D97706" },
  other: { icon: "📦", color: "#6B7280" },
};

export function ArchiveSystem({ language }: { language: Language }) {
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    title: "", titleEn: "", category: "", tags: "", description: "",
    fileType: "doc" as ArchiveDocument["fileType"], priority: "medium" as ArchiveDocument["priority"],
    relatedTo: ""
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    documents.forEach(d => d.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [documents]);

  const stats = useMemo(() => ({
    total: documents.length,
    active: documents.filter(d => d.status === "active").length,
    archived: documents.filter(d => d.status === "archived").length,
    pending: documents.filter(d => d.status === "pending").length,
    byCategory: CATEGORIES.map(c => ({
      ...c,
      count: documents.filter(d => d.category === (language === "ar" ? c.ar : c.en)).length
    }))
  }), [documents, language]);

  const addDocument = () => {
    if (!form.title || !form.category) return;
    const now = new Date().toISOString();
    const doc: ArchiveDocument = {
      id: genId(), title: form.title, titleEn: form.titleEn || form.title,
      category: form.category, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      description: form.description, fileType: form.fileType, fileSize: "—",
      uploadedBy: "admin", uploadedAt: now, indexedAt: now,
      status: "active", relatedTo: form.relatedTo, priority: form.priority
    };
    setDocuments([doc, ...documents]);
    setShowForm(false);
    setForm({ title: "", titleEn: "", category: "", tags: "", description: "", fileType: "doc", priority: "medium", relatedTo: "" });
  };

  const filtered = documents.filter(d => {
    const matchSearch = !searchQuery || d.title.includes(searchQuery) || d.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || d.tags.some(t => t.includes(searchQuery));
    const matchCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchTag = tagFilter === "all" || d.tags.includes(tagFilter);
    return matchSearch && matchCategory && matchStatus && matchTag;
  });

  return (
    <div className="accounting-system">
      <style>{`
        .archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .archive-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; transition: all 0.2s; cursor: pointer; }
        .archive-card:hover { border-color: #F3B71B; box-shadow: 0 4px 12px rgba(243,183,27,.1); transform: translateY(-2px); }
        .archive-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .archive-card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .archive-card-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .archive-card-desc { font-size: 12px; color: #6B7280; line-height: 1.6; margin-bottom: 10px; }
        .archive-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .archive-tag { padding: 2px 8px; background: #F3F4F6; border-radius: 12px; font-size: 11px; color: #374151; }
        .archive-sidebar { display: flex; flex-direction: column; gap: 8px; }
        .archive-sidebar-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: background 0.15s; font-size: 13px; }
        .archive-sidebar-item:hover { background: #F3F4F6; }
        .archive-sidebar-item.active { background: #FEF3C7; font-weight: 600; }
        .archive-count { background: #E5E7EB; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .archive-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
        @media (max-width: 768px) { .archive-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div className="accounting-header">
        <h2><Archive size={24} /> {t(language, "نظام الأرشفة والفهرسة", "Archive & Indexing System")}</h2>
        <p>{t(language, "أرشفة وفهرسة وتصنيف جميع المستندات والملفات", "Archive, index, and categorize all documents and files")}</p>
      </div>

      <div className="accounting-body">
        <div className="archive-layout">
          <div>
            <div className="archive-sidebar">
              <div style={{ fontWeight: 700, fontSize: 13, padding: "8px 14px", color: "#6B7280" }}>{t(language, "التصنيفات", "Categories")}</div>
              <div className={`archive-sidebar-item ${categoryFilter === "all" ? "active" : ""}`} onClick={() => setCategoryFilter("all")}>
                <span>📁 {t(language, "جميع التصنيفات", "All Categories")}</span>
                <span className="archive-count">{stats.total}</span>
              </div>
              {stats.byCategory.map(cat => (
                <div key={cat.en} className={`archive-sidebar-item ${categoryFilter === (language === "ar" ? cat.ar : cat.en) ? "active" : ""}`} onClick={() => setCategoryFilter(language === "ar" ? cat.ar : cat.en)}>
                  <span>{cat.icon} {language === "ar" ? cat.ar : cat.en}</span>
                  <span className="archive-count">{cat.count}</span>
                </div>
              ))}
              {allTags.length > 0 && (
                <>
                  <div style={{ fontWeight: 700, fontSize: 13, padding: "8px 14px", color: "#6B7280", marginTop: 16 }}>{t(language, "الوسوم", "Tags")}</div>
                  <div className={`archive-sidebar-item ${tagFilter === "all" ? "active" : ""}`} onClick={() => setTagFilter("all")}>
                    <span><Tag size={14} /> {t(language, "جميع الوسوم", "All Tags")}</span>
                  </div>
                  {allTags.slice(0, 10).map(tag => (
                    <div key={tag} className={`archive-sidebar-item ${tagFilter === tag ? "active" : ""}`} onClick={() => setTagFilter(tag)}>
                      <span># {tag}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div>
            <div className="filter-bar">
              <input placeholder={t(language, "بحث في الأرشيف...", "Search archive...")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1 }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">{t(language, "جميع الحالات", "All Status")}</option>
                <option value="active">{t(language, "نشط", "Active")}</option>
                <option value="archived">{t(language, "مؤرشف", "Archived")}</option>
                <option value="pending">{t(language, "قيد المراجعة", "Pending")}</option>
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                <button className={`action-btn ${viewMode === "grid" ? "primary" : ""}`} onClick={() => setViewMode("grid")}><Layers size={14} /></button>
                <button className={`action-btn ${viewMode === "list" ? "primary" : ""}`} onClick={() => setViewMode("list")}><Folder size={14} /></button>
              </div>
              <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "مستند جديد", "New Document")}</button>
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
                <Archive size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>{t(language, "لا توجد مستندات بعد", "No documents yet")}</p>
              </div>
            )}

            {viewMode === "grid" ? (
              <div className="archive-grid">
                {filtered.map(doc => {
                  const ft = FILE_TYPES[doc.fileType];
                  const cat = CATEGORIES.find(c => language === "ar" ? c.ar === doc.category : c.en === doc.category);
                  return (
                    <div key={doc.id} className="archive-card">
                      <div className="archive-card-header">
                        <div className="archive-card-icon" style={{ background: `${cat?.color || "#6B7280"}15` }}>{ft.icon}</div>
                        <span className={`status-badge ${doc.status === "active" ? "paid" : doc.status === "archived" ? "reversed" : "sent"}`}>
                          {t(language, doc.status === "active" ? "نشط" : doc.status === "archived" ? "مؤرشف" : "قيد المراجعة", doc.status)}
                        </span>
                      </div>
                      <div className="archive-card-title">{language === "ar" ? doc.title : doc.titleEn}</div>
                      <div className="archive-card-desc">{doc.description}</div>
                      <div className="archive-tags">
                        {doc.tags.map(tag => <span key={tag} className="archive-tag">#{tag}</span>)}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: "#9CA3AF", display: "flex", justifyContent: "space-between" }}>
                        <span>📅 {doc.uploadedAt.slice(0, 10)}</span>
                        <span>{cat?.icon} {doc.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="acct-table">
                  <thead>
                    <tr>
                      <th>{t(language, "المستند", "Document")}</th>
                      <th>{t(language, "التصنيف", "Category")}</th>
                      <th>{t(language, "الوسوم", "Tags")}</th>
                      <th>{t(language, "التاريخ", "Date")}</th>
                      <th>{t(language, "الحالة", "Status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{language === "ar" ? doc.title : doc.titleEn}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{doc.description.slice(0, 60)}</div>
                        </td>
                        <td>{doc.category}</td>
                        <td><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{doc.tags.map(t => <span key={t} className="archive-tag">#{t}</span>)}</div></td>
                        <td style={{ fontSize: 12 }}>{doc.uploadedAt.slice(0, 10)}</td>
                        <td><span className={`status-badge ${doc.status === "active" ? "paid" : doc.status === "archived" ? "reversed" : "sent"}`}>{t(language, doc.status === "active" ? "نشط" : doc.status === "archived" ? "مؤرشف" : "قيد المراجعة", doc.status)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t(language, "مستند جديد", "New Document")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t(language, "التصنيف", "Category")}</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">{t(language, "اختر التصنيف", "Select category")}</option>
                    {CATEGORIES.map(c => <option key={c.en} value={language === "ar" ? c.ar : c.en}>{c.icon} {language === "ar" ? c.ar : c.en}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t(language, "نوع الملف", "File Type")}</label>
                  <select value={form.fileType} onChange={e => setForm({ ...form, fileType: e.target.value as any })}>
                    <option value="doc">{t(language, "مستند", "Document")}</option>
                    <option value="pdf">{t(language, "PDF", "PDF")}</option>
                    <option value="image">{t(language, "صورة", "Image")}</option>
                    <option value="contract">{t(language, "عقد", "Contract")}</option>
                    <option value="invoice">{t(language, "فاتورة", "Invoice")}</option>
                    <option value="other">{t(language, "أخرى", "Other")}</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "العنوان (عربي)", "Title (Arabic)")}</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "العنوان (إنجليزي)", "Title (English)")}</label>
                  <input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "الوصف", "Description")}</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "الوسوم (مفصولة بفاصلة)", "Tags (comma-separated)")}</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder={t(language, "عقد, خدمات, 2026", "contract, services, 2026")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "الأولوية", "Priority")}</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })}>
                    <option value="high">{t(language, "عالية", "High")}</option>
                    <option value="medium">{t(language, "متوسطة", "Medium")}</option>
                    <option value="low">{t(language, "منخفضة", "Low")}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addDocument}>{t(language, "حفظ المستند", "Save Document")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
