# 🏪 برجمان — Burjuman
## نظام إدارة متكامل

---

## 📁 هيكل المشروع

```
burjuman/
├── index.html              ← نقطة الدخول الرئيسية
│
├── css/
│   └── main.css            ← جميع الأنماط والتصاميم
│
├── pages/                  ← مرجعي (HTML للصفحات موجود في index.html)
│   ├── store.html
│   ├── rep_home.html       ← واجهة المندوب المخصصة
│   ├── dashboard.html
│   ├── orders.html
│   ├── wallet.html
│   ├── inventory.html
│   ├── users.html
│   ├── products.html
│   ├── offers.html
│   ├── rep_tracking.html
│   ├── rep_field.html
│   ├── reports.html
│   └── modals.html
│
└── js/                     ← وحدات JavaScript
    ├── 01_config.js        ← الإعدادات العامة والصلاحيات
    ├── 02_firebase.js      ← تعاملات قاعدة البيانات
    ├── 03_sidebar.js       ← الشريط الجانبي
    ├── 04_init.js          ← تهيئة التطبيق عند التشغيل
    ├── 05_realtime.js      ← المستمعات الفورية (Firestore)
    ├── 06_loader.js        ← تحميل البيانات
    ├── 07_ui.js            ← بناء الواجهة وإدارة الصفحات
    ├── 08_auth.js          ← تسجيل الدخول والخروج
    ├── 09_store.js         ← صفحة المتجر والفلترة
    ├── 10_cart.js          ← السلة وإدارة الكميات
    ├── 11_map.js           ← خريطة Leaflet لتحديد الموقع
    ├── 12_order.js         ← إرسال الطلبات وحساب العمولة
    ├── 13_points.js        ← نظام النقاط (100,000 د.ع = نقطة)
    ├── 14_dashboard.js     ← لوحة الإحصائيات
    ├── 15_orders.js        ← قائمة وإدارة الطلبات
    ├── 16_wallet.js        ← المحفظة والعمولات
    ├── 17_inventory.js     ← المخزون
    ├── 18_purchases.js     ← المشتريات
    ├── 19_users.js         ← إدارة المستخدمين
    ├── 20_products.js      ← إدارة المنتجات
    ├── 21_stock.js         ← تعديل المخزون
    ├── 22_discounts.js     ← الخصومات
    ├── 23_offers.js        ← العروض
    ├── 24_rep_tracking.js  ← تتبع المندوبين (أدمن)
    ├── 25_notifications.js ← الإشعارات
    ├── 26_reports.js       ← التقارير
    ├── 27_rep_home.js      ← واجهة بيت المندوب
    ├── 28_helpers.js       ← دوال مساعدة عامة
    └── 29_start.js         ← تشغيل التطبيق (init)
```

---

## 👥 أدوار المستخدمين

| الدور | الواجهة عند الدخول | الصلاحيات |
|-------|-------------------|-----------|
| `admin` | Dashboard الكامل | كل الصفحات |
| `sales_manager` | Dashboard | إدارة + تتبع المندوبين |
| `rep` | **Rep Home مخصصة** | المتجر + نشاطه الميداني + محفظته |
| `market_owner` | Dashboard | المتجر + محفظته |

---

## 🔥 Firebase

- **Project:** `burjuman-6cb83`
- **Collections:** `users`, `products`, `orders`, `offers`, `notifications`, `points`
- **Sub-collections:** `users/{id}/visits`, `points/{id}/history`

---

## 🚀 تشغيل المشروع

افتح `index.html` مباشرة في المتصفح أو استخدم سيرفر محلي:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

ثم افتح: `http://localhost:8080`

---

## 📱 واجهة المندوب (Rep Home)

عند دخول المندوب يرى مباشرة:
- 👋 تحية شخصية حسب وقت اليوم
- 💰 رصيد عمولاته (اضغط للمحفظة)
- 📊 KPIs: طلبات اليوم، مبيعات اليوم، مبيعات الشهر، عمولة الشهر
- ⚡ أزرار سريعة: طلب جديد، موقعي، محفظتي، نقاطي
- ⭐ شريط التقدم نحو النقطة التالية
- 📅 قائمة زياراته اليوم
- 🎁 آخر العروض النشطة
