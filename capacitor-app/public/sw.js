// Service Worker for vipyemen App
const CACHE_NAME = 'vipyemen-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/privacy-policy.html',
  '/terms-of-service.html'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إرجاع النسخة المحفوظة إذا وجدت
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // محاولة جلب من الشبكة
        return fetch(event.request)
          .then((response) => {
            // التحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // حفظ نسخة في الكاش
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed, serving offline page', error);
            
            // إرجاع صفحة offline للصفحات الرئيسية
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // إرجاع صورة افتراضية للصور
            if (event.request.destination === 'image') {
              return caches.match('/icon-192.png');
            }
          });
      })
  );
});

// معالجة رسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// إشعارات Push (للمستقبل)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من vipyemen',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'عرض التفاصيل',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('vipyemen', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // إغلاق الإشعار فقط
  } else {
    // النقر على الإشعار نفسه
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// معالجة إغلاق الإشعارات
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed', event);
});

// معالجة التزامن في الخلفية
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // يمكن إضافة منطق مزامنة البيانات هنا
      console.log('Service Worker: Performing background sync')
    );
  }
});

// تنظيف الكاش القديم
const cleanOldCaches = () => {
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith('vipyemen-') && cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    );
  });
};

// تشغيل تنظيف الكاش عند التفعيل
self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanOldCaches().then(() => {
      console.log('Service Worker: Old caches cleaned');
    })
  );
});

console.log('Service Worker: vipyemen SW loaded successfully');

