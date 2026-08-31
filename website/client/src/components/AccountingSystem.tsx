import { useState, useMemo } from "react";
import { 
  BookOpen, Calculator, FileText, Search, Filter, Plus, 
  Download, Eye, Edit3, Trash2, CheckCircle2, Clock, 
  AlertTriangle,  ArrowUpRight, ArrowDownRight, Scale,
  Receipt, Landmark, CreditCard, TrendingUp, TrendingDown,
  Calendar, Printer, ChevronDown, ChevronRight, Hash
} from "lucide-react";

type Language = "ar" | "en";

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debits: { account: string; amount: number }[];
  credits: { account: string; amount: number }[];
  status: "draft" | "posted" | "reversed";
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

interface Account {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  balance: number;
  parent?: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  clientName: string;
  clientPhone: string;
  items: { description: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  paymentMethod: "cash" | "transfer" | "mobile";
  dueDate: string;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  receipt?: string;
  approved: boolean;
}

const ACCOUNTS: Account[] = [
  { id: "1", code: "1000", name: "الصندوق", nameEn: "Cash", type: "asset", balance: 0 },
  { id: "2", code: "1100", name: "البنك", nameEn: "Bank", type: "asset", balance: 0 },
  { id: "3", code: "1200", name: "العملاء", nameEn: "Accounts Receivable", type: "asset", balance: 0 },
  { id: "4", code: "2000", name: "الموردون", nameEn: "Accounts Payable", type: "liability", balance: 0 },
  { id: "5", code: "2100", name: "الضرائب المستحقة", nameEn: "Tax Payable", type: "liability", balance: 0 },
  { id: "6", code: "3000", name: "رأس المال", nameEn: "Capital", type: "equity", balance: 0 },
  { id: "7", code: "4000", name: "إيرادات الخدمات", nameEn: "Service Revenue", type: "revenue", balance: 0 },
  { id: "8", code: "4100", name: "إيرادات التسويق", nameEn: "Marketing Revenue", type: "revenue", balance: 0 },
  { id: "9", code: "5000", name: "مصاريف إدارية", nameEn: "Admin Expenses", type: "expense", balance: 0 },
  { id: "10", code: "5100", name: "رواتب", nameEn: "Salaries", type: "expense", balance: 0 },
  { id: "11", code: "5200", name: "إيجار", nameEn: "Rent", type: "expense", balance: 0 },
  { id: "12", code: "5300", name: "مرافق", nameEn: "Utilities", type: "expense", balance: 0 },
];

const EXPENSE_CATEGORIES = [
  { ar: "رواتب", en: "Salaries", icon: "💰" },
  { ar: "إيجار", en: "Rent", icon: "🏢" },
  { ar: "مرافق", en: "Utilities", icon: "⚡" },
  { ar: "تسويق", en: "Marketing", icon: "📢" },
  { ar: "نقل", en: "Transport", icon: "🚗" },
  { ar: "قرطاسية", en: "Stationery", icon: "📝" },
  { ar: "صيانة", en: "Maintenance", icon: "🔧" },
  { ar: "أخرى", en: "Other", icon: "📦" },
];

const t = (lang: Language, ar: string, en: string) => lang === "ar" ? ar : en;

function generateId() { return `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
function generateInvoiceNumber() { return `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`; }

export function AccountingSystem({ language }: { language: Language }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "journal" | "invoices" | "expenses" | "reports" | "accounts">("dashboard");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  // Computed stats
  const stats = useMemo(() => {
    const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.total, 0);
    const totalExpenses = expenses.filter(e => e.approved).reduce((sum, e) => sum + e.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status === "sent" || i.status === "overdue");
    const netProfit = totalRevenue - totalExpenses;
    const overdueCount = invoices.filter(i => i.status === "overdue").length;
    return { totalRevenue, totalExpenses, netProfit, pendingInvoices, overdueCount, invoiceCount: invoices.length, expenseCount: expenses.length };
  }, [invoices, expenses]);

  const tabs = [
    { id: "dashboard" as const, label: t(language, "لوحة المعلومات", "Dashboard"), icon: Scale },
    { id: "journal" as const, label: t(language, "دفتر الأستاذ", "Journal"), icon: BookOpen },
    { id: "invoices" as const, label: t(language, "الفواتير", "Invoices"), icon: FileText },
    { id: "expenses" as const, label: t(language, "المصروفات", "Expenses"), icon: CreditCard },
    { id: "reports" as const, label: t(language, "التقارير", "Reports"), icon: Calculator },
    { id: "accounts" as const, label: t(language, "دليل الحسابات", "Chart of Accounts"), icon: Landmark },
  ];

  return (
    <div className="accounting-system">
      <style>{`
        .accounting-system { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; }
        .accounting-header { padding: 24px; background: linear-gradient(135deg, #102A43, #1A3A5C); color: white; }
        .accounting-header h2 { font-size: 22px; margin: 0 0 4px; display: flex; align-items: center; gap: 10px; }
        .accounting-header p { margin: 0; color: rgba(255,255,255,.7); font-size: 13px; }
        .accounting-tabs { display: flex; gap: 0; border-bottom: 2px solid #E5E7EB; overflow-x: auto; background: #F8FAFC; }
        .accounting-tab { display: flex; align-items: center; gap: 6px; padding: 14px 18px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #6B7280; white-space: nowrap; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
        .accounting-tab:hover { color: #102A43; background: rgba(0,0,0,.02); }
        .accounting-tab.active { color: #F3B71B; border-bottom-color: #F3B71B; background: white; }
        .accounting-tab svg { width: 16px; height: 16px; }
        .accounting-body { padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; }
        .stat-card.revenue { background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-color: #6EE7B7; }
        .stat-card.expense { background: linear-gradient(135deg, #FEF2F2, #FEE2E2); border-color: #FCA5A5; }
        .stat-card.profit { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-color: #93C5FD; }
        .stat-card.pending { background: linear-gradient(135deg, #FFFBEB, #FEF3C7); border-color: #FCD34D; }
        .stat-card .stat-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
        .stat-card .stat-value { font-size: 24px; font-weight: 800; color: #102A43; }
        .stat-card .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .table-wrapper { overflow-x: auto; }
        .acct-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .acct-table th { text-align: right; padding: 12px; background: #F8FAFC; color: #6B7280; font-weight: 600; border-bottom: 2px solid #E5E7EB; white-space: nowrap; }
        .acct-table td { padding: 12px; border-bottom: 1px solid #F3F4F6; }
        .acct-table tr:hover td { background: #F9FAFB; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-badge.paid { background: #D1FAE5; color: #065F46; }
        .status-badge.sent { background: #DBEAFE; color: #1E40AF; }
        .status-badge.overdue { background: #FEE2E2; color: #991B1B; }
        .status-badge.draft { background: #F3F4F6; color: #6B7280; }
        .status-badge.posted { background: #D1FAE5; color: #065F46; }
        .status-badge.reversed { background: #FEE2E2; color: #991B1B; }
        .action-btn { padding: 6px 12px; border: 1px solid #E5E7EB; border-radius: 6px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s; }
        .action-btn:hover { background: #F3F4F6; border-color: #D1D5DB; }
        .action-btn.primary { background: #F3B71B; color: #102A43; border-color: #F3B71B; font-weight: 600; }
        .action-btn.primary:hover { background: #D4A017; }
        .filter-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
        .filter-bar input, .filter-bar select { padding: 10px 14px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 13px; background: white; }
        .filter-bar input { flex: 1; min-width: 200px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 600; color: #374151; }
        .form-group input, .form-group select, .form-group textarea { padding: 10px 14px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 13px; }
        .form-group textarea { min-height: 80px; resize: vertical; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: white; border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 18px; }
        .modal-body { padding: 24px; }
        .modal-footer { padding: 16px 24px; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 12px; }
        .amount-positive { color: #059669; font-weight: 600; }
        .amount-negative { color: #DC2626; font-weight: 600; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: 1fr; }
          .accounting-tabs { gap: 0; }
          .accounting-tab { padding: 12px 14px; font-size: 12px; }
        }
      `}</style>

      <div className="accounting-header">
        <h2><BookOpen size={24} /> {t(language, "النظام المحاسبي المتكامل", "Integrated Accounting System")}</h2>
        <p>{t(language, "دفتر الأستاذ — القيود — الفواتير — المصروفات — التقارير", "Ledger — Entries — Invoices — Expenses — Reports")}</p>
      </div>

      <div className="accounting-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`accounting-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="accounting-body">
        {activeTab === "dashboard" && <DashboardTab language={language} stats={stats} invoices={invoices} expenses={expenses} />}
        {activeTab === "journal" && <JournalTab language={language} entries={journalEntries} setEntries={setJournalEntries} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === "invoices" && <InvoiceTab language={language} invoices={invoices} setInvoices={setInvoices} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === "expenses" && <ExpenseTab language={language} expenses={expenses} setExpenses={setExpenses} />}
        {activeTab === "reports" && <ReportsTab language={language} stats={stats} invoices={invoices} expenses={expenses} />}
        {activeTab === "accounts" && <AccountsTab language={language} accounts={ACCOUNTS} />}
      </div>
    </div>
  );
}

function DashboardTab({ language, stats, invoices, expenses }: { language: Language; stats: any; invoices: Invoice[]; expenses: Expense[] }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon" style={{ background: "#059669", color: "white" }}><TrendingUp size={18} /></div>
          <div className="stat-label">{t(language, "إجمالي الإيرادات", "Total Revenue")}</div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString()} {t(language, "ر.ي", "YER")}</div>
        </div>
        <div className="stat-card expense">
          <div className="stat-icon" style={{ background: "#DC2626", color: "white" }}><TrendingDown size={18} /></div>
          <div className="stat-label">{t(language, "إجمالي المصروفات", "Total Expenses")}</div>
          <div className="stat-value">{stats.totalExpenses.toLocaleString()} {t(language, "ر.ي", "YER")}</div>
        </div>
        <div className="stat-card profit">
          <div className="stat-icon" style={{ background: "#2563EB", color: "white" }}><Calculator size={18} /></div>
          <div className="stat-label">{t(language, "صافي الربح", "Net Profit")}</div>
          <div className="stat-value" style={{ color: stats.netProfit >= 0 ? "#059669" : "#DC2626" }}>{stats.netProfit.toLocaleString()} {t(language, "ر.ي", "YER")}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon" style={{ background: "#D97706", color: "white" }}><Clock size={18} /></div>
          <div className="stat-label">{t(language, "فواتير معلقة", "Pending Invoices")}</div>
          <div className="stat-value">{stats.pendingInvoices.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", background: "#F8FAFC", fontWeight: 700, fontSize: 14, borderBottom: "1px solid #E5E7EB" }}>
            {t(language, "آخر الفواتير", "Recent Invoices")}
          </div>
          <div style={{ padding: 16 }}>
            {invoices.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>{t(language, "لا توجد فواتير بعد", "No invoices yet")}</p>}
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.number}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{inv.clientName}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.total.toLocaleString()} {t(language, "ر.ي", "YER")}</div>
                  <span className={`status-badge ${inv.status}`}>{t(language, inv.status === "paid" ? "مدفوعة" : inv.status === "sent" ? "مرسلة" : inv.status === "overdue" ? "متأخرة" : "مسودة", inv.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", background: "#F8FAFC", fontWeight: 700, fontSize: 14, borderBottom: "1px solid #E5E7EB" }}>
            {t(language, "آخر المصروفات", "Recent Expenses")}
          </div>
          <div style={{ padding: 16 }}>
            {expenses.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>{t(language, "لا توجد مصروفات بعد", "No expenses yet")}</p>}
            {expenses.slice(0, 5).map(exp => (
              <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{exp.description}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{exp.category}</div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#DC2626" }}>-{exp.amount.toLocaleString()} {t(language, "ر.ي", "YER")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalTab({ language, entries, setEntries, searchQuery, setSearchQuery }: { language: Language; entries: JournalEntry[]; setEntries: (e: JournalEntry[]) => void; searchQuery: string; setSearchQuery: (s: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", date: new Date().toISOString().slice(0, 10), debitAccount: "", creditAccount: "", amount: "" });

  const addEntry = () => {
    if (!form.description || !form.debitAccount || !form.creditAccount || !form.amount) return;
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) return;
    const newEntry: JournalEntry = {
      id: generateId(), date: form.date, reference: `JE-${entries.length + 1}`,
      description: form.description,
      debits: [{ account: form.debitAccount, amount }],
      credits: [{ account: form.creditAccount, amount }],
      status: "posted", attachments: [], createdBy: "admin", createdAt: new Date().toISOString()
    };
    setEntries([newEntry, ...entries]);
    setForm({ description: "", date: new Date().toISOString().slice(0, 10), debitAccount: "", creditAccount: "", amount: "" });
    setShowForm(false);
  };

  const filtered = entries.filter(e => !searchQuery || e.description.includes(searchQuery) || e.reference.includes(searchQuery));

  return (
    <div>
      <div className="filter-bar">
        <input placeholder={t(language, "بحث في القيود...", "Search entries...")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "قيد جديد", "New Entry")}</button>
      </div>

      <div className="table-wrapper">
        <table className="acct-table">
          <thead>
            <tr>
              <th>{t(language, "التاريخ", "Date")}</th>
              <th>{t(language, "المرجع", "Ref")}</th>
              <th>{t(language, "البيان", "Description")}</th>
              <th>{t(language, "الحسابات المدينة", "Debits")}</th>
              <th>{t(language, "الحسابات الدائنة", "Credits")}</th>
              <th>{t(language, "الحالة", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>{t(language, "لا توجد قيود بعد", "No entries yet")}</td></tr>
            )}
            {filtered.map(entry => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{entry.reference}</span></td>
                <td>{entry.description}</td>
                <td>{entry.debits.map((d, i) => <div key={i} className="amount-negative">{d.account}: {d.amount.toLocaleString()}</div>)}</td>
                <td>{entry.credits.map((c, i) => <div key={i} className="amount-positive">{c.account}: {c.amount.toLocaleString()}</div>)}</td>
                <td><span className={`status-badge ${entry.status}`}>{t(language, entry.status === "posted" ? "مرحل" : entry.status === "draft" ? "مسودة" : "معكوس", entry.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t(language, "قيد يومي جديد", "New Journal Entry")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t(language, "التاريخ", "Date")}</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "المبلغ", "Amount")}</label>
                  <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "البيان", "Description")}</label>
                  <textarea placeholder={t(language, "وصف القيد...", "Entry description...")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "الحساب المدين", "Debit Account")}</label>
                  <select value={form.debitAccount} onChange={e => setForm({ ...form, debitAccount: e.target.value })}>
                    <option value="">{t(language, "اختر الحساب", "Select account")}</option>
                    {ACCOUNTS.map(a => <option key={a.id} value={a.code}>{a.code} - {language === "ar" ? a.name : a.nameEn}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t(language, "الحساب الدائن", "Credit Account")}</label>
                  <select value={form.creditAccount} onChange={e => setForm({ ...form, creditAccount: e.target.value })}>
                    <option value="">{t(language, "اختر الحساب", "Select account")}</option>
                    {ACCOUNTS.map(a => <option key={a.id} value={a.code}>{a.code} - {language === "ar" ? a.name : a.nameEn}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addEntry}>{t(language, "حفظ القيد", "Save Entry")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceTab({ language, invoices, setInvoices, searchQuery, setSearchQuery }: { language: Language; invoices: Invoice[]; setInvoices: (i: Invoice[]) => void; searchQuery: string; setSearchQuery: (s: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", clientPhone: "", description: "", quantity: "1", price: "", paymentMethod: "cash" as const });

  const addItem = () => {
    if (!form.clientName || !form.description || !form.price) return;
    const qty = parseInt(form.quantity) || 1;
    const price = parseFloat(form.price) || 0;
    const total = qty * price;
    const newInvoice: Invoice = {
      id: generateId(), number: generateInvoiceNumber(), date: new Date().toISOString().slice(0, 10),
      clientName: form.clientName, clientPhone: form.clientPhone,
      items: [{ description: form.description, quantity: qty, price, total }],
      subtotal: total, tax: 0, total, status: "draft", paymentMethod: form.paymentMethod,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
    };
    setInvoices([newInvoice, ...invoices]);
    setForm({ clientName: "", clientPhone: "", description: "", quantity: "1", price: "", paymentMethod: "cash" });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: Invoice["status"]) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
  };

  const filtered = invoices.filter(i => !searchQuery || i.clientName.includes(searchQuery) || i.number.includes(searchQuery));

  return (
    <div>
      <div className="filter-bar">
        <input placeholder={t(language, "بحث في الفواتير...", "Search invoices...")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "فاتورة جديدة", "New Invoice")}</button>
      </div>

      <div className="table-wrapper">
        <table className="acct-table">
          <thead>
            <tr>
              <th>{t(language, "رقم الفاتورة", "Invoice #")}</th>
              <th>{t(language, "التاريخ", "Date")}</th>
              <th>{t(language, "العميل", "Client")}</th>
              <th>{t(language, "المبلغ", "Amount")}</th>
              <th>{t(language, "الحالة", "Status")}</th>
              <th>{t(language, "إجراءات", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>{t(language, "لا توجد فواتير بعد", "No invoices yet")}</td></tr>
            )}
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{inv.number}</span></td>
                <td>{inv.date}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{inv.clientName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{inv.clientPhone}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{inv.total.toLocaleString()} {t(language, "ر.ي", "YER")}</td>
                <td><span className={`status-badge ${inv.status}`}>{t(language, inv.status === "paid" ? "مدفوعة" : inv.status === "sent" ? "مرسلة" : inv.status === "overdue" ? "متأخرة" : inv.status === "cancelled" ? "ملغاة" : "مسودة", inv.status)}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {inv.status === "draft" && <button className="action-btn" onClick={() => updateStatus(inv.id, "sent")}>{t(language, "إرسال", "Send")}</button>}
                    {inv.status === "sent" && <button className="action-btn" onClick={() => updateStatus(inv.id, "paid")}>{t(language, "دفع", "Pay")}</button>}
                    {inv.status === "sent" && <button className="action-btn" onClick={() => updateStatus(inv.id, "overdue")}>{t(language, "متأخرة", "Overdue")}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t(language, "فاتورة جديدة", "New Invoice")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t(language, "اسم العميل", "Client Name")}</label>
                  <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder={t(language, "اسم العميل", "Client name")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "رقم الهاتف", "Phone")}</label>
                  <input value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} placeholder="00967..." />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "وصف الخدمة", "Service Description")}</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t(language, "وصف الخدمة...", "Service description...")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "الكمية", "Quantity")}</label>
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t(language, "السعر", "Price")}</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>{t(language, "طريقة الدفع", "Payment Method")}</label>
                  <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value as any })}>
                    <option value="cash">{t(language, "نقدي", "Cash")}</option>
                    <option value="transfer">{t(language, "تحويل بنكي", "Bank Transfer")}</option>
                    <option value="mobile">{t(language, "محفظة إلكترونية", "Mobile Wallet")}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addItem}>{t(language, "إنشاء الفاتورة", "Create Invoice")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseTab({ language, expenses, setExpenses }: { language: Language; expenses: Expense[]; setExpenses: (e: Expense[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", description: "", amount: "", paymentMethod: "cash" });

  const addExpense = () => {
    if (!form.category || !form.description || !form.amount) return;
    const newExpense: Expense = {
      id: generateId(), date: new Date().toISOString().slice(0, 10),
      category: form.category, description: form.description,
      amount: parseFloat(form.amount) || 0, paymentMethod: form.paymentMethod, approved: true
    };
    setExpenses([newExpense, ...expenses]);
    setForm({ category: "", description: "", amount: "", paymentMethod: "cash" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="filter-bar">
        <button className="action-btn primary" onClick={() => setShowForm(true)}><Plus size={14} /> {t(language, "مصروف جديد", "New Expense")}</button>
      </div>

      <div className="table-wrapper">
        <table className="acct-table">
          <thead>
            <tr>
              <th>{t(language, "التاريخ", "Date")}</th>
              <th>{t(language, "الفئة", "Category")}</th>
              <th>{t(language, "البيان", "Description")}</th>
              <th>{t(language, "المبلغ", "Amount")}</th>
              <th>{t(language, "طريقة الدفع", "Payment")}</th>
              <th>{t(language, "الحالة", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>{t(language, "لا توجد مصروفات بعد", "No expenses yet")}</td></tr>
            )}
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td className="amount-negative">-{exp.amount.toLocaleString()} {t(language, "ر.ي", "YER")}</td>
                <td>{t(language, exp.paymentMethod === "cash" ? "نقدي" : exp.paymentMethod === "transfer" ? "تحويل" : "جوال", exp.paymentMethod)}</td>
                <td><span className={`status-badge ${exp.approved ? "paid" : "draft"}`}>{t(language, exp.approved ? "معتمد" : "قيد المراجعة", exp.approved ? "approved" : "pending")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t(language, "مصروف جديد", "New Expense")}</h3>
              <button className="action-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t(language, "الفئة", "Category")}</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">{t(language, "اختر الفئة", "Select category")}</option>
                    {EXPENSE_CATEGORIES.map(c => <option key={c.en} value={language === "ar" ? c.ar : c.en}>{c.icon} {language === "ar" ? c.ar : c.en}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t(language, "المبلغ", "Amount")}</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>{t(language, "البيان", "Description")}</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t(language, "وصف المصروف...", "Expense description...")} />
                </div>
                <div className="form-group">
                  <label>{t(language, "طريقة الدفع", "Payment Method")}</label>
                  <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="cash">{t(language, "نقدي", "Cash")}</option>
                    <option value="transfer">{t(language, "تحويل بنكي", "Bank Transfer")}</option>
                    <option value="mobile">{t(language, "محفظة إلكترونية", "Mobile Wallet")}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowForm(false)}>{t(language, "إلغاء", "Cancel")}</button>
              <button className="action-btn primary" onClick={addExpense}>{t(language, "حفظ المصروف", "Save Expense")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsTab({ language, stats, invoices, expenses }: { language: Language; stats: any; invoices: Invoice[]; expenses: Expense[] }) {
  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    invoices.filter(i => i.status === "paid").forEach(i => {
      const month = i.date.slice(0, 7);
      months[month] = (months[month] || 0) + i.total;
    });
    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
  }, [invoices]);

  const expensesByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.filter(e => e.approved).forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.amount;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return (
    <div>
      <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>{t(language, "التقارير المالية", "Financial Reports")}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14 }}>{t(language, "الإيرادات الشهرية", "Monthly Revenue")}</h4>
          {revenueByMonth.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13 }}>{t(language, "لا توجد بيانات بعد", "No data yet")}</p>}
          {revenueByMonth.map(([month, amount]) => (
            <div key={month} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 13 }}>{month}</span>
              <span className="amount-positive">{amount.toLocaleString()} {t(language, "ر.ي", "YER")}</span>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14 }}>{t(language, "المصروفات حسب الفئة", "Expenses by Category")}</h4>
          {expensesByCategory.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13 }}>{t(language, "لا توجد بيانات بعد", "No data yet")}</p>}
          {expensesByCategory.map(([cat, amount]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 13 }}>{cat}</span>
              <span className="amount-negative">-{amount.toLocaleString()} {t(language, "ر.ي", "YER")}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 14 }}>{t(language, "ملخص مالي شامل", "Financial Summary")}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{t(language, "إجمالي الإيرادات", "Total Revenue")}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{t(language, "إجمالي المصروفات", "Total Expenses")}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#DC2626" }}>{stats.totalExpenses.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{t(language, "صافي الربح", "Net Profit")}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: stats.netProfit >= 0 ? "#059669" : "#DC2626" }}>{stats.netProfit.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{t(language, "نسبة الربح", "Profit Margin")}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>{stats.totalRevenue > 0 ? Math.round((stats.netProfit / stats.totalRevenue) * 100) : 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountsTab({ language, accounts }: { language: Language; accounts: Account[] }) {
  const grouped = useMemo(() => {
    const groups: Record<string, Account[]> = {};
    accounts.forEach(a => {
      if (!groups[a.type]) groups[a.type] = [];
      groups[a.type].push(a);
    });
    return groups;
  }, [accounts]);

  const typeLabels: Record<string, { ar: string; en: string }> = {
    asset: { ar: "الأصول", en: "Assets" },
    liability: { ar: "الخصوم", en: "Liabilities" },
    equity: { ar: "حقوق الملكية", en: "Equity" },
    revenue: { ar: "الإيرادات", en: "Revenue" },
    expense: { ar: "المصروفات", en: "Expenses" },
  };

  return (
    <div>
      <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>{t(language, "دليل الحسابات", "Chart of Accounts")}</h3>
      {Object.entries(grouped).map(([type, accs]) => (
        <div key={type} style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 14, color: "#F3B71B", marginBottom: 12 }}>{language === "ar" ? typeLabels[type]?.ar : typeLabels[type]?.en}</h4>
          <div className="table-wrapper">
            <table className="acct-table">
              <thead>
                <tr>
                  <th>{t(language, "الكود", "Code")}</th>
                  <th>{t(language, "اسم الحساب", "Account Name")}</th>
                  <th>{t(language, "النوع", "Type")}</th>
                  <th>{t(language, "الرصيد", "Balance")}</th>
                </tr>
              </thead>
              <tbody>
                {accs.map(a => (
                  <tr key={a.id}>
                    <td><span style={{ fontFamily: "monospace", background: "#F3F4F6", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{a.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{language === "ar" ? a.name : a.nameEn}</td>
                    <td><span style={{ fontSize: 12, color: "#6B7280" }}>{language === "ar" ? typeLabels[a.type]?.ar : typeLabels[a.type]?.en}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.balance.toLocaleString()} {t(language, "ر.ي", "YER")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
