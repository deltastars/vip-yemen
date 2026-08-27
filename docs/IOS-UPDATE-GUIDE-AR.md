# دليل تحديث ViP Yemen على iOS

## مبدأ التحديث

تصل تحديثات ViP Yemen إلى المستخدمين على iOS عبر **App Store** أو **TestFlight**. يحتفظ التطبيق بنفس `Bundle Identifier` وهو `com.vipyemen.app`، ويجب رفع `CFBundleShortVersionString` و`CFBundleVersion` في كل إصدار. عند اعتماد الإصدار الجديد، يقوم App Store أو TestFlight بترقية النسخة الموجودة بدل حذفها، وتبقى بيانات التطبيق ما لم يغيّر التطبيق نظام التخزين أو يطلب المستخدم حذفه.

## متطلبات Apple

يحتاج الناشر إلى عضوية Apple Developer، وسجل التطبيق في App Store Connect، وشهادة توزيع iOS، وProvisioning Profile مطابقًا للمعرّف `com.vipyemen.app`. للبناء الآلي في Codemagic يجب إضافة شهادة `.p12` وملف `.mobileprovision` من قسم Code signing identities، ثم إعداد تكامل App Store Connect API بمفتاح `.p8` وIssuer ID وKey ID بصلاحية App Manager. لا تُحفظ هذه الملفات أو كلمات المرور داخل GitHub أو حزمة المصدر.

## مسار TestFlight

يُربط مستودع GitHub بتطبيق Codemagic، ثم يقرأ `codemagic.yaml` ويبني workflow باسم `vipyemen-ios`. عند استخدام وسم مثل `v1.0.4`، يحدّث السير رقم الإصدار ويشغّل `xcode-project use-profiles` ثم يبني IPA موقّعًا ويرفعه إلى TestFlight. يراجع الناشر سجل البناء، ثم يختبر النسخة على أجهزة داخلية قبل توزيعها على مجموعة اختبار أوسع. يتطلب كل Build رقمًا متزايدًا، ولا يجوز إعادة استخدام رقم سبق رفعه إلى App Store Connect.

## مسار App Store

بعد نجاح اختبار TestFlight، يفتح الناشر الإصدار في App Store Connect، يضيف ملاحظات الإصدار ولقطات الشاشة وبيانات الخصوصية، ثم يرسله للمراجعة. بعد الموافقة، ينشر الإصدار يدويًا أو وفق خيار النشر التلقائي. التحديثات المستقبلية تستخدم المعرّف نفسه وتوقيع Apple نفسه، لذلك تظهر للمستخدمين كتحديثات اعتيادية.

## التراجع والاستقرار

لا يمكن استبدال إصدار منشور بإصدار أقل في App Store. إذا ظهر خطأ، يُنشأ إصدار إصلاح جديد برقم أعلى، ويُوقف الإصدار المتأثر أو يُنشر الإصلاح عبر TestFlight أولًا. يجب اختبار تشغيل النسخة الجديدة فوق النسخة السابقة، والتحقق من تسجيل الدخول والبيانات المحلية والروابط العميقة قبل الإطلاق العام.

## ما يفعله Codemagic وما يحتاجه الناشر

يحتوي `codemagic.yaml` على بناء الويب، مزامنة Capacitor، إعداد ملفات التوقيع، تحديث أرقام الإصدار، بناء IPA، ورفع TestFlight عند اكتمال الإعدادات. لا يستطيع ملف YAML وحده إنشاء حساب Apple أو استخراج شهادة خاصة؛ يجب على مالك الحساب إعداد تكامل Apple والملفات الموقعة داخل Codemagic مرة واحدة، ثم إبقاؤها صالحة وتجديدها قبل انتهاء صلاحيتها.

> **قاعدة مهمة:** لا تغيّر `com.vipyemen.app` بعد أول نشر عام؛ تغييره يجعل App Store يعتبر التطبيق منتجًا جديدًا ويمنع الترقية فوق النسخة السابقة.

## المراجع الرسمية

- [Codemagic: Ionic Capacitor apps](https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/)
- [Codemagic: iOS native apps](https://docs.codemagic.io/yaml-quick-start/building-a-native-ios-app/)
- [Apple Developer: Updating your app](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)
