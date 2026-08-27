# حالة بناء vipyemen Android

تم إنشاء مشروع Expo حقيقي باسم `vipyemen` مع المعرّف `com.vipyemen.app`، وإضافة واجهة عربية متجاوبة والأيقونة الذهبية ذات النسر وVIP، وإعداد ملف `eas.json` لصيغة APK التجريبية وصيغة AAB الإنتاجية.

تم تثبيت التبعيات بنجاح. محاولة البناء السحابي عبر EAS توقفت لأن بيئة البناء غير مسجلة الدخول إلى حساب Expo، وظهر الخطأ: `An Expo user account is required to proceed`.

لإنتاج الملفات الفعلية، سجّل الدخول إلى Expo ثم نفّذ:

```bash
pnpm install
npx eas login
pnpm run build:apk
pnpm run build:aab
```

أو استخدم رمز وصول Expo في بيئة CI عبر `EXPO_TOKEN`. لا تُضمّن رمز الوصول أو مفاتيح توقيع Android داخل المستودع أو الأرشيف.

ملف APK يمكن بناؤه من profile `preview`، وملف AAB من profile `production`. لا يمكن وصفهما بأنهما جاهزان للتنزيل قبل نجاح EAS وإرجاع روابط البناء الفعلية.
