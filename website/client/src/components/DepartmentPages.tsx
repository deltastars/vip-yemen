import { useState } from "react";
import {
  BriefcaseBusiness, Building2, Globe2, Code2, Send, Check,
  ArrowLeft, ShieldCheck, MessageCircle, Upload, Search, Tag,
  Star, Clock, Percent,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

type SubmissionCategory = "employment" | "realEstateOffer" | "realEstateRequest" | "productOffer" | "productRequest" | "software";

const readFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

function SuccessState({ onReset, message }: { onReset: () => void; message: string }) {
  return (
    <div className="sent-state">
      <Check size={34} />
      <h3>تم استلام طلبك بنجاح.</h3>
      <p>{message}</p>
      <div className="success-actions">
        <button className="button button-dark" onClick={onReset}>إرسال طلب آخر</button>
        <a className="button button-primary" href="https://wa.me/967711780999" target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> تواصل عبر واتساب
        </a>
      </div>
    </div>
  );
}

/* ─── Employment Section ─── */
export function EmploymentSection() {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const mutation = trpc.submissions.create.useMutation({ onSuccess: () => setSent(true) });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const attachments = await Promise.all(files.map(async (file) => ({
      name: file.name,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
      dataUrl: await readFile(file),
    })));
    mutation.mutate({
      category: "employment",
      title: String(form.get("title")),
      description: String(form.get("description")),
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      address: String(form.get("address") || "") || undefined,
      organizationName: String(form.get("organizationName") || "") || undefined,
      profession: String(form.get("profession") || "") || undefined,
      requirements: String(form.get("requirements") || "") || undefined,
      attachments,
    });
  };

  return (
    <section id="employment" className="department-section">
      <div className="container">
        <div className="dept-hero">
          <div className="dept-hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> <BriefcaseBusiness size={14} /> قسم التوظيف</div>
            <h2>اربط مهاراتك<br /><span>بالفرصة المناسبة.</span></h2>
            <p>سواء كنت تبحث عن وظيفة أو تبحث عن كفاءات لمؤسستك، وصل طلبك أولًا إلى إدارة المنصة للمراجعة والتدقيق قبل النشر.</p>
            <div className="privacy-note"><ShieldCheck size={19} /><span>يصل طلبك إلى الإدارة بشكل خاص وسري للمراجعة قبل الاعتماد.</span></div>
          </div>
          <div className="dept-hero-visual">
            <div className="dept-icon-large"><BriefcaseBusiness size={48} /></div>
          </div>
        </div>

        <div className="dept-content-grid">
          {/* Job Seeker Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <Search size={20} />
              <h3>باحث عن توظيف</h3>
              <p>سجّل بياناتك ومهاراتك للحصول على الفرصة المناسبة</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="طلبك قيد المراجعة من الإدارة. سنتواصل معك عبر واتساب بعد الاعتماد." />
            ) : (
              <form onSubmit={submit}>
                <label>الاسم الكامل<input name="fullName" required placeholder="الاسم كما في الهوية" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /><small>يفضل رقم مرتبط بواتساب</small></label>
                <label>العنوان / المدينة<input name="address" placeholder="مثال: صنعاء، حي شميلة" /></label>
                <label>المهنة المطلوبة<input name="title" required placeholder="مثال: محاسب، مهندس، مطور" /></label>
                <label>الوصف الوظيفي<textarea name="description" required minLength={10} placeholder="اذكر خبراتك ومهاراتك والتخصصات..." /></label>
                <label>الشهادات والمرفقات <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))} /><small>صور المؤqualات والسير الذاتية (حتى 5 ملفات)</small></label>
                <label>المؤهل / الشهادة<input name="profession" placeholder="مثال: بكالوريوس تجارة" /></label>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال للإدارة للمراجعة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>

          {/* Employer Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <BriefcaseBusiness size={20} />
              <h3>صاحب منشأة / صاحب عمل</h3>
              <p>انشر احتياجك للتوظيف للوصول إلى الكفاءات المناسبة</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="طلبك قيد المراجعة من الإدارة. سيتم التواصل معك بعد اعتماد النشر." />
            ) : (
              <form onSubmit={submit}>
                <label>الاسم الكامل<input name="fullName" required placeholder="اسم مسؤول التوظيف" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /></label>
                <label>اسم المنشأة / الشركة<input name="organizationName" required placeholder="اسم الجهة المعنية بالتوظيف" /></label>
                <label>المسمى الوظيفي المطلوب<input name="title" required placeholder="مثال: محاسب رئيسي" /></label>
                <label>الوظيفة والوصف<textarea name="description" required minLength={10} placeholder="وصف المهام والمسؤوليات..." /></label>
                <label>الشروط والمتطلبات<textarea name="requirements" placeholder="الشهادات المطلوبة، الخبرة، اللغة..." /></label>
                <label>المرفقات <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))} /><small>صور الإعلان الوظيفي أو ملفات توضيحية</small></label>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال للإدارة للمراجعة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Real Estate Section ─── */
export function RealEstateSection() {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const mutation = trpc.submissions.create.useMutation({ onSuccess: () => setSent(true) });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category")) as SubmissionCategory;
    const attachments = await Promise.all(files.map(async (file) => ({
      name: file.name,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
      dataUrl: await readFile(file),
    })));
    mutation.mutate({
      category,
      title: String(form.get("title")),
      description: String(form.get("description")),
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      address: String(form.get("address") || "") || undefined,
      propertyType: String(form.get("propertyType") || "") || undefined,
      price: String(form.get("price") || "") || undefined,
      attachments,
    });
  };

  return (
    <section id="real-estate" className="department-section">
      <div className="container">
        <div className="dept-hero">
          <div className="dept-hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> <Building2 size={14} /> قسم التسويق العقاري</div>
            <h2>اعرض عقارك<br /><span>واكتشف الفرص.</span></h2>
            <p>سواء كنت مالكًا لعقار أو بحاجة لشراء، سجّل بياناتك وتفاصيل العقار. يصل طلبك أولًا للإدارة بشكل خاص وسري، ثم يُنشر بعد الاعتماد.</p>
            <a className="button button-primary" href="https://wa.me/967711780999" target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> واتساب الأعمال: 00967711780999
            </a>
          </div>
          <div className="dept-hero-visual">
            <div className="dept-icon-large"><Building2 size={48} /></div>
          </div>
        </div>

        <div className="dept-content-grid">
          {/* Property Owner Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <Building2 size={20} />
              <h3>مالك العقار</h3>
              <p>سجّل بياناتك وتفاصيل العقار مع الصور</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="تم استلام بيانات العقار. سنتواصل معك بعد الاعتماد والمراجعة." />
            ) : (
              <form onSubmit={submit}>
                <input type="hidden" name="category" value="realEstateOffer" />
                <label>الاسم الكامل<input name="fullName" required placeholder="اسم مالك العقار" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /><small>يفضل رقم واتساب أعمال</small></label>
                <label>نوع العقار<select name="propertyType">
                  <option value="أرض">أرض</option>
                  <option value="منزل">منزل</option>
                  <option value="عمارة">عمارة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="شقة">شقة</option>
                  <option value="محل تجاري">محل تجاري</option>
                  <option value="أخرى">أخرى</option>
                </select></label>
                <label>عنوان العقار<input name="title" required placeholder="مثال: فيلا للبيع في حي شميلة" /></label>
                <label>الموقع / العنوان<input name="address" placeholder="المدينة والحي والتوضيحات" /></label>
                <label>السعر<input name="price" placeholder="مثال: 50,000,000 ريال يمني" /></label>
                <label>تفاصيل العقار<textarea name="description" required minLength={10} placeholder="المساحة، عدد الغرف، الحالة، التجهيزات..." /></label>
                <label>صور العقار <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))} /><small>صور الأراضي والمنزل أو العمارة (حتى 5 ملفات)</small></label>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال للإدارة للمراجعة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>

          {/* Buyer Request Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <Search size={20} />
              <h3>مشتري العقار</h3>
              <p>سجّل طلبك ومواصفات العقار المطلوب</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="طلبك قيد المراجعة من الإدارة. سيتم نشره بعد الاعتماد وعرضه على واجهة المنصة." />
            ) : (
              <form onSubmit={submit}>
                <input type="hidden" name="category" value="realEstateRequest" />
                <label>الاسم الكامل<input name="fullName" required placeholder="الاسم" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /></label>
                <label>نوع العقار المطلوب<select name="propertyType">
                  <option value="أرض">أرض</option>
                  <option value="منزل">منزل</option>
                  <option value="عمارة">عمارة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="شقة">شقة</option>
                  <option value="أخرى">أخرى</option>
                </select></label>
                <label>الميزانية<input name="price" placeholder="مثال: 30,000,000 ريال يمني" /></label>
                <label>المدينة المطلوبة<input name="address" placeholder="مثال: صنعاء" /></label>
                <label>العنوان المختصر<input name="title" required placeholder="مثال: أرض للبيع في صنعاء" /></label>
                <label>تفاصيل الطلب<textarea name="description" required minLength={10} placeholder="المواصفات المطلوبة بالتفصيل..." /></label>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال للإدارة للمراجعة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── E-Marketing Section ─── */
export function EMarketingSection() {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const mutation = trpc.submissions.create.useMutation({ onSuccess: () => setSent(true) });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category")) as SubmissionCategory;
    const attachments = await Promise.all(files.map(async (file) => ({
      name: file.name,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
      dataUrl: await readFile(file),
    })));
    mutation.mutate({
      category,
      title: String(form.get("title")),
      description: String(form.get("description")),
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      address: String(form.get("address") || "") || undefined,
      productType: String(form.get("productType") || "") || undefined,
      price: String(form.get("price") || "") || undefined,
      attachments,
    });
  };

  return (
    <section id="e-marketing" className="department-section">
      <div className="container">
        <div className="dept-hero">
          <div className="dept-hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> <Globe2 size={14} /> قسم التسويق الإلكتروني</div>
            <h2>اعرض منتجك<br /><span>واكتشف المنتجات.</span></h2>
            <p>سوق إلكتروني شامل: عرض المنتجات والسلع والأجهزة بأي نوع، أو البحث عن ما تحتاجه. يتم التحقق من رقم الهاتف الحقيقي وربطه مع واتساب المنصة.</p>
            <a className="button button-primary" href="https://wa.me/967711780999" target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> واتساب المنصة: 00967711780999
            </a>
          </div>
          <div className="dept-hero-visual">
            <div className="dept-icon-large"><Globe2 size={48} /></div>
          </div>
        </div>

        <div className="dept-content-grid">
          {/* Seller Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <Upload size={20} />
              <h3>صاحب السلعة / المنتج</h3>
              <p>سجّل عرضك ونوع المنتج والمواصفات والصور</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="عرضك قيد المراجعة. سيتم نشره بعد اعتماد الإدارة." />
            ) : (
              <form onSubmit={submit}>
                <input type="hidden" name="category" value="productOffer" />
                <label>الاسم الكامل<input name="fullName" required placeholder="اسم صاحب المنتج" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /><small>يتم التحقق من صحة الرقم وربطه مع واتساب المنصة</small></label>
                <label>نوع المنتج / السلعة<input name="productType" required placeholder="مثال: جهاز هاتف، سيارة، ألة..." /></label>
                <label>عنوان العرض<input name="title" required placeholder="مثال: آيفون 15 برو للبيع" /></label>
                <label>السعر<input name="price" placeholder="مثال: 500,000 ريال يمني" /></label>
                <label>الموقع<input name="address" placeholder="المدينة" /></label>
                <label>التفاصيل والمواصفات<textarea name="description" required minLength={10} placeholder="الحالة، المواصفات، سبب البيع..." /></label>
                <label>صور المنتج <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))} /><small>صور حقيقية للمنتج (حتى 5 ملفات)</small></label>
                <div className="privacy-note"><ShieldCheck size={19} /><span>يتم التحقق من رقم الهاتف الحقيقي وربطه بواتساب المنصة قبل النشر.</span></div>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال العرض للإدارة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>

          {/* Buyer Request Form */}
          <div className="dept-form-card">
            <div className="form-card-header">
              <Search size={20} />
              <h3>الباحث عن منتج</h3>
              <p>سجّل طلبك والمنتج الذي تبحث عنه</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="طلبك قيد المراجعة من الإدارة. سيتم نشره بعد الاعتماد." />
            ) : (
              <form onSubmit={submit}>
                <input type="hidden" name="category" value="productRequest" />
                <label>الاسم الكامل<input name="fullName" required placeholder="اسم الباحث" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /><small>يتم التحقق من صحة الرقم وربطه مع واتساب المنصة</small></label>
                <label>نوع المنتج المطلوب<input name="productType" required placeholder="مثال: جهاز لابتوب، سيارة..." /></label>
                <label>الميزانية<input name="price" placeholder="الميزانية المتوقعة" /></label>
                <label>المدينة<input name="address" placeholder="مثال: عدن" /></label>
                <label>عنوان الطلب<input name="title" required placeholder="مثال: جهاز آيباد للشراء" /></label>
                <label>تفاصيل الطلب<textarea name="description" required minLength={10} placeholder="المواصفات المطلوبة بالتفصيل..." /></label>
                <div className="privacy-note"><ShieldCheck size={19} /><span>يتم التحقق من رقم الهاتف الحقيقي وربطه بواتساب المنصة قبل النشر.</span></div>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال طلبك للإدارة"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Software Section (Enhanced) ─── */
export function SoftwareDeptSection() {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const mutation = trpc.submissions.create.useMutation({ onSuccess: () => setSent(true) });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const attachments = await Promise.all(files.map(async (file) => ({
      name: file.name,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
      dataUrl: await readFile(file),
    })));
    mutation.mutate({
      category: "software",
      title: String(form.get("title")),
      description: String(form.get("description")),
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      address: String(form.get("address") || "") || undefined,
      price: String(form.get("price") || "") || undefined,
      attachments,
    });
  };

  return (
    <section id="software-dept" className="department-section">
      <div className="container">
        <div className="dept-hero dept-hero-dark">
          <div className="dept-hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> <Code2 size={14} /> قسم البرمجيات وتطوير التطبيقات</div>
            <h2>نبني الفكرة.<br /><span>ونمنحها حياة.</span></h2>
            <p>حلول رقمية متكاملة: تطبيقات الهواتف، منصات الويب، أنظمة إدارة البيانات، والتكاملات السحابية. اطلب مشروعك وسنتواصل معك.</p>
          </div>
          <div className="dept-hero-visual">
            <div className="dept-icon-large dept-icon-dark"><Code2 size={48} /></div>
          </div>
        </div>

        <div className="dept-single-form">
          <div className="dept-form-card">
            <div className="form-card-header">
              <Code2 size={20} />
              <h3>طلب مشروع برمجي</h3>
              <p>اكتب تفاصيل مشروعك وسنتواصل معك لتقديم العرض المناسب</p>
            </div>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} message="تم استلام طلبك. سنتواصل معك عبر واتساب لمناقشة التفاصيل." />
            ) : (
              <form onSubmit={submit}>
                <label>الاسم الكامل<input name="fullName" required placeholder="اسمك أو اسم الشركة" /></label>
                <label>رقم الهاتف<input name="phone" required inputMode="tel" pattern="^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$" placeholder="00967711780999" /></label>
                <label>نوع المشروع<select name="title" defaultValue="">
                  <option value="" disabled>اختر نوع المشروع</option>
                  <option value="تطبيق هواتف">تطبيق هواتف (Android / iOS)</option>
                  <option value="موقع ويب">موقع ويب أو منصة</option>
                  <option value="لوحة تحكم">لوحة تحكم إدارية</option>
                  <option value="نظام إدارة">نظام إدارة بيانات</option>
                  <option value="تكامل API">تكامل API أو خدمات سحابية</option>
                  <option value="أخرى">أخرى</option>
                </select></label>
                <label>تفاصيل المشروع<textarea name="description" required minLength={10} placeholder="اكتب تفاصيل المشروع: الهدف، الميزات المطلوبة، الجمهور المستهدف..." /></label>
                <label>الميزانية التقريبية<input name="price" placeholder="اختياري" /></label>
                <label>المرفقات <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))} /><small>ملفات توضيحية أو مخططات (حتى 5 ملفات)</small></label>
                <button disabled={mutation.isPending} type="submit" className="button button-primary full">
                  {mutation.isPending ? "جارٍ الإرسال..." : "إرسال الطلب"} <Send size={16} />
                </button>
                {mutation.error && <p className="form-error">تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Offers Section ─── */
export function OffersSection() {
  const { data: offers = [] } = trpc.offers.list.useQuery(undefined, { refetchInterval: 30000 });

  if (!offers.length) return null;

  return (
    <section id="offers" className="department-section offers-section">
      <div className="container">
        <div className="offers-header">
          <div className="eyebrow"><span className="eyebrow-dot" /> <Tag size={14} /> العروض والتخفيضات</div>
          <h2>عروض حصرية <span>من المنصة.</span></h2>
          <p>عروض وتخفيضات يتم نشرها من قبل الإدارة بشكل احترافي ودقيق. تابع أحدث العروض والمميزات.</p>
        </div>

        <div className="offers-grid">
          {offers.map((offer: any) => (
            <article className={`offer-card ${offer.isFeatured ? "offer-featured" : ""}`} key={offer.id}>
              {offer.isFeatured ? <div className="offer-badge"><Star size={12} /> عرض مميز</div> : null}
              {offer.imageUrl && (
                <div className="offer-image">
                  <img src={offer.imageUrl} alt={offer.title} loading="lazy" />
                  {offer.discountPercent ? <div className="offer-discount"><Percent size={14} /> {offer.discountPercent}%</div> : null}
                </div>
              )}
              <div className="offer-content">
                <span className="offer-category">{offer.category || "عرض عام"}</span>
                <h3>{offer.title}</h3>
                <p>{offer.description?.slice(0, 150)}{offer.description?.length > 150 ? "..." : ""}</p>
                <div className="offer-pricing">
                  {offer.originalPrice && <span className="offer-original-price">{offer.originalPrice}</span>}
                  {offer.offerPrice && <span className="offer-current-price">{offer.offerPrice}</span>}
                </div>
                <div className="offer-footer">
                  {offer.startsAt && (
                    <span className="offer-timer">
                      <Clock size={12} />
                      {new Date(offer.startsAt).toLocaleDateString("ar-YE")} — {offer.endsAt ? new Date(offer.endsAt).toLocaleDateString("ar-YE") : "مفتوح"}
                    </span>
                  )}
                  {offer.contactPhone && (
                    <a className="offer-contact" href={`https://wa.me/${offer.contactPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                      <MessageCircle size={14} /> تواصل
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Public Listings Page ─── */
type PublicSubmission = {
  id: number;
  category: SubmissionCategory;
  status: string;
  title: string;
  description: string;
  propertyType: string | null;
  productType: string | null;
  price: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

const deptConfig = {
  employment: { label: "التوظيف", icon: BriefcaseBusiness, color: "#F3B71B" },
  realEstateOffer: { label: "عرض عقار", icon: Building2, color: "#102A43" },
  realEstateRequest: { label: "طلب عقار", icon: Search, color: "#2563eb" },
  productOffer: { label: "عرض منتج", icon: Globe2, color: "#E76F51" },
  productRequest: { label: "طلب منتج", icon: Search, color: "#7c3aed" },
  software: { label: "برمجيات", icon: Code2, color: "#059669" },
};

const categoryLabelsPublic: Record<SubmissionCategory, string> = {
  employment: "وظيفة",
  realEstateOffer: "عرض عقار",
  realEstateRequest: "طلب عقار",
  productOffer: "عرض منتج",
  productRequest: "طلب منتج",
  software: "مشروع برمجي",
};

export function DepartmentListings() {
  const [activeCategory, setActiveCategory] = useState<SubmissionCategory | "all">("all");
  const { data: listings = [] } = trpc.submissions.publicList.useQuery(
    activeCategory === "all" ? undefined : { category: activeCategory },
    { refetchInterval: 30000 }
  );

  return (
    <section className="listings-section" id="listings">
      <div className="container">
        <div className="listings-header">
          <div className="eyebrow"><span className="eyebrow-dot" /> إعلانات المنصة</div>
          <h2>العروض والطلبات <span>المنشور.</span></h2>
          <p>العروض والطلبات التي تمت الموافقة عليها من الإدارة ونشرت على المنصة.</p>
        </div>

        <div className="listings-filter">
          <button className={`filter-btn ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>الكل</button>
          <button className={`filter-btn ${activeCategory === "employment" ? "active" : ""}`} onClick={() => setActiveCategory("employment")}>
            <BriefcaseBusiness size={14} /> التوظيف
          </button>
          <button className={`filter-btn ${activeCategory === "realEstateOffer" ? "active" : ""}`} onClick={() => setActiveCategory("realEstateOffer")}>
            <Building2 size={14} /> عروض العقارات
          </button>
          <button className={`filter-btn ${activeCategory === "realEstateRequest" ? "active" : ""}`} onClick={() => setActiveCategory("realEstateRequest")}>
            <Search size={14} /> طلبات العقارات
          </button>
          <button className={`filter-btn ${activeCategory === "productOffer" ? "active" : ""}`} onClick={() => setActiveCategory("productOffer")}>
            <Globe2 size={14} /> عروض المنتجات
          </button>
          <button className={`filter-btn ${activeCategory === "productRequest" ? "active" : ""}`} onClick={() => setActiveCategory("productRequest")}>
            <Search size={14} /> طلبات المنتجات
          </button>
        </div>

        <div className="listings-grid">
          {listings.map((item: PublicSubmission) => {
            const config = deptConfig[item.category];
            const Icon = config.icon;
            return (
              <article className="listing-card" key={item.id}>
                <div className="listing-card-top" style={{ borderLeftColor: config.color }}>
                  <span className="listing-category" style={{ color: config.color }}>
                    <Icon size={14} /> {categoryLabelsPublic[item.category]}
                  </span>
                  {item.productType && <span className="listing-type">{item.productType}</span>}
                  {item.propertyType && <span className="listing-type">{item.propertyType}</span>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description?.slice(0, 180)}...</p>
                {item.price && <div className="listing-price">{item.price}</div>}
                <div className="listing-footer">
                  <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString("ar-YE")}</span>
                </div>
              </article>
            );
          })}
          {!listings.length && (
            <div className="empty-state" style={{ gridColumn: "1/-1" }}>
              <Globe2 size={24} />
              <p>لا توجد عروض أو طلبات منشورة حاليًا في هذا القسم.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
