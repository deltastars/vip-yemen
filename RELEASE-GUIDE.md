# دليل الإصدار - ViP Yemen

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إنشاء إصدار جديد من تطبيق ViP Yemen ورفعه إلى GitHub Releases.

## 🎯 معلومات التطبيق

| العنصر | القيمة |
|--------|--------|
| **اسم الحزمة** | `com.vip.yemen` |
| **اسم التطبيق** | ViP Yemen |
| **إصدار التطوير الحالي** | 1.1.0 |
| **最低 Android** | 7.0 (API 24) |

## 🚀 خطوات الإصدار

### 1. تحديث الإصدار

```bash
# تحديث إصدار Android
node scripts/set-android-version.mjs 1.2.0

# تحديث إصدار capacitor-app
cd capacitor-app
npm version 1.2.0 --no-git-tag-version
```

### 2. الالتزام بالتغييرات

```bash
git add .
git commit -m "chore: update version to 1.2.0"
```

### 3. إنشاء وسم (Tag)

```bash
git tag v1.2.0
```

### 4. رفع التغييرات

```bash
git push origin main
git push origin v1.2.0
```

### 5. انتظار بناء CI/CD

سيقوم GitHub Actions تلقائياً بـ:
1. بناء تطبيق الويب
2. مزامنة Capacitor Android
3. بناء APKDebug و AABRelease
4. إنشاء إصدار GitHub مع الملفات

## 📱 الملفات الناتجة

### APK (Debug)
- **الاستخدام**: للتثبيت المباشر على الأجهزة
- **الملف**: `ViP-Yemen-X.X.X-debug.apk`
- **لا يحتاج توقيع**

### AAB (Release)
- **الاستخدام**: لرفعه إلى Google Play Store
- **الملف**: `ViP-Yemen-X.X.X-release.aab`
- **يحتاج توقيع**

## 📥 تثبيت APK مباشرة

1. حمّل ملف `.apk` من صفحة الإصدارات
2. فعّل "تثبيت من مصادر غير معروفة" في إعدادات Android
3. افتح الملف المحمل وتثبّت

## 🔄 التحديث التلقائي

- ✅ نفس الحزمة `com.vip.yemen`
- ✅ لا يحتاج المستخدم لحذف النسخة القديمة
- ✅ `versionCode` متزايد
- ✅ التطبيق الجديد يحل محل القديم تلقائياً

## 📊 هيكل أرقام الإصدار

```
versionCode = Major × 1,000,000 + Minor × 1,000 + Patch

مثال:
1.0.0 → 1000000
1.1.0 → 1010000
1.2.0 → 1020000
2.0.0 → 2000000
```

## 🔐 التوقيع

### توقيع Debug
- يتم تلقائياً بواسطة Gradle
- لا يحتاج ملفات توقيع

### توقيع Release
- يحتاج `keystore.properties`
- راجع `capacitor-app/SIGNING-GUIDE.md`

## 📝 سجل التغييرات

### الإصدار 1.1.0
- ✅ تغيير الحزمة إلى `com.vip.yemen`
- ✅ نظام الترجمة الشامل (عربي/إنجليزي)
- ✅ نظام الإشعارات المتقدم
- ✅ نظام الأتمتة الشامل
- ✅ قسم العروض الترويجية
- ✅ الحسابات المالية في التذييل

## 🛠️ أوامر مفيدة

```bash
# تحديث الإصدار
node scripts/set-android-version.mjs X.Y.Z

# بناء محلي
cd capacitor-app
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug

# التحقق من التوقيع
$ANDROID_HOME/build-tools/*/apksigner verify --verbose app-debug.apk
```

## 📞 الدعم

لأي استفسارات:
- البريد: ViPservicesYemen@gmail.com
- واتساب: 00967711780999

---

**جميع الحقوق محفوظة © 2026 ViP Yemen**
