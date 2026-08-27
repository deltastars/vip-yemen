// نظام قاعدة البيانات المؤقتة القوي لتطبيق vipyemen
// يدعم أعداد كبيرة جداً من الإعلانات والمرفقات والبيانات

class VipYemenDatabase {
  constructor() {
    this.data = {
      listings: new Map(), // استخدام Map للأداء الأفضل مع البيانات الكبيرة
      users: new Map(),
      payments: new Map(),
      categories: new Map(),
      attachments: new Map(),
      analytics: new Map()
    }
    
    this.indexes = {
      listingsByCategory: new Map(),
      listingsByUser: new Map(),
      listingsByStatus: new Map(),
      listingsByDate: new Map(),
      usersByType: new Map(),
      paymentsByStatus: new Map()
    }
    
    this.config = {
      maxListingsPerUser: 1000,
      maxAttachmentsPerListing: 20,
      maxAttachmentSize: 50 * 1024 * 1024, // 50MB
      enableCompression: true,
      enableIndexing: true,
      autoBackup: true
    }
    
    this.initializeDatabase()
  }

  // تهيئة قاعدة البيانات مع بيانات وهمية كبيرة
  initializeDatabase() {
    console.log('🚀 تهيئة قاعدة بيانات vipyemen...')
    
    // إنشاء فئات متنوعة
    this.createCategories()
    
    // إنشاء مستخدمين وهميين
    this.createUsers(500) // 500 مستخدم
    
    // إنشاء إعلانات وهمية كبيرة
    this.createListings(10000) // 10,000 إعلان
    
    // إنشاء مدفوعات وهمية
    this.createPayments(2000) // 2,000 دفعة
    
    // بناء الفهارس
    this.buildIndexes()
    
    console.log('✅ تم تهيئة قاعدة البيانات بنجاح!')
    console.log(`📊 الإحصائيات:`)
    console.log(`   - الإعلانات: ${this.data.listings.size.toLocaleString()}`)
    console.log(`   - المستخدمين: ${this.data.users.size.toLocaleString()}`)
    console.log(`   - المدفوعات: ${this.data.payments.size.toLocaleString()}`)
    console.log(`   - الفئات: ${this.data.categories.size.toLocaleString()}`)
  }

  // إنشاء فئات متنوعة
  createCategories() {
    const categories = [
      // التسويق الإلكتروني
      { id: 'cars', name: 'سيارات', type: 'digital-marketing', icon: '🚗' },
      { id: 'electronics', name: 'أجهزة إلكترونية', type: 'digital-marketing', icon: '📱' },
      { id: 'phones', name: 'هواتف', type: 'digital-marketing', icon: '📞' },
      { id: 'furniture', name: 'أثاث', type: 'digital-marketing', icon: '🪑' },
      { id: 'bedrooms', name: 'غرف نوم', type: 'digital-marketing', icon: '🛏️' },
      { id: 'doors', name: 'أبواب خشب', type: 'digital-marketing', icon: '🚪' },
      
      // الخدمات
      { id: 'logistics', name: 'دعم لوجستي', type: 'services', icon: '🚚' },
      { id: 'electrician', name: 'كهربائي', type: 'services', icon: '⚡' },
      { id: 'plumber', name: 'سباك', type: 'services', icon: '🔧' },
      { id: 'carpenter', name: 'نجار', type: 'services', icon: '🔨' },
      { id: 'construction', name: 'بناء', type: 'services', icon: '🏗️' },
      { id: 'engineer', name: 'مهندس', type: 'services', icon: '👷' },
      { id: 'teacher', name: 'معلم', type: 'services', icon: '👨‍🏫' },
      { id: 'welding', name: 'ورش لحام', type: 'services', icon: '🔥' },
      { id: 'aluminum', name: 'أعمال ألمنيوم وزجاج', type: 'services', icon: '🪟' },
      
      // العقارات
      { id: 'land', name: 'أرض', type: 'real-estate', icon: '🏞️' },
      { id: 'building', name: 'عمارة', type: 'real-estate', icon: '🏢' },
      { id: 'villa', name: 'فيلا', type: 'real-estate', icon: '🏡' },
      { id: 'apartment', name: 'شقة', type: 'real-estate', icon: '🏠' },
      { id: 'shop', name: 'محل تجاري', type: 'real-estate', icon: '🏪' },
      
      // الوظائف
      { id: 'it', name: 'تقنية المعلومات', type: 'jobs', icon: '💻' },
      { id: 'medical', name: 'طبية', type: 'jobs', icon: '⚕️' },
      { id: 'education', name: 'تعليمية', type: 'jobs', icon: '📚' },
      { id: 'sales', name: 'مبيعات', type: 'jobs', icon: '💼' },
      { id: 'management', name: 'إدارية', type: 'jobs', icon: '📋' }
    ]
    
    categories.forEach(category => {
      this.data.categories.set(category.id, {
        ...category,
        createdAt: new Date(),
        listingsCount: 0
      })
    })
  }

