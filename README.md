# 🎓 Seminer Yönetim Sistemi

Modern seminer ve eğitim yönetim sistemi. React frontend ve Node.js backend ile geliştirilmiştir. Cloudinary entegrasyonu ve Render deployment desteği ile production-ready.

## 🚀 Teknolojiler

### Frontend

- **React 19** - UI Framework
- **Vite** - Build Tool & Dev Server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Day.js** - Date formatting

### Backend

- **Node.js** & **Express** - Server
- **Sequelize** - ORM
- **PostgreSQL** - Production Database (Render)
- **SQLite** - Development Database
- **Cloudinary** - Image Storage & CDN
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload

## 📋 Özellikler

### Frontend Özellikleri

- ✨ Modern, responsive tasarım
- 🎨 Tailwind CSS ile stillendirilmiş arayüz
- 🔍 Arama ve filtreleme
- 📱 Mobil uyumlu
- 🎯 Seminer detay sayfaları
- 🗳️ Oylama sistemi
- 🔐 Rol tabanlı erişim kontrolü

### Backend Özellikleri

- 🔐 JWT tabanlı authentication
- 👤 Rol sistemi (Super Admin / Admin)
- 📦 Çift veritabanı desteği (SQLite/PostgreSQL)
- ☁️ Cloudinary image CDN entegrasyonu
- 🖼️ Otomatik resim optimizasyonu
- 🔒 Güvenli admin API'leri
- ✅ Veri doğrulama
- 📋 Otomatik aktivite loglama
- 🔄 Veritabanı migration sistemi

## 🛠️ Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Cloudinary hesabı (ücretsiz: https://cloudinary.com)

### Backend Kurulumu

```bash
cd backend
npm install

# .env dosyası oluştur ve düzenle
cp .env.example .env

# .env dosyasında şunları güncelle:
# - JWT_SECRET (güçlü bir key)
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET

# Development server başlat
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacaktır.

### Frontend Kurulumu

```bash
cd frontend
npm install

# .env dosyası oluştur
cp .env.example .env

# Development server başlat
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

## 🔐 İlk Superadmin Oluşturma

```bash
cd backend
node create-superadmin.js
```

**Varsayılan Credentials:**

- Kullanıcı Adı: `superadmin`
- Şifre: `admin123`
- **ÖNEMLİ:** İlk girişte şifrenizi değiştirin!

## 🌐 Deployment (Render)

Bu proje Render platformunda deploy edilmeye hazırdır.

### Hızlı Deployment:

1. **GitHub'a Push Edin**

```bash
git add .
git commit -m "Deployment hazır"
git push origin main
```

