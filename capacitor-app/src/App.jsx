import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, Building2, Check, ExternalLink, FileText, LoaderCircle, MapPin, MessageCircle, Pencil, Phone, Search, Settings, ShieldCheck, Store, Trash2, Users, X, Globe2, MessageSquare, Send, ChevronRight } from 'lucide-react'
import './App.css'

// Smart redirect: unknown admin/departments paths never show 'غير موجودة'
function NavigationNotFound({ replace }) {
  const p = window.location.pathname || '';
  if (p.startsWith('/admin') || p.startsWith('/dashboard')) {
    return (
      <div className="not-found soft">
        <ShieldCheck size={28} />
        <h2>لوحة التحكم</h2>
        <p>الصفحة غير متاحة مباشرة. يُرجى الدخول أولاً ثم اختيار القسم من القائمة.</p>
        <button className="button button-primary" onClick={() => replace('/admin')}>الدخول إلى لوحة التحكم</button>
      </div>
    );
  }
  if (p.startsWith('/departments')) {
    return (
      <div className="not-found soft">
        <Globe2 size={28} />
        <h2>القسم المطلوب</h2>
        <p>انتقل إلى قائمة الأقسام أسفله لمتابعة التصفح.</p>
        <a href="#listings" className="button button-primary">أقسام المنصة</a>
      </div>
    );
  }
  return (
    <div className="not-found soft">
      <Globe2 size={28} />
      <h2>الصفحة غير متاحة</h2>
      <p>الصفحة غير موجودة حاليًا.</p>
      <button className="button button-primary" onClick={() => replace('/')}>العودة للرئيسية</button>
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const SOCIAL_LINKS = [
  ['الموقع الرسمي', 'https://vipservicesyemen.business.site/', ExternalLink],
  ['الموقع على الخريطة', 'https://maps.app.goo.gl/or3xgsMgJWH4odGj7', MapPin],
  ['تويتر / X', 'https://twitter.com/ViPservicesYeme?s=09', ExternalLink],
  ['فيسبوك', 'https://www.facebook.com/ViPservicesYemen/', ExternalLink],
  ['مجموعة فيسبوك', 'https://facebook.com/groups/346010664332427/?ref=share', Users],
  ['واتساب 1', 'https://wa.me/qr/CF2G3HMH3SUFJ1', MessageCircle],
  ['واتساب 2', 'https://wa.me/message/SNHH2JPXL7TZE1', MessageCircle],
  ['لينكدإن', 'https://www.linkedin.com/in/ali-aldahan-57b5a2231', ExternalLink],
  ['يوتيوب', 'https://youtube.com/channel/UCJGfi4S63-Nm2rSXpBqzHtw', ExternalLink],
  ['إنستغرام', 'https://www.instagram.com/vipservicesyemen?r=nametag', ExternalLink],
  ['تيليجرام', 'https://t.me/VIPservices2', MessageCircle],
  ['تيك توك', 'https://www.tiktok.com/@vipservicesyemen1', ExternalLink],
  ['Threads', 'https://www.threads.net/@vipservicesyemen', ExternalLink],
  ['كل الروابط', 'https://linktr.ee/vipservicesyemen', ExternalLink],
]

const sections = [
  { id: 'digital-marketing', label: 'التسويق الإلكتروني', icon: Store },
  { id: 'real-estate', label: 'التسويق العقاري', icon: Building2 },
  { id: 'jobs', label: 'التوظيف', icon: BriefcaseBusiness },
]

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'تعذر الاتصال بالخادم')
  return body
}

function SocialLinks() {
  return <section className="social-section"><div className="section-heading"><h2>تواصل معنا</h2><p>ViP Yemen للتوظيف والتسويق الإلكتروني والخدمات العامة</p></div><div className="social-grid">{SOCIAL_LINKS.map(([name, url, Icon]) => <a className="social-link" key={url} href={url} target="_blank" rel="noreferrer"><Icon size={18} /><span>{name}</span><ExternalLink size={14} /></a>)}</div><div className="contact-card"><strong>العنوان:</strong> اليمن، صنعاء، حي شميلة <span>•</span><strong>الهاتف:</strong> <a href="tel:+967773597404">00967 773 597 404</a> <span>•</span><strong>البريد:</strong> <a href="mailto:ViPservicesYemen@gmail.com">ViPservicesYemen@gmail.com</a></div></section>
}

