# بناء وإصدار vipyemen تلقائيًا

يحتوي المشروع على workflow في `.github/workflows/android-release.yml` يعمل عند تشغيله يدويًا أو عند دفع وسم إصدار يبدأ بـ `v`، ثم يبني APK تجريبيًا وAAB إنتاجيًا عبر Expo Application Services ويضيف الملفات الثلاثة إلى GitHub Releases.

## المتطلب الأمني الوحيد

أضف سرًا باسم `EXPO_TOKEN` إلى إعدادات مستودع GitHub. يجب أن يكون الرمز صادرًا من حساب Expo/EAS المالك للمشروع. لا تضع الرمز أو مفاتيح Android داخل الكود أو ملفات المشروع.

## إنشاء إصدار

```bash
git tag v1.0.0
git push origin v1.0.0
```

أو شغّل workflow من تبويب Actions باستخدام `Run workflow`.

## المخرجات

ينتج الإصدار `vipyemen.apk` للتثبيت المباشر على Android، و`vipyemen.aab` للرفع إلى Google Play، و`vipyemen-source.zip` للكود المصدري. يتولى Expo/EAS إدارة توقيع البناء بحسب حساب المالك؛ لا يحتوي المستودع على مفاتيح توقيع.

## ملاحظة التحقق

لا يصبح رابط Release متاحًا إلا بعد نجاح EAS في بناء الصيغتين. في حال عدم وجود `EXPO_TOKEN` أو عدم ربط المشروع بحساب Expo، سيفشل workflow مبكرًا برسالة واضحة بدل نشر ملفات ناقصة.
