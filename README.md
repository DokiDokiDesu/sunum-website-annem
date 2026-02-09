# Seminer Yönetim Sistemi

Bu proje, seminer etkinliklerini yönetmek için geliştirilmiş full-stack bir web uygulamasıdır. Admin paneli üzerinden seminerler eklenebilir, düzenlenebilir ve silinebilir.

## Proje Yapısı

```
├── backend/          # Express.js + SQLite backend
└── frontend/         # React + Vite frontend
```

## Hızlı Başlangıç

### 1. Backend'i Çalıştırın

```bash
cd backend
npm install
npm start
```

Backend `http://localhost:5000` adresinde çalışacaktır.

**Varsayılan Admin Hesabı:**

- Kullanıcı Adı: `admin`
- Şifre: `admin123`

### 2. Frontend'i Çalıştırın

Yeni bir terminal penceresi açın:

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

## Admin Paneli

Admin paneline erişmek için:

- URL: `http://localhost:5173/#/admin/login`
- Varsayılan giriş bilgileri ile giriş yapın

### Admin Panel Özellikleri

✅ Yeni seminer ekleme
✅ Seminerleri düzenleme
✅ Seminerleri silme
✅ Resim yükleme
✅ Kategori yönetimi
✅ Popüler seminer işaretleme
✅ Yaklaşan seminer işaretleme

## Özellikler

### Frontend

- ✨ Modern, responsive tasarım
- 🎨 Tailwind CSS ile stillendirilmiş arayüz
- 🔍 Arama ve filtreleme
- 📱 Mobil uyumlu
- 🎯 Seminer detay sayfaları
- 🗳️ Oylama sistemi

### Backend

- 🔐 JWT tabanlı authentication
- 📦 SQLite veritabanı (PostgreSQL'e geçiş için hazır)
- 🖼️ Resim yükleme ve yönetimi
- 🔒 Güvenli admin API'leri
- ✅ Veri doğrulama

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

1. `.env` dosyasındaki `JWT_SECRET`'ı değiştirin
2. Varsayılan admin şifresini değiştirin
3. CORS ayarlarını güncelleyin
4. PostgreSQL gibi production-ready bir veritabanına geçin

## Lisans

MIT

## İletişim

Sorularınız için lütfen issue açın.