2. **Render'da Deploy Edin**
   - Render Dashboard: https://dashboard.render.com
   - New > Blueprint
   - Repository'nizi seçin
   - `render.yaml` otomatik algılanacak
   - Environment variables ayarlayın:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `FRONTEND_URL` (frontend URL'iniz)
   - Apply!

3. **İlk Superadmin Oluşturun**
   - Backend Service > Shell
   - `node create-superadmin.js`

Detaylı talimatlar için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın.

## 📦 Database Setup

### Development (SQLite)

Otomatik olarak `backend/database.sqlite` dosyası oluşturulur.

### Production (PostgreSQL)

`DATABASE_URL` environment variable ile PostgreSQL bağlantısı yapılır. Render otomatik olarak PostgreSQL database oluşturur ve bağlar.

## Admin Paneli

Admin paneline erişmek için:

- URL: `http://localhost:5173/admin/login`
- İlk girişte superadmin bilgileri ile giriş yapın
- Profil sekmesinden şifrenizi değiştirin

### Admin Sistemi Özellikleri

#### Super Admin Yetenekleri:

✅ Seminer içerik yönetimi (oluştur, düzenle, sil)
✅ Kategori yönetimi
✅ **Yeni admin hesapları oluşturma**
✅ **Admin hesaplarını düzenleme/silme**
✅ **Admin şifrelerini sıfırlama**
✅ **Aktivite loglarını görüntüleme**
✅ Kendi şifresini değiştirme

#### Normal Admin Yetenekleri:

✅ Seminer içerik yönetimi
✅ Kategori yönetimi
✅ Kendi şifresini değiştirme

### Admin Panel Özellikleri

#### 📝 Seminer Yönetimi

✅ Yeni seminer ekleme
✅ Seminerleri düzenleme
✅ Seminerleri silme
✅ Resim yükleme
✅ Popüler seminer işaretleme
✅ Yaklaşan seminer işaretleme
✅ Seminer planlama (tarih, saat, eğitmen)

#### 📊 Kategori Yönetimi

✅ Dinamik kategori oluşturma
✅ Kategori düzenleme ve silme
✅ Header menüsünde gösterme/gizleme
✅ Sıralama ve vurgulama

#### 👥 Admin Yönetimi (Sadece Superadmin)

✅ Yeni admin hesapları oluşturma
✅ Admin bilgilerini düzenleme
✅ Admin hesaplarını aktif/pasif yapma
✅ Admin şifrelerini sıfırlama
✅ Rol yönetimi (Admin / Super Admin)

#### 📋 Aktivite Logları (Sadece Superadmin)

✅ Tüm admin işlemlerini görüntüleme
✅ Filtreleme (Eylem, Kaynak türü)
✅ İstatistikler ve raporlar
✅ IP adresi ve zaman damgası takibi

#### 👤 Profil Yönetimi

✅ Kendi bilgilerini görüntüleme
✅ Şifre değiştirme
✅ Son giriş bilgisi

## Özellikler

### Frontend

- ✨ Modern, responsive tasarım
- 🎨 Tailwind CSS ile stillendirilmiş arayüz
- 🔍 Arama ve filtreleme
- 📱 Mobil uyumlu
- 🎯 Seminer detay sayfaları
- 🗳️ Oylama sistemi
- 🔐 Rol tabanlı erişim kontrolü

### Backend

- 🔐 JWT tabanlı authentication
- 👤 Rol sistemi (Super Admin / Admin)
- 📦 SQLite veritabanı (PostgreSQL'e geçiş için hazır)
- 🖼️ Resim yükleme ve yönetimi
- 🔒 Güvenli admin API'leri
- ✅ Veri doğrulama
- 📋 Otomatik aktivite loglama
- 🔄 Veritabanı migration sistemi

## Teknolojiler

### Backend

- Node.js
- Express.js
- Sequelize ORM
- SQLite3
- JWT (jsonwebtoken)
- Multer (dosya yükleme)
- bcryptjs (şifre hashleme)

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS

## API Dokümantasyonu

Detaylı API dokümantasyonu için `backend/README.md` dosyasına bakın.

## Geliştirme

### Backend Geliştirme Modu

```bash
cd backend
npm run dev  # nodemon ile otomatik yeniden başlatma
```

### Frontend Geliştirme Modu

```bash
cd frontend
npm run dev  # Vite hot reload ile çalışır
```

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

Build dosyaları `frontend/dist/` klasöründe oluşturulacaktır.

## Veritabanı

- Geliştirme ortamında SQLite kullanılmaktadır
- Veritabanı dosyası: `backend/database.sqlite`
- İlk çalıştırmada otomatik olarak oluşturulur
- PostgreSQL'e geçiş için backend README'ye bakın

## Güvenlik Notları

⚠️ **Production'a almadan önce:**

1. `.env` dosyasındaki `JWT_SECRET`'ı güçlü bir key ile değiştirin
2. Varsayılan superadmin şifresini mutlaka değiştirin
3. CORS ayarlarını production frontend URL'i ile güncelleyin
4. Environment variables'ları asla git'e commit etmeyin
5. Cloudinary API credentials'larını gizli tutun
6. PostgreSQL production veritabanı kullanın (SQLite sadece development için)

## 📁 Proje Yapısı

```
.
├── backend/
│   ├── config/            # Database & Cloudinary config
│   │   ├── database.js    # Multi-DB support (SQLite/PostgreSQL)
│   │   └── cloudinary.js  # Image CDN config
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, upload, logging
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── create-superadmin.js  # Initial admin setup
│   └── .env.example       # Environment template
│
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── Components/    # Reusable components
│   │   ├── Pages/         # Page components
│   │   │   ├── Admin/     # Admin panel pages
│   │   │   └── Homepage/  # Public pages
│   │   ├── config/        # API configuration
│   │   │   └── api.js     # API endpoints
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   └── .env.example       # Environment template
│
├── render.yaml            # Render deployment config
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md              # This file
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # nodemon ile auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Vite dev server (hot reload)
```

### Production Build

```bash
cd frontend
npm run build  # Build output: dist/
```

## 🧪 API Health Check

```bash
curl http://localhost:5000/api/health
```

Response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-strong-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
DATABASE_URL=postgresql://... (production only)
FRONTEND_URL=https://your-frontend.com (production only)
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

Production'da: `VITE_API_URL=https://your-backend.onrender.com`

## 📖 Daha Fazla Bilgi

- [Deployment Guide](DEPLOYMENT.md) - Detaylı deploy talimatları
- [Backend README](backend/README.md) - Backend API dokümantasyonu
- [Admin System Guide](ADMIN_SYSTEM_GUIDE.md) - Admin panel kullanımı

## 📖 Daha Fazla Bilgi

- [Deployment Guide](DEPLOYMENT.md) - Detaylı deploy talimatları
- [Backend README](backend/README.md) - Backend API dokümantasyonu
- [Admin System Guide](ADMIN_SYSTEM_GUIDE.md) - Admin panel kullanımı

## 📄 Lisans

MIT

## 👥 Contributors

- [@DokiDokiDesu](https://github.com/DokiDokiDesu)

## 🐛 Bug Reports & Feature Requests

GitHub Issues kullanarak bug report veya feature request oluşturabilirsiniz.

## 📞 İletişim

Sorularınız için GitHub Issues kullanın.

---

⭐ **Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Not:** Bu proje Cloudinary CDN ve Render deployment ile production-ready hale getirilmiştir.