function Listings({ section }) {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('loading')
  useEffect(() => { let alive = true; request(`/listings?section=${section}`).then(data => { if (alive) { setItems(data.data || data.listings || []); setStatus('ready') } }).catch(() => alive && setStatus('error')); return () => { alive = false } }, [section])
  const filtered = useMemo(() => items.filter(item => `${item.title || ''} ${item.description || ''}`.toLowerCase().includes(query.toLowerCase())), [items, query])
  return <div className="content-card"><div className="toolbar"><div><h2>{sections.find(s => s.id === section)?.label}</h2><p>ابحث في الإعلانات والخدمات المنشورة</p></div><div className="search-box"><Search size={18} /><input aria-label="البحث" placeholder="بحث..." value={query} onChange={e => setQuery(e.target.value)} /></div></div>{status === 'loading' && <div className="state"><LoaderCircle className="spin" /> جاري تحميل البيانات...</div>}{status === 'error' && <div className="state error">تعذر تحميل البيانات. تحقق من اتصال الخادم ثم أعد المحاولة.</div>}{status === 'ready' && <div className="listing-grid">{filtered.map(item => <article className="listing" key={item.id}><div className="listing-top"><span className="pill">{item.listing_type === 'request' ? 'طلب' : 'عرض'}</span></div><h3>{item.title || 'إعلان بدون عنوان'}</h3><p>{item.description || 'لا يوجد وصف.'}</p><div className="listing-meta"><span><MapPin size={15} /> {item.location || 'اليمن'}</span><span><Phone size={15} /> {item.userPhone || item.phone || 'للتواصل'}</span></div></article>)}{filtered.length === 0 && <div className="state">لا توجد إعلانات في هذا القسم حاليًا.</div>}</div>}</div>
}

