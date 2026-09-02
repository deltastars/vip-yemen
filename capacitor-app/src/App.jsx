import { useEffect, useMemo, useState } from 'react'
import { BriefcaseBusiness, Building2, Check, ExternalLink, FileText, LoaderCircle, MapPin, MessageCircle, Pencil, Phone, Search, Settings, ShieldCheck, Store, Trash2, Users, X } from 'lucide-react'
import './App.css'

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

export default function App() {
  const [active, setActive] = useState('digital-marketing'); const [admin, setAdmin] = useState(false)
  return <div className="app-shell"><header className="site-header"><div className="brand"><div className="brand-mark"><img src="/brand-logo.png" alt="ViPservicesYemen" /></div><div><h1>vipyemen</h1><p>التوظيف والتسويق الإلكتروني والخدمات العامة</p></div></div><div className="header-actions"><a href="https://linktr.ee/vipservicesyemen" target="_blank" rel="noreferrer" className="outline-button">روابطنا</a><button className="outline-button" onClick={() => setAdmin(true)}><Settings size={17} /> لوحة الإدارة</button></div></header><main><section className="hero"><div><span className="eyebrow"><ShieldCheck size={15} /> منصة يمنية موثوقة</span><h2>خدمات وفرص وإعلانات<br /><em>في مكان واحد.</em></h2><p>منصة ViP Yemen لعرض المنتجات والخدمات والعقارات والوظائف والتواصل المباشر بسهولة.</p></div><div className="hero-card"><FileText size={28} /><strong>إعلاناتك محفوظة</strong><span>بتخزين مركزي قابل للتوسع</span></div></section><nav className="section-nav" aria-label="أقسام التطبيق">{sections.map(({ id, label, icon: Icon }) => <button className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}><Icon size={18} />{label}</button>)}</nav><Listings section={active} /><SocialLinks /></main><footer>© 2026 vipyemen — صنعاء، اليمن</footer>{admin && <AdminPanel onClose={() => setAdmin(false)} />}</div>
}
