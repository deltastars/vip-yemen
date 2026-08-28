# دليل توقيع تطبيق ViP Yemen لأندرويد

## 📋 نظرة عامة

هذا الدليل يشرح كيفية توقيع تطبيق ViP Yemen لإصداره على Google Play Store مع ضمان التحديث التلقائي بدون حذف النسخة القديمة.

## 🎯 معلومات التطبيق

| العنصر | القيمة |
|--------|--------|
| **اسم الحزمة** | `com.vip.yemen` |
| **اسم التطبيق** | ViP Yemen |
| **إصدار التطبيق** | 1.1.0 |
| **رمز الإصدار** | 1010001 |
| **الحد الأدنى للإصدار** | Android 7.0 (API 24) |
| **الحد الأقصى للإصدار** | Android 14 (API 34) |

## 🔐 إنشاء ملف التوقيع (Keystore)

### 1. إنشاء Keystore جديد

```bash
keytool -genkey -v \
  -keystore vipyemen-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias vipyemen
```

**ملاحظة:** ستُطلب منك إدخال:
- كلمة مرور الـ Keystore (حفظها في مكان آمن)
- معلومات الشهادة (الاسم، المنظمة، المدينة، الدولة)
- كلمة مرور المفتاح

### 2. التحقق من الـ Keystore

```bash
keytool -list -v -keystore vipyemen-release.jks
```

### 3. تصدير الشهادة

```bash
keytool -exportcert -alias vipyemen \
  -keystore vipyemen-release.jks \
  -file vipyemen-cert.pem
```

## ⚙️ إعداد ملف التوقيع

### 1. إنشاء ملف keystore.properties

```bash
cp keystore.properties.example keystore.properties
```

### 2. تحرير الملف

```properties
storeFile=vipyemen-release.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=vipyemen
keyPassword=YOUR_KEY_PASSWORD
```

### 3. إضافة إلى .gitignore

```
keystore.properties
*.jks
*.keystore
```

## 🔄 التحديث التلقائي

### كيف يعمل التحديث التلقائي؟

1. **نفس الحزمة**: التطبيق يستخدم نفس الحزمة `com.vip.yemen`
2. **رمز الإصدار متزايد**: كل إصدار جديد يزيد `versionCode`
3. **بلا حذف**: المستخدم لا يحتاج لحذف النسخة القديمة

### هيكل أرقام الإصدار

```
versionCode = Major * 1000000 + Minor * 1000 + Patch
```

مثال:
- `1.0.0` = 1000000
- `1.0.1` = 1000001
- `1.1.0` = 1010000
- `1.1.1` = 1010001

### تحديث versionCode تلقائياً

```bash
# تحديث الإصدار إلى 1.2.0
node ../scripts/set-android-version.mjs 1.2.0
```

## 📱 بناء التطبيق

### بناء APK للاختبار

```bash
cd android
./gradlew assembleDebug
```

الملف الناتج: `app/build/outputs/apk/debug/app-debug.apk`

### بناء AAB للنشر

```bash
cd android
./gradlew bundleRelease
```

الملف الناتج: `app/build/outputs/bundle/release/app-release.aab`

## 🚀 رفع التطبيق إلى Google Play

### 1. التحقق من التوقيع

```bash
# التحقق من توقيع APK
$ANDROID_HOME/build-tools/*/apksigner verify --verbose app/build/outputs/apk/debug/app-debug.apk

# التحقق من توقيع AAB
$ANDROID_HOME/build-tools/*/apksigner verify --verbose app/build/outputs/bundle/release/app-release.aab
```

### 2. اختبار التثبيت فوق النسخة القديمة

```bash
# تثبيت النسخة القديمة أولاً
adb install old-version.apk

# تثبيت النسخة الجديدة فوق
adb install -r new-version.apk
```

### 3. رفع إلى Google Play Console

1. ادخل إلى [Google Play Console](https://play.google.com/console)
2. اختر تطبيق `com.vip.yemen`
3. اذهب إلى "إصدارات التطبيقات"
4. أنشئ إصداراً جديداً
5. ارفع ملف `.aab`
6. أكمل معلومات الإصدار
7. انشر الإصدار

## 🔧 إصلاح الأخطاء الشائعة

### خطأ: "التوقيع غير متطابق"

**المشكلة**: حاولت تثبيت إصدار بتوقيع مختلف

**الحل**:
1. تأكد من استخدام نفس ملف الـ Keystore
2. تأكد من استخدام نفس الـ Key Alias
3. لا تحذف ملف الـ Keystore

### خطأ: "versionCode أقل من الحالي"

**المشكلة**: الإصدار الجديد code أقل من الحالي

**الحل**:
```bash
# تحقق من الإصدار الحالي
grep versionCode android/app/build.gradle

# حدث versionCode ليكون أعلى
node ../scripts/set-android-version.mjs X.Y.Z
```

### خطأ: "الحزمة غير متوافقة"

**المشكلة**: الحزمة الجديدة لا تتطابق مع القديمة

**الحل**:
1. تأكد من `applicationId` مطابق
2. تأكد من `signingConfigs` مطابق
3. لا تغير `keyAlias`

## 📝 ملفات التوثيق المطلوبة

### 1. لGoogle Play

- **سياسة الخصوصية**: `privacy-policy.html` ✅
- **وصف التطبيق**: يتم كتابته في Google Play Console
- **لقطات شاشة**: يتم رفعها في Google Play Console
- **صور الأيقونة**: 512x512 PNG

### 2. للتطبيق نفسه

- ** crashes**: يتم تتبعها عبر Firebase Crashlytics (اختياري)
- **metrics**: يتم تتبعها عبر Firebase Analytics (اختياري)

## 🛡️ أمان التوقيع

### حماية ملف Keystore

1. **لا ترفعه لـ GitHub**: أضف `*.jks` و `*.keystore` إلى `.gitignore`
2. **خزنه في مكان آمن**: استخدممدير كلمات المرور أو مخزن آمن
3. **اعطي نسخة احتياطية**: احتفظ بنسخة في مكان آمن منفصل

### تغيير كلمة المرور

```bash
keytool -storepasswd -keystore vipyemen-release.jks
keytool -keypasswd -keystore vipyemen-release.jks -alias vipyemen
```

## 📊 معلومات الحزمة

### com.vip.yemen

| الملف | الوصف |
|-------|-------|
| `app-debug.apk` | نسخة الاختبار (unsigned) |
| `app-release.apk` | نسخة الإصدار (signed) |
| `app-release.aab` | حزمة Google Play (signed) |
| `vipyemen-release.jks` | ملف التوقيع (NEVER COMMIT!) |
| `keystore.properties` | إعدادات التوقيع (NEVER COMMIT!) |

## 🔄 سير العمل للإصدار

1. **تحديث الإصدار**:
   ```bash
   node ../scripts/set-android-version.mjs 1.2.0
   ```

2. **بناء AAB**:
   ```bash
   cd android && ./gradlew bundleRelease
   ```

3. **التحقق من التوقيع**:
   ```bash
   $ANDROID_HOME/build-tools/*/apksigner verify app/build/outputs/bundle/release/app-release.aab
   ```

4. **رفع إلى Google Play**:
   - ارفع `app-release.aab` إلى Google Play Console
   - أكمل متطلبات الإصدار
   - انشر الإصدار

## 📞 الدعم

لأي استفسارات:
- البريد: ViPservicesYemen@gmail.com
- واتساب: 00967711780999

---

**ملاحظة مهمة**: لا تشارك ملف الـ Keystore أو كلمة المرور مع أي شخص. حافظ عليهما في مكان آمن.
