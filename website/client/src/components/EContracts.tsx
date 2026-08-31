import { useState, useMemo } from "react";
import { 
  FileSignature, Shield, CheckCircle2, Clock, AlertTriangle, 
  Plus, Search, Eye, Edit3, Download, Lock, Stamp,
  UserCheck, Calendar, Hash, ArrowUpRight
} from "lucide-react";

type Language = "ar" | "en";

interface Contract {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  type: "service" | "employment" | "real_estate" | "marketing" | "general";
  partyA: string;
  partyAPhone: string;
  partyB: string;
  partyBPhone: string;
  description: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "draft" | "pending_signatures" | "active" | "completed" | "terminated" | "expired";
  signatureA?: string;
  signatureB?: string;
  signedAt?: string;
  terms: string[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

const t = (lang: Language, ar: string, en: string) => lang === "ar" ? ar : en;
function genId() { return `CTR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
function genNumber() { return `EC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`; }

const CONTRACT_TYPES = [
  { value: "service", ar: "خدمة", en: "Service", icon: "🔧" },
  { value: "employment", ar: "توظيف", en: "Employment", icon: "💼" },
  { value: "real_estate", ar: "عقاري", en: "Real Estate", icon: "🏠" },
  { value: "marketing", ar: "تسويق", en: "Marketing", icon: "📢" },
  { value: "general", ar: "عام", en: "General", icon: "📄" },
];

const DEFAULT_TERMS = [
  { ar: "يلتزم كل طرف بالوفاء بالتزاماته وفقاً لأحكام هذا العقد", en: "Each party shall fulfill its obligations under this agreement" },
  { ar: "يتم الدفع وفقاً للجدول الزمني المتفق عليه", en: "Payment shall be made according to the agreed schedule" },
  { ar: "يحتفظ كل طرف بحقه في إنهاء العقد بإشعار مسبق كتابياً", en: "Each party retains the right to terminate with written notice" },
  { ar: "يخضع هذا العقد للقانون اليمني", en: "This agreement is subject to Yemeni law" },
  { ar: "جميع النزاعات تُحل ودياً أولاً قبل اللجوء للقضاء", en: "All disputes shall be resolved amicably before litigation" },
  { ar: "يُظر هذا العقد ملزم electronically بالتوقيع الإلكتروني", en: "This contract is binding upon electronic signature" },
];

export function EContractsSystem({ language }: { language: Language }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignModal, setShowSignModal] = useState<Contract | null>(null);

  const [form, setForm] = useState({
    title: "", titleEn: "", type: "service" as Contract["type"],
    partyA: "", partyAPhone: "", partyB: "", partyBPhone: "",
    description: "", value: "", startDate: "", endDate: "", terms: DEFAULT_TERMS.map(t => t.ar)
  });

  const stats = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.status === "active").length,
    pending: contracts.filter(c => c.status === "pending_signatures").length,
    completed: contracts.filter(c => c.status === "completed").length,
    totalValue: contracts.filter(c => c.status === "active").reduce((s, c) => s + c.value, 0),
  }), [contracts]);

  const addContract = () => {
    if (!form.title || !form.partyA || !form.partyB) return;
    const newContract: Contract = {
      id: genId(), number: genNumber(), title: form.title, titleEn: form.titleEn || form.title,
      type: form.type, partyA: form.partyA, partyAPhone: form.partyAPhone,
      partyB: form.partyB, partyBPhone: form.partyBPhone, description: form.description,
      value: parseFloat(form.value) || 0, currency: "YER",
      startDate: form.startDate, endDate: form.endDate,
      status: "pending_signatures", terms: form.terms, attachments: [],
      createdBy: "admin", createdAt: new Date().toISOString()
    };
    setContracts([newContract, ...contracts]);
    setShowForm(false);
    setForm({ title: "", titleEn: "", type: "service", partyA: "", partyAPhone: "", partyB: "", partyBPhone: "", description: "", value: "", startDate: "", endDate: "", terms: DEFAULT_TERMS.map(t => t.ar) });
  };

  const signContract = (contractId: string, party: "A" | "B") => {
    setContracts(contracts.map(c => {
      if (c.id !== contractId) return c;
      const signed = party === "A" ? { signatureA: "electronically_signed" } : { signatureB: "electronically_signed" };
      const bothSigned = (party === "A" && c.signatureB) || (party === "B" && c.signatureA) || (c.signatureA && c.signatureB);
      return { ...c, ...signed, signedAt: new Date().toISOString(), status: bothSigned ? "active" : c.status };
    }));
    setShowSignModal(null);
  };

  const filtered = contracts.filter(c => {
    const matchSearch = !searchQuery || c.title.includes(searchQuery) || c.number.includes(searchQuery) || c.partyA.includes(searchQuery) || c.partyB.includes(searchQuery);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabels: Record<string, { ar: string; en: string; className: string }> = {
    draft: { ar: "مسودة", en: "Draft", className: "draft" },
    pending_signatures: { ar: "بانتظار التوقيع", en: "Pending", className: "sent" },
    active: { ar: "نشط", en: "Active", className: "paid" },
    completed: { ar: "مكتمل", en: "Completed", className: "posted" },
    terminated: { ar: "منهي", en: "Terminated", className: "overdue" },
    expired: { ar: "منتهي", en: "Expired", className: "reversed" },
  };

  return (
    <div className="accounting-system">
      <style>{`
        .econtract-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 16px; transition: all 0.2s; }
        .econtract-card:hover { border-color: #F3B71B; box-shadow: 0 4px 12px rgba(243,183,27,.1); }
        .econtract-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .econtract-number { font-family: monospace; font-size: 12px; color: #6B7280; }
        .econtract-title { font-size: 16px; font-weight: 700; margin: 4px 0; }
        .econtract-parties { display: flex; gap: 20px; font-size: 13px; color: #374151; margin: 8px 0; }
        .econtract-parties strong { color: #102A43; }
        .econtract-meta { display: flex; gap: 16px; font-size: 12px; color: #6B7280; margin-top: 12px; flex-wrap: wrap; }
        .econtract-meta span { display: flex; align-items: center; gap: 4px; }
        .signature-box { border: 2px dashed #D1D5DB; border-radius: 8px; padding: 16px; text-align: center; min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .signature-box.signed { border-color: #059669; background: #ECFDF5; }
        .contract-terms { background: #F8FAFC; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .contract-terms li { font-size: 13px; margin-bottom: 8px; line-height: 1.6; }
      `}</style>

      <div className="accounting-header">
        <h2><FileSignature size={24} /> {t(language, "التعاقد الإلكتروني", "Electronic Contracts")}</h2>
        <p>{t(language, "إنشاء وتوقيع وإدارة العقود إلكترونياً ب.binding ملزم", "Create, sign, and manage contracts electronically with binding force")}</p>
      </div>

      <div className="accounting-body">
        <div className="stats-grid">
          <div className="stat-card profit">
            <div className="stat-icon" style={{ background: "#2563EB", color: "white" }}><FileSignature size={18} /></div>
            <div className="stat-label">{t(language, "إجمالي العقود", "Total Contracts")}</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon" style={{ background: "#059669", color: "white" }}><CheckCircle2 size={18} /></div>
            <div className="stat-label">{t(language, "عقود نشطة", "Active")}</div>
            <div className="stat-value">{stats.active}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon" style={{ background: "#D97706", color: "white" }}><Clock size={18} /></div>
            <div className="stat-label">{t(language, "بانتظار التوقيع", "Pending")}</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card expense">
            <div className="stat-icon" style={{ background: "#7C3AED", color: "white" }}><Stamp size={18} /></div>
            <div className="stat-label">{t(language, "القيمة الإجمالية", "Total Value")}</div>
            <div className="stat-value">{stats.totalValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="filter-bar">
          <input placeholder={t(language, "بحث في العقود...", "Search contracts...")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">{t(language, "جميع الحالات", "All Status")}</option>
            {Object.entries(statusLabels).map(([key, val]) => <option key={key} value={key}>{language === "ar" ? val.ar : val.en}</option>)}
          </select>
          <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "عقد جديد", "New Contract")}</button>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
            <FileSignature size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>{t(language, "لا توجد عقود بعد", "No contracts yet")}</p>
          </div>
        )}

        {filtered.map(contract => (
          <div key={contract.id} className="econtract-card" onClick={() => setSelectedContract(selectedContract?.id === contract.id ? null : contract)} style={{ cursor: "pointer" }}>
            <div className="econtract-header">
              <div>
                <span className="econtract-number">{contract.number}</span>
                <div className="econtract-title">{language === "ar" ? contract.title : contract.titleEn}</div>
              </div>
              <span className={`status-badge ${statusLabels[contract.status]?.className || "draft"}`}>
                {language === "ar" ? statusLabels[contract.status]?.ar : statusLabels[contract.status]?.en}
              </span>
            </div>
            <div className="econtract-parties">
              <span><strong>{t(language, "الطرف أ", "Party A")}:</strong> {contract.partyA}</span>
              <span><strong>{t(language, "الطرف ب", "Party B")}:</strong> {contract.partyB}</span>
            </div>
            <div className="econtract-meta">
              <span>💰 {contract.value.toLocaleString()} {contract.currency}</span>
              <span>📅 {contract.startDate} — {contract.endDate}</span>
              <span>{CONTRACT_TYPES.find(c => c.value === contract.type)?.icon} {language === "ar" ? CONTRACT_TYPES.find(c => c.value === contract.type)?.ar : CONTRACT_TYPES.find(c => c.value === contract.type)?.en}</span>
            </div>

            {selectedContract?.id === contract.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: 13, marginBottom: 12 }}>{contract.description}</p>
                <div className="contract-terms">
                  <strong style={{ fontSize: 13 }}>{t(language, "شروط العقد:", "Contract Terms:")}</strong>
                  <ol>{contract.terms.map((term, i) => <li key={i}>{term}</li>)}</ol>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                  <div className={`signature-box ${contract.signatureA ? "signed" : ""}`}>
                    {contract.signatureA ? (<><CheckCircle2 size={24} color="#059669" /><span style={{ fontSize: 12, color: "#059669", marginTop: 8 }}>{t(language, "تم التوقيع", "Signed")}</span></>) : (<><Lock size={24} color="#D1D5DB" /><span style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{t(language, "بانتظار توقيع الطرف أ", "Awaiting Party A")}</span></>)}
                  </div>
                  <div className={`signature-box ${contract.signatureB ? "signed" : ""}`}>
                    {contract.signatureB ? (<><CheckCircle2 size={24} color="#059669" /><span style={{ fontSize: 12, color: "#059669", marginTop: 8 }}>{t(language, "تم التوقيع", "Signed")}</span></>) : (<><Lock size={24} color="#D1D5DB" /><span style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{t(language, "بانتظار توقيع الطرف ب", "Awaiting Party B")}</span></>)}</div>
                </div>
                {contract.status === "pending_signatures" && (
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    {!contract.signatureA && <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); setShowSignModal(contract); }}><FileSignature size={14} /> {t(language, "توقيع كطرف أ", "Sign as Party A")}</button>}
                    {!contract.signatureB && <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); setShowSignModal(contract); }}><FileSignature size={14} /> {t(language, "توقيع كطرف ب", "Sign as Party B")}</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>{t(language, "عقد جديد", "New Contract")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t(language, "نوع العقد", "Contract Type")}</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Contract["type"] })}>
                    {CONTRACT_TYPES.map(c => <option key={c.value} value={c.value}>{c.icon} {language === "ar" ? c.ar : c.en}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t(language, "قيمة العقد", "Contract Value")}</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "عنوان العقد (عربي)", "Contract Title (Arabic)")}</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "عنوان العقد (إنجليزي)", "Contract Title (English)")}</label>
                  <input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "الطرف أ", "Party A")}</label>
                  <input value={form.partyA} onChange={e => setForm({ ...form, partyA: e.target.value })} placeholder={t(language, "اسم الطرف الأول", "First party name")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "هاتف الطرف أ", "Party A Phone")}</label>
                  <input value={form.partyAPhone} onChange={e => setForm({ ...form, partyAPhone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "الطرف ب", "Party B")}</label>
                  <input value={form.partyB} onChange={e => setForm({ ...form, partyB: e.target.value })} placeholder={t(language, "اسم الطرف الثاني", "Second party name")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "هاتف الطرف ب", "Party B Phone")}</label>
                  <input value={form.partyBPhone} onChange={e => setForm({ ...form, partyBPhone: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "وصف العقد", "Description")}</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "تاريخ البداية", "Start Date")}</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "تاريخ النهاية", "End Date")}</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addContract}>{t(language, "إنشاء العقد", "Create Contract")}</button>
            </div>
          </div>
        </div>
      )}

      {showSignModal && (
        <div className="modal-overlay" onClick={() => setShowSignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3><FileSignature size={20} /> {t(language, "التوقيع الإلكتروني", "Electronic Signature")}</h3>
              <button className="action-btn" onClick={() => setShowSignModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <Shield size={48} color="#F3B71B" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 14, marginBottom: 16 }}>{t(language, "بالضغط على \"توقيع\" أنت توافق على جميع شروط هذا العقد وتصبح ملزمًا قانونياً", "By clicking \"Sign\" you agree to all terms and become legally bound")}</p>
              <div className="signature-box" style={{ marginBottom: 16 }}>
                <FileSignature size={32} color="#102A43" />
                <span style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>{t(language, "توقيعك الإلكتروني sẽ在这里", "Your electronic signature")}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowSignModal(null)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={() => { signContract(showSignModal.id, "A"); }}><Lock size={14} /> {t(language, "توقيع ملزم", "Sign & Bind")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
