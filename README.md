# ViP Yemen

حزمة ViP Yemen متعددة المكونات، وتشمل مصدر الموقع ومنصة الويب ومشروع Android أصلي وملفات البناء التلقائي.

## المكونات

- `website/`: مصدر موقع ViP Yemen وقاعدة الخادم وواجهة الإدارة.
- `mobile/`: مصدر واجهة تطبيق `vipyemen` وإعدادات الإصدار.
- `android-native/`: مشروع Android أصلي يبني APK وAAB عبر Gradle.
- `assets/`: الأيقونة الرسمية الذهبية ذات النسر والصورة الأصلية للمطور.
- `docs/`: أدلة الهوية والتشغيل ومراجعة الأصول.

## البناء

لبناء الموقع استخدم `pnpm install` ثم `pnpm run build` داخل `website/`.

لبناء Android استخدم `gradle wrapper --gradle-version 8.10.2` داخل `android-native/` ثم `./gradlew assembleDebug bundleRelease`. يشغّل workflow في `mobile/.github/workflows/android-release.yml` البناء الأصلي ويرفع APK وAAB إلى GitHub Releases عند دفع وسم يبدأ بـ `v`. لا يتطلب هذا المسار حساب Expo.

لا تتضمن الحزمة أسرارًا أو مفاتيح توقيع. اسم المطور المعتمد: **المهندس ومطور البرمجيات علي درهم الدحان**.