function AdminPanel({ onClose }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState(''); const [editing, setEditing] = useState(null)
  const load = () => { setLoading(true); request('/listings?status=pending').then(d => setItems(d.data || d.listings || [])).catch(e => setMessage(e.message)).finally(() => setLoading(false)) }
  useEffect(load, [])
  const save = async () => { if (!editing) return; try { await request(`/listings/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) }); setMessage('تم حفظ الإعلان بنجاح'); setEditing(null); load() } catch (e) { setMessage(e.message) } }
  const remove = async id => { if (!window.confirm('هل تريد حذف الإعلان؟')) return; try { await request(`/listings/${id}`, { method: 'DELETE' }); load() } catch (e) { setMessage(e.message) } }
  return <div className="admin-overlay"><div className="admin-panel"><div className="admin-head"><div><span className="eyebrow"><ShieldCheck size={15} /> لوحة الإدارة</span><h2>إدارة الإعلانات</h2></div><button className="icon-button" onClick={onClose} aria-label="إغلاق"><X /></button></div>{message && <div className="notice">{message}</div>}{loading ? <div className="state"><LoaderCircle className="spin" /> جاري التحميل...</div> : <div className="admin-list">{items.map(item => <div className="admin-item" key={item.id}><div><strong>{item.title}</strong><p>{item.description}</p></div><div className="admin-actions"><button onClick={() => setEditing(item)}><Pencil size={16} /> تعديل</button><button className="danger" onClick={() => remove(item.id)}><Trash2 size={16} /> حذف</button></div></div>)}{items.length === 0 && <div className="state">لا توجد إعلانات معلقة.</div>}</div>}{editing && <div className="edit-box"><h3>تعديل الإعلان</h3><input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="العنوان" /><textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="الوصف" /><div className="admin-actions"><button onClick={save}><Check size={16} /> حفظ</button><button onClick={() => setEditing(null)}>إلغاء</button></div></div>}</div></div>
}

const vipKnowledge = [
  { q: "ما هي أقسام المنصة؟", a: "تضم المنصة أربعة أقسام رئيسية: التوظيف والفرص، التسويق العقاري، التسويق الإلكتروني، وقسم البرمجيات وتطوير التطبيقات، إضافة إلى العروض الترويجية والإعلانات." },
  { q: "كيف أقدم طلبًا؟", a: "انتقل إلى نموذج «أرسل طلبك» أو اختر القسم المناسب، أدخل بياناتك وارفع الصور والفيديوهات القصيرة ثم أرسل. يصل الطلب إلى إدارة المنصة للمراجعة." },
  { q: "متى يُنشر طلبي؟", a: "تُراجع الإدارة كل طلب أولًا للتدقيق والتحقق من البيانات، ثم تُنشره من لوحة التحكم في القسم المخصص فيعرض تلقائيًا على واجهة المنصة." },
  { q: "هل بياناتي سرية؟", a: "نعم. بيانات التواصل والطلبات تصل إلى الإدارة بشكل خاص وسري، ولا تُنشر أي معلومة دون موافقة مسبقة." },
  { q: "كيف أتواصل مع المنصة؟", a: "عبر واتساب: 00967711780999، أو البريد: ViPservicesYemen@gmail.com، أو أزرار التواصل أسفل الصفحة." },
  { q: "هل يمكن رفع صور وفيديوهات؟", a: "نعم، النموذج يدعم حتى 6 مرفقات: صور (JPG/PNG/WebP) ومستندات PDF حتى 8MB، وفيديوهات قصيرة (MP4/WebM) حتى 25MB." },
  { q: "كيف أعرف الإصدارات الجديدة؟", a: "تظهر إشعارات التحديثات داخل جرس الإشعارات، ويمكنك التحديث من رابط المتجر عند توفره." },
  { q: "هل توفرون تطوير البرمجيات؟", a: "نعم، نطوّر تطبيقات Android وiOS ومنصات ويب ولوحات تحكم وأنظمة متكاملة بأحدث التقنيات." },
  { q: "ما وسائل الدفع المتاحة؟", a: "الحسابات المالية الرسمية أسفل الصفحة: بنك الكريمي، محفظة جيب، ومحفظة جوالي — جميعها مرتبطة برقم 773597404." },
  { q: "من مطور المنصة؟", a: "المهندس علي درهم الدحان — مؤسس ومدير منصة ViP Yemen، صنعاء، اليمن." },
];

function VipChatbot() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('menu');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const results = vipKnowledge.filter(item => item.q.includes(query.trim()) || item.a.includes(query.trim()));
  return (
    <div className="vip-chatbot">
      <button className="vip-chatbot-btn" onClick={() => { setOpen(o => !o); setView('menu'); setQuery(''); setActive(null); }} aria-label="مساعد VIP الذكي — افتحه عند الحاجة">
        <MessageSquare size={20} />
        <span className="vip-chatbot-label"> VIP»</span>
      </button>
      {open && (
        <div className="vip-chatbot-panel" role="dialog" aria-label="مساعد VIP الذكي">
          <div className="vip-chatbot-header">
            <div className="vip-chatbot-header-inner">
              <MessageSquare size={18} />
              <span>مساعد VIP الذكي — بحث عن أي موضوع</span>
            </div>
            <button onClick={() => { setOpen(false); setView('menu'); setActive(null); }} aria-label="إغلاق المساعد"><X size={18} /></button>
          </div>
          <div className="vip-chatbot-body">
            <div className="vip-chatbot-msg bot"><MessageSquare size={14} /><span>أنا مساعد المنصة. اكتب أي سؤال أو اختر من القائمة:</span></div>
            <div className="vip-chatbot-search">
              <Search size={13} />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setView('menu'); setActive(null); }} placeholder="ابحث: أقسام، طلبات، تواصل، أسعار..." autoFocus onKeyDown={(e) => e.key === 'Escape' && setOpen(false)} />
            </div>
            {view === 'answer' && active ? (
              <div className="vip-chatbot-answer">
                <button className="vip-chatbot-back" onClick={() => { setView('menu'); setActive(null); }}><ChevronRight size={13} /> رجوع للأسئلة</button>
                <strong>{active.q}</strong>
                <p>{active.a}</p>
                <div className="vip-chatbot-followup">
                  <a href="#submit" onClick={() => setOpen(false)} className="vip-chatbot-option"><Send size={13} /> أرسل طلبًا الآن</a>
                  <a href="https://wa.me/967711780999" target="_blank" rel="noreferrer" className="vip-chatbot-option"><MessageCircle size={13} /> واتساب المنصة</a>
                </div>
              </div>
            ) : (
              <div className="vip-chatbot-options">
                {(query.trim() ? results : vipKnowledge).slice(0, 8).map(item => (
                  <button key={item.q} className="vip-chatbot-option" onClick={() => { setActive(item); setView('answer'); }}>
                    <span>{item.q}</span>
                    <ChevronRight size={13} />
                  </button>
                ))}
              </div>
            )}
            <div className="vip-chatbot-quick">
              <a href="https://wa.me/967711780999" target="_blank" rel="noreferrer" className="vip-chatbot-option"><MessageCircle size={13} /> واتساب المنصة 00967711780999</a>
              <a href="#submit" onClick={() => setOpen(false)} className="vip-chatbot-option"><Send size={13} /> أرسل طلب</a>
              <a href="#contact" onClick={() => setOpen(false)} className="vip-chatbot-option"><MessageCircle size={13} /> تواصل</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('digital-marketing');
  const [admin, setAdmin] = useState(false);
  const [notFoundPath, setNotFoundPath] = useState(null);
  // Detect unknown routes and show smart redirect instead of plain 'غير موجودة'
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && !sections.some(s => s.id === path.slice(1)) && !path.startsWith('/admin') && !path.startsWith('/departments') && path !== '/contact' && path !== '/submit') {
      setNotFoundPath(path);
    } else {
      setNotFoundPath(null);
    }
  }, []);
  return (
    <div className="app-shell">
      <HeaderWithWhatsApp onOpenAdmin={() => setAdmin(true)} />
      <main>
        {notFoundPath ? (
          <NavigationNotFound replace={(to) => { window.history.replaceState(null, '', to); setNotFoundPath(null); }} />
        ) : (
          <>
            <section className="hero"><div><span className="eyebrow"><ShieldCheck size={15} /> منصة يمنية موثوقة</span><h2>خدمات وفرص وإعلانات<br /><em>في مكان واحد.</em></h2><p>منصة ViP Yemen لعرض المنتجات والخدمات والعقارات والوظائف والتواصل المباشر بسهولة.</p></div><div className="hero-card"><FileText size={28} /><strong>إعلاناتك محفوظة</strong><span>بتخزين مركزي قابل للتوسع</span></div></section>
            <nav className="section-nav" aria-label="أقسام التطبيق">{sections.map(({ id, label, icon: Icon }) => <button className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}><Icon size={18} />{label}</button>)}</nav>
            <Listings section={active} />
            <SocialLinks />
          </>
        )}
      </main>
      <FooterWithWhatsApp />
      <VipChatbot />
      {admin && <AdminPanel onClose={() => setAdmin(false)} />}
    </div>
  );
}

function HeaderWithWhatsApp({ onOpenAdmin }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark"><img src="/brand-logo.png" alt="ViPservicesYemen" /></div>
        <div><h1>vipyemen</h1><p>التوظيف والتسويق الإلكتروني والخدمات العامة</p></div>
      </div>
      <div className="header-actions">
        <a href="https://linktr.ee/vipservicesyemen" target="_blank" rel="noreferrer" className="outline-button">روابطنا</a>
        <button className="outline-button" onClick={onOpenAdmin}><Settings size={17} /> لوحة الإدارة</button>
      </div>
    </header>
  );
}

function FooterWithWhatsApp() {
  return (
    <footer className="site-footer">
      <div style={{ padding: '18px 28px', background: 'rgba(0,0,0,.4)', textAlign: 'center' }}>
        <a href="https://wa.me/967711780999" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#25D366', color: '#fff', borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          <MessageCircle size={18} /> تواصل عبر واتساب: 00967711780999
        </a>
        <p style={{ margin: '12px 0 0', color: '#8e887c', fontSize: 12 }}>© 2026 vipyemen — صنعاء، اليمن</p>
      </div>
    </footer>
  );
}
