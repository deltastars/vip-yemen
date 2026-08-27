// Style: مسارات الفرص — تخطيط تحريري غير متماثل، أزرق ليلي، أصفر شمسي، وتفاعلات سريعة.
import { useState } from "react";
import { Route, Switch, Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Send,
  Sparkles,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const socials = [
  { label: "فيسبوك", href: "https://www.facebook.com/ViPservicesYemen/", icon: Facebook },
  { label: "تويتر", href: "https://twitter.com/ViPservicesYeme?s=09", icon: Twitter },
  { label: "إنستغرام", href: "https://www.instagram.com/vipservicesyemen?r=nametag", icon: Instagram },
  { label: "لينكدإن", href: "https://www.linkedin.com/in/ali-aldahan-57b5a2231", icon: Linkedin },
  { label: "يوتيوب", href: "https://youtube.com/channel/UCJGfi4S63-Nm2rSXpBqzHtw", icon: Youtube },
  { label: "واتساب", href: "https://wa.me/qr/CF2G3HMH3SUFJ1", icon: MessageCircle },
];
const services = [
  { id: "marketing", number: "01", eyebrow: "اعرض. اطلب. اكتشف.", title: "التسويق الإلكتروني", text: "مساحة عملية لعرض المنتجات والخدمات والوصول إلى عملاء جدد داخل اليمن.", image: "/manus-storage/vipyemen-marketing_17aa09bd.jpg", icon: Globe2, accent: "أصفر الفرصة" },
  { id: "real-estate", number: "02", eyebrow: "موقع يفتح الاحتمالات", title: "التسويق العقاري", text: "اكتشف العقارات والفرص السكنية والتجارية مع معلومات واضحة وتواصل مباشر.", image: "/manus-storage/vipyemen-realestate_6ace7d4f.jpg", icon: Building2, accent: "أزرق الثقة" },
  { id: "jobs", number: "03", eyebrow: "الخطوة المهنية التالية", title: "التوظيف والفرص", text: "اربط مهاراتك بالفرصة المناسبة، أو انشر احتياجك للوصول إلى الكفاءات.", image: "/manus-storage/vipyemen-jobs_cbed08f1.jpg", icon: BriefcaseBusiness, accent: "مسار جديد" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["الخدمات", "#services"], ["لماذا ViP؟", "#why"], ["تواصل معنا", "#contact"]];
  return <header className="site-header">
    <div className="container nav-wrap">
      <a href="#top" className="brand" aria-label="ViP Yemen الصفحة الرئيسية"><img src="/manus-storage/vipyemen-official-icon.png" alt="" /><span>ViP <b>Yemen</b></span></a>
      <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="التنقل الرئيسي">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="https://linktr.ee/vipservicesyemen" target="_blank" rel="noreferrer">كل الروابط <ArrowUpLeft size={14} /></a>
      </nav>
      <a className="nav-cta" href="https://wa.me/qr/CF2G3HMH3SUFJ1" target="_blank" rel="noreferrer">ابدأ محادثة <ArrowLeft size={16} /></a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

function Hero() {
  return <section id="top" className="hero-section">
    <div className="hero-grid container">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> منصة يمنية للفرص والخدمات</div>
        <h1>خطوتك التالية<br /><em>تبدأ من هنا.</em></h1>
        <p className="hero-lead">ViP Yemen تجمع بين التسويق، العقار، والتوظيف في مساحة واحدة — بوضوح محلي وتواصل مباشر.</p>
        <div className="hero-actions"><a className="button button-primary" href="#services">استكشف الخدمات <ArrowLeft size={18} /></a><a className="text-link" href="#contact">تحدث معنا <ArrowUpLeft size={17} /></a></div>
        <div className="hero-proof"><div className="proof-avatars"><span>ع</span><span>م</span><span>س</span></div><div><strong>منصة قريبة منك</strong><small>صنعاء · اليمن</small></div></div>
      </div>
      <div className="hero-visual">
        <div className="hero-image-wrap"><img src="/manus-storage/vipyemen-developer-original_f2f370f1.jpg" alt="المهندس ومطور البرمجيات علي درهم الدحان في مكتبه" /><div className="image-shade" /></div>
        <div className="hero-note"><Sparkles size={18} /><span>فرصة اليوم</span><strong>تواصل مباشر<br />بدون تعقيد</strong></div>
        <div className="hero-stat"><strong>03</strong><span>مسارات<br />للخدمة</span></div>
        <div className="route-line route-one" /><div className="route-line route-two" />
      </div>
    </div>
    <div className="hero-marquee"><div className="container marquee-inner"><span>ViP Yemen</span><i /> <span>للتوظيف والتسويق الإلكتروني والخدمات العامة</span><i /><span>فرصتك أقرب</span><i /><span>ViP Yemen</span></div></div>
  </section>;
}

function Services() {
  return <section id="services" className="services-section section-pad"><div className="container">
    <div className="section-heading split-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> مساراتنا</div><h2>خدمة واضحة.<br /><span>نتيجة أقرب.</span></h2></div><p>ثلاثة مسارات مصممة لتجعل الوصول إلى الخدمة أو الفرصة أسهل، مع لغة بسيطة وتواصل حقيقي.</p></div>
    <div className="service-list">{services.map((service, index) => { const Icon = service.icon; return <article className={`service-card service-${index + 1}`} key={service.id}>
      <div className="service-meta"><span>{service.number}</span><span>{service.accent}</span></div><div className="service-copy"><Icon size={28} strokeWidth={1.5} /><div><div className="service-eyebrow">{service.eyebrow}</div><h3>{service.title}</h3><p>{service.text}</p><a className="circle-arrow" href={`#${service.id}`} aria-label={`استكشف ${service.title}`}><ArrowUpLeft size={20} /></a></div></div><div className="service-image"><img src={service.image} alt="" /></div>
    </article>; })}</div>
  </div></section>;
}

function Why() {
  const points = ["تواصل مباشر عبر القنوات التي تعرفها", "واجهة واضحة بدون خطوات زائدة", "خدمات قريبة من احتياجات السوق اليمني"];
  return <section id="why" className="why-section section-pad"><div className="container why-grid"><div className="why-label"><span className="vertical-label">لماذا ViP Yemen</span><div className="vertical-rule" /></div><div className="why-main"><div className="eyebrow light"><span className="eyebrow-dot" /> مصممة للواقع</div><h2>ليست مجرد منصة.<br /><em>إنها نقطة اتصال.</em></h2><p>لأن الخدمة الجيدة تبدأ من فهم المكان والناس، نبني ViP Yemen كمساحة عملية تجمع العرض بالطلب، والمهارة بالفرصة.</p><div className="point-list">{points.map((point, i) => <div className="point" key={point}><span>0{i + 1}</span><Check size={17} />{point}</div>)}</div></div><div className="why-side"><div className="side-mark"><img src="/manus-storage/vipyemen-official-icon.png" alt="" /></div><span>من صنعاء<br />إلى كل فرصة</span></div></div></section>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  return <section id="contact" className="contact-section section-pad"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow"><span className="eyebrow-dot" /> لنبدأ من احتياجك</div><h2>هل لديك فرصة<br /><span>تستحق أن تُرى؟</span></h2><p>أرسل لنا احتياجك أو تواصل مباشرة. نحن هنا لنقرّب المسافة بينك وبين الشخص المناسب.</p><div className="contact-details"><a href="mailto:ViPservicesYemen@gmail.com"><Mail size={18} /> ViPservicesYemen@gmail.com</a><a href="tel:+967773597404"><Phone size={18} /> 773 597 404</a><span><MapPin size={18} /> اليمن · صنعاء · حي شميلة</span></div></div><div className="contact-card">{sent ? <div className="sent-state"><Check size={34} /><h3>وصلت رسالتك.</h3><p>سنتواصل معك عبر القناة المناسبة قريبًا.</p><button className="button button-dark" onClick={() => setSent(false)}>إرسال رسالة أخرى</button></div> : <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}><div className="form-top"><span>رسالة سريعة</span><Send size={18} /></div><label>الاسم الكامل<input required placeholder="كيف نناديك؟" /></label><label>كيف يمكننا مساعدتك؟<Textarea required placeholder="اكتب احتياجك باختصار..." /></label><button type="submit" className="button button-primary full">إرسال الرسالة <ArrowLeft size={18} /></button></form>}</div></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><a className="brand brand-light" href="#top"><img src="/manus-storage/vipyemen-official-icon.png" alt="" /><span>ViP <b>Yemen</b></span></a><p>للتوظيف والتسويق الإلكتروني<br />والخدمات العامة.</p></div><div className="footer-links"><span>تواصل معنا</span><a href="mailto:ViPservicesYemen@gmail.com">ViPservicesYemen@gmail.com</a><a href="https://wa.me/qr/CF2G3HMH3SUFJ1" target="_blank" rel="noreferrer">واتساب مباشر</a></div><div className="footer-links"><span>روابط سريعة</span><a href="#services">الخدمات</a><a href="https://linktr.ee/vipservicesyemen" target="_blank" rel="noreferrer">كل القنوات</a></div><div className="footer-social"><span>نحن على</span><div>{socials.map(({label, href, icon: Icon}) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={17} /></a>)}</div></div></div><div className="container footer-bottom"><span>© 2026 ViP Yemen. جميع الحقوق محفوظة.</span><span className="developer-credit">المهندس ومطور البرمجيات: <strong>علي درهم الدحان</strong> <Sparkles size={13} /></span></div></footer>;
}

function Home() { return <><Header /><main><Hero /><Services /><Why /><Contact /></main><Footer /></>; }
function NotFound() { return <div className="not-found"><h1>الصفحة غير موجودة</h1><Link href="/">العودة للرئيسية</Link></div>; }
export default function App() { return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>; }
