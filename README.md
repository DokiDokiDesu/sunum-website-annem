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

# İlk kurulumda migration çalıştırın
npm run migrate

# Sunucuyu başlatın
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacaktır.

**İlk Superadmin Hesabı:**

- Kullanıcı Adı: `superadmin`
- Şifre: `admin123`
- **ÖNEMLİ:** İlk girişte şifrenizi değiştirin!

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

1. `.env` dosyasındaki `JWT_SECRET`'ı değiştirin
2. Varsayılan admin şifresini değiştirin
3. CORS ayarlarını güncelleyin
4. PostgreSQL gibi production-ready bir veritabanına geçin

## Lisans

MIT

## İletişim

Sorularınız için lütfen issue açın.