  // إنشاء مستخدمين وهميين
  createUsers(count) {
    const firstNames = ['أحمد', 'محمد', 'علي', 'فاطمة', 'عائشة', 'خديجة', 'عبدالله', 'عبدالرحمن', 'سارة', 'مريم', 'يوسف', 'إبراهيم', 'عمر', 'حسن', 'حسين']
    const lastNames = ['المحمدي', 'الأحمدي', 'العلي', 'السالم', 'الحسني', 'الزهراني', 'القحطاني', 'الغامدي', 'العتيبي', 'الحربي', 'المطيري', 'الدوسري', 'الشهري', 'الثقفي', 'البلوي']
    const cities = ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'ذمار', 'المكلا', 'سيئون', 'مأرب', 'الجوف']
    
    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      
      const user = {
        id: `user_${i}`,
        name: `${firstName} ${lastName}`,
        phone: `777${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        city: city,
        type: Math.random() > 0.8 ? 'premium' : 'regular',
        joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        listingsCount: 0,
        rating: Math.random() * 2 + 3, // 3-5 نجوم
        isVerified: Math.random() > 0.3,
        lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      }
      
      this.data.users.set(user.id, user)
    }
  }

  // إنشاء إعلانات وهمية كبيرة
  createListings(count) {
    const titles = {
      'cars': ['تويوتا كامري', 'هوندا أكورد', 'نيسان التيما', 'هيونداي إلنترا', 'كيا أوبتيما', 'مازدا 6', 'شيفروليه كروز'],
      'electronics': ['لابتوب ديل', 'تلفزيون سامسونج', 'ثلاجة إل جي', 'غسالة بوش', 'مكيف جري', 'ميكروويف باناسونيك'],
      'phones': ['آيفون 14', 'سامسونج جالاكسي', 'هواوي P50', 'شاومي ريدمي', 'أوبو رينو', 'ريلمي 9'],
      'villa': ['فيلا فاخرة', 'فيلا عائلية', 'فيلا مودرن', 'فيلا تراثية', 'فيلا بحديقة', 'فيلا دوبلكس'],
      'apartment': ['شقة عائلية', 'شقة مفروشة', 'شقة جديدة', 'شقة واسعة', 'شقة بإطلالة', 'شقة اقتصادية'],
      'it': ['مطور ويب', 'مهندس برمجيات', 'مصمم جرافيك', 'محلل أنظمة', 'مدير مشاريع تقنية', 'خبير أمن سيبراني']
    }
    
    const descriptions = [
      'في حالة ممتازة، استخدام شخصي، صيانة دورية',
      'جودة عالية، ضمان ساري، سعر مناسب',
      'حالة جيدة جداً، بدون أعطال، للبيع العاجل',
      'مواصفات عالية، استخدام خفيف، نظيف جداً',
      'فرصة ذهبية، سعر مغري، تواصل سريع',
      'جديد بالكرتون، لم يستخدم، بالضمان',
      'حالة ممتازة، فحص كامل، جاهز للاستخدام'
    ]
    
    const statuses = ['pending', 'approved', 'rejected', 'draft']
    const types = ['offer', 'request']
    const categories = Array.from(this.data.categories.keys())
    const users = Array.from(this.data.users.keys())
    
    for (let i = 1; i <= count; i++) {
      const categoryId = categories[Math.floor(Math.random() * categories.length)]
      const category = this.data.categories.get(categoryId)
      const userId = users[Math.floor(Math.random() * users.length)]
      const user = this.data.users.get(userId)
      
      const titleOptions = titles[categoryId] || ['منتج عالي الجودة', 'خدمة ممتازة', 'عرض مميز']
      const title = titleOptions[Math.floor(Math.random() * titleOptions.length)]
      
      const listing = {
        id: `listing_${i}`,
        title: `${title} ${Math.floor(Math.random() * 2024) + 2000}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        categoryId: categoryId,
        categoryName: category.name,
        type: types[Math.floor(Math.random() * types.length)],
        userId: userId,
        userName: user.name,
        userPhone: user.phone,
        price: Math.floor(Math.random() * 1000000) + 1000,
        currency: 'YER',
        location: user.city,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: Math.random() > 0.9 ? 'high' : 'normal',
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
        attachments: this.generateAttachments(Math.floor(Math.random() * 5) + 1),
        tags: this.generateTags(categoryId),
        specifications: this.generateSpecifications(categoryId),
        isPromoted: Math.random() > 0.85,
        promotionEndsAt: Math.random() > 0.85 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null
      }
      
