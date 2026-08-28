// =============================================================================
// ViP Yemen - Comprehensive Translation System
// =============================================================================

export type Language = "ar" | "en";

// Common translations used across all components
export const translations = {
  // Navigation
  nav: {
    ar: {
      home: "الصفحة الرئيسية",
      services: "الخدمات",
      software: "البرمجيات",
      submit: "أرسل طلبك",
      why: "لماذا ViP؟",
      contact: "تواصل معنا",
      allLinks: "كل الروابط",
      startChat: "ابدأ محادثة",
      switchLang: "English",
      admin: "الإدارة",
      departments: "الأقسام",
      offers: "العروض",
      listings: "الإعلانات",
    },
    en: {
      home: "Home",
      services: "Services",
      software: "Software",
      submit: "Submit your request",
      why: "Why ViP?",
      contact: "Contact us",
      allLinks: "All links",
      startChat: "Start a chat",
      switchLang: "العربية",
      admin: "Admin",
      departments: "Departments",
      offers: "Offers",
      listings: "Listings",
    },
  },
  // Hero section
  hero: {
    ar: {
      eyebrow: "منصة يمنية للفرص والخدمات",
      title1: "خطوتك التالية",
      title2: "تبدأ من هنا.",
      lead: "ViP Yemen تجمع بين التسويق، العقار، والتوظيف في مساحة واحدة — بوضوح محلي وتواصل مباشر.",
      cta: "استxcf486f75 الخدمات",
      ctaAlt: "أرسل طلبًا",
      proof: "منصة قريبة منك",
      location: "صنعاء · اليمن",
      opportunity: "فرصة اليوم",
      directContact: "تواصل مباشر",
      directContactSub: "بدون تعقيد",
      paths: "مسارات",
      pathsFor: "للخدمة",
    },
    en: {
      eyebrow: "Yemeni platform for opportunities and services",
      title1: "Your next step",
      title2: "starts here.",
      lead: "ViP Yemen brings marketing, real estate, and recruitment together in one clear space with direct local contact.",
      cta: "Explore services",
      ctaAlt: "Submit a request",
      proof: "A platform close to you",
      location: "Sana'a · Yemen",
      opportunity: "Today's opportunity",
      directContact: "Direct contact",
      directContactSub: "without the hassle",
      paths: "service",
      pathsFor: "paths",
    },
  },
  // Services section
  services: {
    ar: {
      eyebrow: "مساراتنا",
      title1: "خدمة واضحة.",
      title2: "نتيجة أقرب.",
      description: "ثلاثة مسارات مصممة لتجعل الوصول إلى الخدمة أو الفرصة أسهل، مع لغة بسيطة وتواصل حقيقي.",
      marketing: {
        eyebrow: "اعرض. اطلب. اكتشف.",
        title: "التسويق الإلكتروني",
        text: "مساحة عملية لعرض المنتجات والخدمات والوصول إلى عملاء جدد داخل اليمن.",
        accent: "أصفر الفرصة",
      },
      realEstate: {
        eyebrow: "موقع يفتح الاحتمالات",
        title: "التسويق العقاري",
        text: "اكتشف العقارات والفرص السكنية والتجارية مع معلومات واضحة وتواصل مباشر.",
        accent: "أزرق الثقة",
      },
      jobs: {
        eyebrow: "الخطوة المهنية التالية",
        title: "التوظيف والفرص",
        text: "اربط مهاراتك بالفرصة المناسبة، أو انشر احتياجك للوصول إلى الكفاءات.",
        accent: "مسار جديد",
      },
    },
    en: {
      eyebrow: "Our paths",
      title1: "Clear service.",
      title2: "Closer results.",
      description: "Three paths designed to make reaching a service or opportunity easier, with simple language and real contact.",
      marketing: {
        eyebrow: "Show. Request. Discover.",
        title: "Digital marketing",
        text: "A practical space to showcase products and services and reach new customers in Yemen.",
        accent: "Opportunity yellow",
      },
      realEstate: {
        eyebrow: "A place that opens possibilities",
        title: "Real estate marketing",
        text: "Discover residential and commercial opportunities with clear information and direct contact.",
        accent: "Trust blue",
      },
      jobs: {
        eyebrow: "Your next career step",
        title: "Recruitment and opportunities",
        text: "Connect your skills with the right opportunity or reach qualified talent for your needs.",
        accent: "A new path",
      },
    },
  },
  // Software section
  software: {
    ar: {
      eyebrow: "المختبر التقني",
      title1: "نبني الفكرة.",
      title2: "ونمنحها حياة.",
      description: "حلول رقمية عملية تبدأ من احتياجك: تطبيقات هواتف، منصات ويب، أنظمة إدارة، وتجارب آمنة قابلة للتوسع.",
      mobile: {
        title: "تطبيقات الهواتف",
        text: "تصميم وتطوير تجارب متجاوبة لـ Android وiOS مع واجهات عربية واضحة، بنية قابلة للتحديث، وتجهيز ملفات المتاجر.",
      },
      web: {
        title: "الويب والواجهات",
        text: "منصات سريعة ومتجاوبة، صفحات هبوط، لوحات تحكم، ونظم تصميم موحدة تعمل على الشاشات المختلفة.",
        cta: "اطلب مشروعك",
      },
      systems: {
        title: "الأنظمة والبيانات",
        text: "نماذج بيانات، صلاحيات، تخزين سحابي، تكاملات API، وأرشفة منظمة مع عزل المعلومات الحساسة.",
        cta: "ناقش احتياجك",
      },
      androidBuild: "بناء تطبيقات Android",
      ideaToProduct: "من الفكرة إلى المنتج",
      support: "دعم وتواصل مستمر",
      fromIdea: "من الفكرة إلى الإصدار",
      security: "أمان · أداء · قابلية توسع",
    },
    en: {
      eyebrow: "Technology lab",
      title1: "Build the idea.",
      title2: "Bring it to life.",
      description: "Practical digital solutions for your needs: mobile apps, web platforms, management systems, and secure experiences that scale.",
      mobile: {
        title: "Mobile applications",
        text: "Responsive Android and iOS experiences with clear interfaces, update-ready architecture, and store-ready packages.",
      },
      web: {
        title: "Web and interfaces",
        text: "Fast responsive platforms, landing pages, dashboards, and unified design systems for every screen.",
        cta: "Request a project",
      },
      systems: {
        title: "Systems and data",
        text: "Data models, permissions, cloud storage, API integrations, and organized archiving with sensitive-data isolation.",
        cta: "Discuss your needs",
      },
      androidBuild: "Android app builds",
      ideaToProduct: "From idea to product",
      support: "Continuous support",
      fromIdea: "From idea to release",
      security: "Security · performance · scalability",
    },
  },
  // Department navigation
  departments: {
    ar: {
      title: "أقسام المنصة",
      employment: "التوظيف",
      realEstate: "التسويق العقاري",
      eMarketing: "التسويق الإلكتروني",
      software: "البرمجيات",
      listings: "العروض والطلبات",
      offers: "العروض الترويجية",
    },
    en: {
      title: "Platform Departments",
      employment: "Employment",
      realEstate: "Real Estate Marketing",
      eMarketing: "Digital Marketing",
      software: "Software",
      listings: "Listings & Offers",
      offers: "Promotional Offers",
    },
  },
  // Submission form
  submission: {
    ar: {
      eyebrow: "بوابة الطلبات",
      title: "قدّم طلبك",
      titleSub: "بوضوح واهتمام.",
      description: "يصل طلبك أولًا إلى إدارة المنصة للمراجعة والتدقيق. لا يُنشر أي محتوى إلا بعد الموافقة، وتُستخدم بيانات التواصل للتنسيق مع الإدارة فقط.",
      privacy: "يصل طلبك إلى الإدارة للمراجعة قبل اعتماد النشر.",
      formTitle: "نموذج طلب لل الإدارة",
      category: "نوع الطلب",
      categories: {
        employment: "توظيف",
        realEstateOffer: "عرض عقار",
        realEstateRequest: "طلب عقار",
        productOffer: "عرض منتج",
        productRequest: "طلب منتج",
        software: "برمجيات وتطوير تطبيقات",
      },
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "كيف نناديك؟",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 00967711780999",
      phoneHint: "يفضل أن يكون الرقم مرتبطًا بواتساب لتسهيل التواصل.",
      address: "العنوان",
      addressPlaceholder: "المدينة والمنطقة",
      titleInput: "العنوان المختصر للطلب",
      titlePlaceholder: "مثال: وظيفة محاسب أو أرض للبيع",
      details: "التفاصيل والوصف",
      detailsPlaceholder: "اكتب التفاصيل والشروط أو المواصفات...",
      attachments: "المرفقات",
      attachmentsHint: "حتى 5 ملفات، صور أو PDF، بحد أقصى 8 ميغابايت لكل ملف.",
      profession: "المهنة / النوع",
      professionPlaceholder: "اختياري",
      price: "السعر / الميزانية",
      pricePlaceholder: "اختياري",
      submitBtn: "إرسال للمراجعة",
      submitting: "جارٍ الإرسال...",
      success: "تم استلام طلبك.",
      successHint: "رقم الطلب محفوظ لدى الإدارة للمراجعة والتواصل.",
      sendAnother: "إرسال طلب آخر",
      error: "تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى.",
    },
    en: {
      eyebrow: "Request portal",
      title: "Submit your request",
      titleSub: "with clarity and care.",
      description: "Your request first reaches the platform team for review. Nothing is published without approval, and contact details are used only for coordination.",
      privacy: "Your request reaches the team for review before publishing.",
      formTitle: "Request form for the team",
      category: "Request type",
      categories: {
        employment: "Recruitment",
        realEstateOffer: "Property offer",
        realEstateRequest: "Property request",
        productOffer: "Product offer",
        productRequest: "Product request",
        software: "Software and app development",
      },
      fullName: "Full name",
      fullNamePlaceholder: "What should we call you?",
      phone: "Phone number",
      phonePlaceholder: "e.g. 00967711780999",
      phoneHint: "A WhatsApp-linked number is preferred for easier contact.",
      address: "Address",
      addressPlaceholder: "City and area",
      titleInput: "Brief title for the request",
      titlePlaceholder: "e.g. Accountant job or land for sale",
      details: "Details and description",
      detailsPlaceholder: "Write the details, conditions, or specifications...",
      attachments: "Attachments",
      attachmentsHint: "Up to 5 files, images or PDF, max 8 MB per file.",
      profession: "Profession / Type",
      professionPlaceholder: "Optional",
      price: "Price / Budget",
      pricePlaceholder: "Optional",
      submitBtn: "Submit for review",
      submitting: "Sending...",
      success: "Request received.",
      successHint: "Your request is saved for review and follow-up.",
      sendAnother: "Send another request",
      error: "Failed to send request. Please check your data and try again.",
    },
  },
  // Why section
  why: {
    ar: {
      eyebrow: "مصممة للواقع",
      title1: "ليست مجرد منصة.",
      title2: "إنها نقطة اتصال.",
      description: "لأن الخدمة الجيدة تبدأ من فهم المكان والناس، نبني ViP Yemen كمساحة عملية تجمع العرض بالطلب، والمهارة بالفرصة.",
      points: [
        "تواصل مباشر عبر القنوات التي تعرفها",
        "واجهة واضحة بدون خطوات زائدة",
        "مراجعة إدارية قبل النشر",
        "خدمات قريبة من احتياجات السوق اليمني",
      ],
      side: "من صنعاء\nإلى كل فرصة",
    },
    en: {
      eyebrow: "Built for real life",
      title1: "More than a platform.",
      title2: "A point of connection.",
      description: "Great service starts with understanding people and place, so ViP Yemen brings supply and demand, skills and opportunities, together.",
      points: [
        "Direct contact through familiar channels",
        "A clear interface without extra steps",
        "Administrative review before publishing",
        "Services close to Yemen's market needs",
      ],
      side: "From Sana'a\nto every opportunity",
    },
  },
  // Contact section
  contact: {
    ar: {
      eyebrow: "لنبدأ من احتياجك",
      title1: "هل لديك فرصة",
      title2: "تستحق أن تُرى؟",
      description: "أرسل لنا احتياجك أو تواصل مباشرة. نحن هنا لنقرّب المسافة بينك وبين الشخص المناسب.",
      whatsapp: "واتساب: 00967711780999",
      formTitle: "رسالة سريعة",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "كيف نناديك؟",
      messageLabel: "كيف يمكننا مساعدتك؟",
      messagePlaceholder: "اكتب احتياجك باختصار...",
      submitBtn: "إرسال الرسالة",
      sentTitle: "وصلت رسالتك.",
      sentMessage: "سنتواصل معك عبر القناة المناسبة قريبًا.",
      sendAnother: "إرسال رسالة أخرى",
    },
    en: {
      eyebrow: "Start with your need",
      title1: "Have an opportunity",
      title2: "worth seeing?",
      description: "Share your need or contact us directly. We help shorten the distance between you and the right person.",
      whatsapp: "WhatsApp: 00967711780999",
      formTitle: "Quick message",
      nameLabel: "Full name",
      namePlaceholder: "What should we call you?",
      messageLabel: "How can we help?",
      messagePlaceholder: "Write your need briefly...",
      submitBtn: "Send message",
      sentTitle: "Your message has been received.",
      sentMessage: "We'll contact you through the appropriate channel soon.",
      sendAnother: "Send another message",
    },
  },
  // Footer
  footer: {
    ar: {
      brand: "للتوظيف والتسويق الإلكتروني\nوالخدمات العامة.",
      contactTitle: "تواصل معنا",
      quickLinks: "روابط سريعة",
      servicesLink: "الخدمات",
      submitLink: "أرسل طلبًا",
      follow: "تابع قنواتنا ليصلك كل جديد وعروضنا الترويجية",
      allChannels: "كل القنوات الرسمية",
      channelsUpdating: "سيتم تحديث القنوات الرسمية قريبًا.",
      financialTitle: "حساباتي المالية لتسديد المستحقات",
      financialSubtitle: "جميع الحسابات مرتبطه برقم الهاتف:",
      bank: "بنك الكريمي",
      bankDesc: "حساب بنكي لدى بنك الكريمي",
      walletJawal: "محفظة الجوالي",
      walletJawalDesc: "محفظة الجوال المرتبطة بالهاتف",
      walletJaib: "محفظة جيب",
      walletJaibDesc: "محفظة جيب للدفع السريع",
      copyright: "© 2026 ViP Yemen. جميع الحقوق محفوظة.",
      owner: "جميع حقوق الملكية والنشر محفوظة لدى",
      developer: "المهندس علي درهم الدحان",
    },
    en: {
      brand: "For recruitment, digital marketing,\nand general services.",
      contactTitle: "Contact us",
      quickLinks: "Quick links",
      servicesLink: "Services",
      submitLink: "Submit a request",
      follow: "Follow our channels for updates and promotions",
      allChannels: "All official channels",
      channelsUpdating: "Official channels will be updated soon.",
      financialTitle: "Payment accounts for settling dues",
      financialSubtitle: "All accounts linked to phone number:",
      bank: "Al-Kuraimi Bank",
      bankDesc: "My bank account at Al-Kuraimi Bank",
      walletJawal: "Jawal Wallet",
      walletJawalDesc: "Mobile wallet linked to phone",
      walletJaib: "Jaib Wallet",
      walletJaibDesc: "Quick payment wallet",
      copyright: "© 2026 ViP Yemen. All rights reserved.",
      owner: "All ownership and publishing rights reserved by",
      developer: "Engineer Ali Aldahan",
    },
  },
  // Announcements
  announcements: {
    ar: {
      ariaLabel: "الإعلانات النشطة",
      details: "التفاصيل",
      fallbackTitle: "مرحبًا بكم في ViP Yemen",
      fallbackMessage: "منصتكم الشاملة: تسويقية · خدمية · تقنية — كل الأمنيات بين يديك بثقة ومصداقية ومهنية",
    },
    en: {
      ariaLabel: "Active announcements",
      details: "Details",
      fallbackTitle: "Welcome to ViP Yemen",
      fallbackMessage: "Your all-in-one marketing, service, and technology platform — opportunity within reach with trust and professionalism",
    },
  },
  // Calendar
  calendar: {
    ar: { today: "اليوم" },
    en: { today: "Today" },
  },
  // Accessibility
  accessibility: {
    ar: {
      label: "أدوات تحسين القراءة",
      zoomIn: "تكبير النصوص والصور",
      zoomOut: "تصغير النصوص والصور",
      reset: "إعادة ضبط حجم النصوص والصور",
    },
    en: {
      label: "Reading tools",
      zoomIn: "Zoom in text and images",
      zoomOut: "Zoom out text and images",
      reset: "Reset text and image size",
    },
  },
  // Visual Identity
  visualIdentity: {
    ar: {
      eyebrow: "هوية ViP Yemen",
      title1: "صور تحكي",
      title2: "قصة الفرصة.",
      description: "أصول بصرية أصلية ومهيأة للعرض السريع مع الحفاظ على تفاصيل الهوية والرسالة.",
      marketing: "التسويق الإلكتروني",
      software: "البرمجيات والتطبيقات",
      achievements: "إنجازات وهوية موثوقة",
    },
    en: {
      eyebrow: "ViP Yemen identity",
      title1: "Images tell",
      title2: "the story of opportunity.",
      description: "Original visual assets prepared for fast delivery while preserving the identity and message.",
      marketing: "Digital marketing",
      software: "Software and apps",
      achievements: "Trusted identity and results",
    },
  },
  // Managed sections
  managed: {
    ar: { sectionLabel: "قسم مضاف من لوحة المطور" },
    en: { sectionLabel: "Section added from developer dashboard" },
  },
  // Not Found page
  notFound: {
    ar: { title: "الصفحة غير موجودة", back: "العودة للرئيسية" },
    en: { title: "Page not found", back: "Back to home" },
  },
  // Status labels
  status: {
    ar: {
      pending: "قيد الانتظار",
      inReview: "قيد المراجعة",
      approved: "تمت الموافقة",
      rejected: "مرفوض",
      archived: "مؤرشف",
      sold: "تم البيع",
      draft: "مسودة",
      scheduled: "مجدول",
      published: "منشور",
      paused: "متوقف",
      expired: "منتهي",
    },
    en: {
      pending: "Pending",
      inReview: "In review",
      approved: "Approved",
      rejected: "Rejected",
      archived: "Archived",
      sold: "Sold",
      draft: "Draft",
      scheduled: "Scheduled",
      published: "Published",
      paused: "Paused",
      expired: "Expired",
    },
  },
  // Department categories
  categories: {
    ar: {
      employment: "توظيف",
      realEstateOffer: "عرض عقار",
      realEstateRequest: "طلب عقار",
      productOffer: "عرض منتج",
      productRequest: "طلب منتج",
      software: "برمجيات",
    },
    en: {
      employment: "Employment",
      realEstateOffer: "Property offer",
      realEstateRequest: "Property request",
      productOffer: "Product offer",
      productRequest: "Product request",
      software: "Software",
    },
  },
  // Notifications
  notifications: {
    ar: {
      title: "الإشعارات",
      markAllRead: "تعيين الكل كمقروء",
      empty: "لا توجد إشعارات جديدة",
      submissionReceived: "تم استلام طلب جديد",
      submissionApproved: "تمت الموافقة على طلبك",
      submissionRejected: "تم رفض طلبك",
      newOffer: "عرض جديد متاح",
      adPublished: "تم نشر إعلان جديد",
    },
    en: {
      title: "Notifications",
      markAllRead: "Mark all as read",
      empty: "No new notifications",
      submissionReceived: "New submission received",
      submissionApproved: "Your submission has been approved",
      submissionRejected: "Your submission has been rejected",
      newOffer: "New offer available",
      adPublished: "New advertisement published",
    },
  },
  // Automation
  automation: {
    ar: {
      autoPublish: "النشر التلقائي",
      autoExpire: "انتهاء الصلاحية التلقائي",
      autoArchive: "الأرشفة التلقائية",
      autoNotify: "الإشعارات التلقائية",
      description: "نظام الأتمتة يضمن تحديث المنصة بشكل مستمر ودقيق",
    },
    en: {
      autoPublish: "Auto-publish",
      autoExpire: "Auto-expire",
      autoArchive: "Auto-archive",
      autoNotify: "Auto-notify",
      description: "The automation system ensures continuous and accurate platform updates",
    },
  },
} as const;

// Helper function to get translation
export function getTranslation(lang: Language, path: string): string {
  const keys = path.split(".");
  let result: unknown = translations;
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof result === "string") return result;
  if (typeof result === "object" && result !== null && lang in result) {
    return (result as Record<string, string>)[lang];
  }
  return path;
}

// Export the main translation object for component use
export default translations;
