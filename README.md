# ViP Yemen

حزمة ViP Yemen متعددة المكونات، وتشمل مصدر الموقع ومنصة الويب ومصدر تطبيق Android/Expo وملفات البناء التلقائي.

## المكونات

- `website/`: مصدر موقع ViP Yemen وقاعدة الخادم وواجهة الإدارة.
- `mobile/`: مصدر تطبيق `vipyemen` مع إعدادات APK وAAB وGitHub Actions.
- `assets/`: الأيقونة الرسمية الذهبية ذات النسر والصورة الأصلية للمطور.
- `docs/`: أدلة الهوية والتشغيل ومراجعة الأصول.

## البناء

لبناء الموقع استخدم `pnpm install` ثم `pnpm run build` داخل `website/`.

لبناء التطبيق استخدم `pnpm install` داخل `mobile/`، ثم اربط حساب Expo/EAS وأضف `EXPO_TOKEN` إلى أسرار المستودع. يشغّل workflow في `mobile/.github/workflows/android-release.yml` بناء APK وAAB ثم يرفعهما إلى GitHub Releases عند دفع وسم يبدأ بـ `v`.

لا تتضمن الحزمة أسرارًا أو مفاتيح توقيع. اسم المطور المعتمد: **المهندس ومطور البرمجيات علي درهم الدحان**.