      this.data.listings.set(listing.id, listing)
      
      // تحديث عداد الإعلانات للمستخدم والفئة
      user.listingsCount++
      category.listingsCount++
    }
  }

  // إنشاء مرفقات وهمية
  generateAttachments(count) {
    const attachments = []
    const types = ['image', 'video', 'document']
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const attachment = {
        id: `attachment_${Date.now()}_${i}`,
        type: type,
        name: `${type}_${i + 1}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`,
        size: Math.floor(Math.random() * 10 * 1024 * 1024), // حتى 10MB
        url: `/uploads/${type}_${i + 1}`,
        uploadedAt: new Date()
      }
      attachments.push(attachment)
    }
    
    return attachments
  }

  // إنشاء علامات وهمية
  generateTags(categoryId) {
    const tagsByCategory = {
      'cars': ['مستعمل', 'فحص', 'ضمان', 'تقسيط'],
      'electronics': ['جديد', 'ضمان', 'توصيل', 'تركيب'],
      'phones': ['مفتوح', 'مقفل', 'ضمان', 'اكسسوارات'],
      'villa': ['مفروش', 'حديقة', 'مسبح', 'موقف'],
      'apartment': ['مفروش', 'مكيف', 'مصعد', 'أمن'],
      'it': ['عن بعد', 'دوام كامل', 'خبرة', 'شهادة']
    }
    
    const availableTags = tagsByCategory[categoryId] || ['جودة', 'سعر مناسب', 'توصيل']
    const selectedTags = []
    const tagCount = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < tagCount; i++) {
      const tag = availableTags[Math.floor(Math.random() * availableTags.length)]
      if (!selectedTags.includes(tag)) {
        selectedTags.push(tag)
      }
    }
    
    return selectedTags
  }

  // إنشاء مواصفات وهمية
  generateSpecifications(categoryId) {
    const specsByCategory = {
      'cars': {
        'سنة الصنع': Math.floor(Math.random() * 20) + 2005,
        'الكيلومترات': Math.floor(Math.random() * 200000) + 10000,
        'نوع الوقود': ['بنزين', 'ديزل', 'هايبرد'][Math.floor(Math.random() * 3)],
        'ناقل الحركة': ['أوتوماتيك', 'عادي'][Math.floor(Math.random() * 2)]
      },
      'electronics': {
        'الحالة': ['جديد', 'مستعمل', 'مجدد'][Math.floor(Math.random() * 3)],
        'الضمان': Math.floor(Math.random() * 24) + 1 + ' شهر',
        'اللون': ['أسود', 'أبيض', 'فضي', 'ذهبي'][Math.floor(Math.random() * 4)]
      },
      'villa': {
        'المساحة': Math.floor(Math.random() * 500) + 200 + ' متر مربع',
        'عدد الغرف': Math.floor(Math.random() * 5) + 3,
        'عدد الحمامات': Math.floor(Math.random() * 3) + 2,
        'العمر': Math.floor(Math.random() * 20) + 1 + ' سنة'
      }
    }
    
    return specsByCategory[categoryId] || {}
  }

  // إنشاء مدفوعات وهمية
  createPayments(count) {
    const users = Array.from(this.data.users.values())
    const statuses = ['pending', 'approved', 'rejected']
    const methods = ['bank_transfer', 'cash', 'mobile_payment']
    
    for (let i = 1; i <= count; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      
      const payment = {
        id: `payment_${i}`,
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        amount: Math.floor(Math.random() * 100000) + 5000,
        currency: 'YER',
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        transferNumber: `TR${Math.floor(Math.random() * 1000000000)}`,
        description: 'رسوم نشر إعلان مميز',
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        processedAt: Math.random() > 0.5 ? new Date() : null,
        receipt: {
          id: `receipt_${i}`,
          url: `/receipts/receipt_${i}.jpg`,
          uploadedAt: new Date()
        }
      }
      
      this.data.payments.set(payment.id, payment)
    }
  }

  // بناء الفهارس للبحث السريع
  buildIndexes() {
    console.log('🔍 بناء فهارس البحث...')
    
    // فهرسة الإعلانات حسب الفئة
    this.data.listings.forEach(listing => {
      if (!this.indexes.listingsByCategory.has(listing.categoryId)) {
        this.indexes.listingsByCategory.set(listing.categoryId, [])
      }
      this.indexes.listingsByCategory.get(listing.categoryId).push(listing.id)
      
      // فهرسة حسب المستخدم
      if (!this.indexes.listingsByUser.has(listing.userId)) {
        this.indexes.listingsByUser.set(listing.userId, [])
      }
      this.indexes.listingsByUser.get(listing.userId).push(listing.id)
      
      // فهرسة حسب الحالة
      if (!this.indexes.listingsByStatus.has(listing.status)) {
        this.indexes.listingsByStatus.set(listing.status, [])
      }
      this.indexes.listingsByStatus.get(listing.status).push(listing.id)
      
      // فهرسة حسب التاريخ (شهر/سنة)
      const dateKey = `${listing.createdAt.getFullYear()}-${listing.createdAt.getMonth()}`
      if (!this.indexes.listingsByDate.has(dateKey)) {
        this.indexes.listingsByDate.set(dateKey, [])
      }
      this.indexes.listingsByDate.get(dateKey).push(listing.id)
    })
    
    // فهرسة المستخدمين حسب النوع
    this.data.users.forEach(user => {
      if (!this.indexes.usersByType.has(user.type)) {
        this.indexes.usersByType.set(user.type, [])
      }
      this.indexes.usersByType.get(user.type).push(user.id)
    })
    
    // فهرسة المدفوعات حسب الحالة
    this.data.payments.forEach(payment => {
      if (!this.indexes.paymentsByStatus.has(payment.status)) {
        this.indexes.paymentsByStatus.set(payment.status, [])
      }
      this.indexes.paymentsByStatus.get(payment.status).push(payment.id)
    })
    
    console.log('✅ تم بناء الفهارس بنجاح!')
  }

  // البحث المتقدم في الإعلانات
  searchListings(query, filters = {}) {
    let results = Array.from(this.data.listings.values())
    
    // البحث النصي
    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    // تطبيق الفلاتر
    if (filters.categoryId) {
      results = results.filter(listing => listing.categoryId === filters.categoryId)
    }
    
    if (filters.status) {
      results = results.filter(listing => listing.status === filters.status)
    }
    
    if (filters.type) {
      results = results.filter(listing => listing.type === filters.type)
    }
    
    if (filters.location) {
      results = results.filter(listing => listing.location === filters.location)
    }
    
    if (filters.priceMin) {
      results = results.filter(listing => listing.price >= filters.priceMin)
    }
    
    if (filters.priceMax) {
      results = results.filter(listing => listing.price <= filters.priceMax)
    }
    
    if (filters.dateFrom) {
      results = results.filter(listing => listing.createdAt >= new Date(filters.dateFrom))
    }
    
    if (filters.dateTo) {
      results = results.filter(listing => listing.createdAt <= new Date(filters.dateTo))
    }
    
    // الترتيب
    const sortBy = filters.sortBy || 'createdAt'
    const sortOrder = filters.sortOrder || 'desc'
    
    results.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })
    
    // التصفح (Pagination)
    const page = filters.page || 1
    const limit = filters.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      data: results.slice(startIndex, endIndex),
      total: results.length,
      page: page,
      totalPages: Math.ceil(results.length / limit),
      hasNext: endIndex < results.length,
      hasPrev: page > 1
    }
  }

  // الحصول على الإحصائيات
  getStatistics() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentListings = Array.from(this.data.listings.values())
      .filter(listing => listing.createdAt >= thirtyDaysAgo)
    
    const recentUsers = Array.from(this.data.users.values())
      .filter(user => user.joinedAt >= thirtyDaysAgo)
    
    const recentPayments = Array.from(this.data.payments.values())
      .filter(payment => payment.createdAt >= thirtyDaysAgo)
    
    const pendingListings = Array.from(this.data.listings.values())
      .filter(listing => listing.status === 'pending')
    
    const approvedListings = Array.from(this.data.listings.values())
      .filter(listing => listing.status === 'approved')
    
    const totalRevenue = Array.from(this.data.payments.values())
      .filter(payment => payment.status === 'approved')
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    const monthlyRevenue = recentPayments
      .filter(payment => payment.status === 'approved')
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    return {
      totalListings: this.data.listings.size,
      totalUsers: this.data.users.size,
      totalPayments: this.data.payments.size,
      totalCategories: this.data.categories.size,
      
      pendingListings: pendingListings.length,
      approvedListings: approvedListings.length,
      
      recentListings: recentListings.length,
      recentUsers: recentUsers.length,
      recentPayments: recentPayments.length,
      
      totalRevenue: totalRevenue,
      monthlyRevenue: monthlyRevenue,
      averagePayment: totalRevenue / this.data.payments.size,
      
      topCategories: this.getTopCategories(),
      topUsers: this.getTopUsers(),
      
      databaseSize: this.calculateDatabaseSize(),
      lastUpdated: new Date()
    }
  }

  // الحصول على أهم الفئات
  getTopCategories(limit = 10) {
    return Array.from(this.data.categories.values())
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, limit)
      .map(category => ({
        id: category.id,
        name: category.name,
        count: category.listingsCount,
        icon: category.icon
      }))
  }

  // الحصول على أهم المستخدمين
  getTopUsers(limit = 10) {
    return Array.from(this.data.users.values())
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        name: user.name,
        listingsCount: user.listingsCount,
        rating: user.rating,
        isVerified: user.isVerified
      }))
  }

  // حساب حجم قاعدة البيانات
  calculateDatabaseSize() {
    const dataString = JSON.stringify({
      listings: Array.from(this.data.listings.values()),
      users: Array.from(this.data.users.values()),
      payments: Array.from(this.data.payments.values()),
      categories: Array.from(this.data.categories.values())
    })
    
    const sizeInBytes = new Blob([dataString]).size
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
    
    return {
      bytes: sizeInBytes,
      mb: sizeInMB,
      formatted: `${sizeInMB} MB`
    }
  }

  // إضافة إعلان جديد
  addListing(listingData) {
    const id = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const listing = {
      id: id,
      ...listingData,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      status: 'pending'
    }
    
    this.data.listings.set(id, listing)
    
    // تحديث الفهارس
    this.updateIndexesForListing(listing)
    
    return listing
  }

  // تحديث إعلان
  updateListing(id, updates) {
    const listing = this.data.listings.get(id)
    if (!listing) {
      throw new Error(`Listing with id ${id} not found`)
    }
    
    const updatedListing = {
      ...listing,
      ...updates,
      updatedAt: new Date()
    }
    
    this.data.listings.set(id, updatedListing)
    
    // تحديث الفهارس
    this.updateIndexesForListing(updatedListing)
    
    return updatedListing
  }

  // حذف إعلان
  deleteListing(id) {
    const listing = this.data.listings.get(id)
    if (!listing) {
      throw new Error(`Listing with id ${id} not found`)
    }
    
    this.data.listings.delete(id)
    
    // تحديث الفهارس
    this.removeFromIndexes(listing)
    
    return true
  }

  // تحديث الفهارس لإعلان معين
  updateIndexesForListing(listing) {
    // إزالة من الفهارس القديمة أولاً
    this.removeFromIndexes(listing)
    
    // إضافة للفهارس الجديدة
    if (!this.indexes.listingsByCategory.has(listing.categoryId)) {
      this.indexes.listingsByCategory.set(listing.categoryId, [])
    }
    this.indexes.listingsByCategory.get(listing.categoryId).push(listing.id)
    
    if (!this.indexes.listingsByUser.has(listing.userId)) {
      this.indexes.listingsByUser.set(listing.userId, [])
    }
    this.indexes.listingsByUser.get(listing.userId).push(listing.id)
    
    if (!this.indexes.listingsByStatus.has(listing.status)) {
      this.indexes.listingsByStatus.set(listing.status, [])
    }
    this.indexes.listingsByStatus.get(listing.status).push(listing.id)
  }

  // إزالة من الفهارس
  removeFromIndexes(listing) {
    // إزالة من فهرس الفئات
    if (this.indexes.listingsByCategory.has(listing.categoryId)) {
      const categoryListings = this.indexes.listingsByCategory.get(listing.categoryId)
      const index = categoryListings.indexOf(listing.id)
      if (index > -1) {
        categoryListings.splice(index, 1)
      }
    }
    
    // إزالة من فهرس المستخدمين
    if (this.indexes.listingsByUser.has(listing.userId)) {
      const userListings = this.indexes.listingsByUser.get(listing.userId)
      const index = userListings.indexOf(listing.id)
      if (index > -1) {
        userListings.splice(index, 1)
      }
    }
    
    // إزالة من فهرس الحالة
    if (this.indexes.listingsByStatus.has(listing.status)) {
      const statusListings = this.indexes.listingsByStatus.get(listing.status)
      const index = statusListings.indexOf(listing.id)
      if (index > -1) {
        statusListings.splice(index, 1)
      }
    }
  }

  // تصدير البيانات
  exportData(format = 'json') {
    const data = {
      listings: Array.from(this.data.listings.values()),
      users: Array.from(this.data.users.values()),
      payments: Array.from(this.data.payments.values()),
      categories: Array.from(this.data.categories.values()),
      statistics: this.getStatistics(),
      exportedAt: new Date()
    }
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      // تحويل للـ CSV (مبسط)
      return this.convertToCSV(data.listings)
    }
    
    return data
  }

  // تحويل للـ CSV
  convertToCSV(data) {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }
}

// إنشاء مثيل واحد من قاعدة البيانات
const vipYemenDB = new VipYemenDatabase()

// تصدير قاعدة البيانات للاستخدام في التطبيق
export default vipYemenDB

