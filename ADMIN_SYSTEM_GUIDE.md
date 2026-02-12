# Admin Sistemi Güncelleme Kılavuzu

## 🎯 Yapılan Değişiklikler

Admin sistemi tamamen yenilendi! Artık **Super Admin** ve **Admin** rol sistemi, **şifre değiştirme** ve **aktivite logları** mevcut.

## 🚀 Kurulum Adımları

### 1. Backend Bağımlılıklarını Kontrol Et

```bash
cd backend
npm install
```

### 2. Migration'ı Çalıştır

Bu adım veritabanını güncelleyecek ve ilk superadmin hesabını oluşturacak:

```bash
npm run migrate
```

**Çıktı:**

```
✅ Veritabanı bağlantısı başarılı
✅ Tablo yapıları güncellendi
✅ Superadmin oluşturuldu:
   Username: superadmin
   Email: admin@example.com
   Password: admin123 (ÖNEMLİ: İlk girişte değiştirin!)
```

### 3. Backend'i Başlat

```bash
npm run dev
```

### 4. Frontend'i Başlat

```bash
cd ../frontend
npm run dev
```

## 🔐 İlk Giriş

1. **Admin Login Sayfasına Git:** http://localhost:3000/admin/login
2. **Giriş Yap:**
   - Kullanıcı Adı: `superadmin`
   - Şifre: `admin123`
3. **ÖNEMLİ:** İlk girişte profil sekmesinden şifrenizi değiştirin!

## 📋 Özellikler

### Super Admin Yetenekleri:

- ✅ Seminer içerik yönetimi
- ✅ Kategori yönetimi
- ✅ **Yeni admin hesapları oluşturma**
- ✅ **Admin hesaplarını düzenleme/silme**
- ✅ **Başka adminlerin şifrelerini sıfırlama**
- ✅ **Tüm aktivite loglarını görüntüleme**
- ✅ Kendi şifresini değiştirme

### Normal Admin Yetenekleri:

- ✅ Seminer içerik yönetimi
- ✅ Kategori yönetimi
- ✅ Kendi şifresini değiştirme
- ❌ Başka adminleri yönetemez
- ❌ Aktivite loglarını göremez

## 🔧 API Endpoint'leri

### Admin Yönetimi (Sadece Superadmin)

- `GET /api/admins` - Tüm adminleri listele
- `POST /api/admins` - Yeni admin oluştur
- `PUT /api/admins/:id` - Admin güncelle
- `DELETE /api/admins/:id` - Admin sil
- `PUT /api/admins/:id/reset-password` - Admin şifresini sıfırla

### Şifre Yönetimi (Tüm Adminler)

- `PUT /api/admins/change-password` - Kendi şifresini değiştir

### Aktivite Logları (Sadece Superadmin)

- `GET /api/logs` - Tüm logları listele
- `GET /api/logs/stats` - Log istatistikleri
- `GET /api/logs/recent` - Son aktiviteler

### Auth

- `POST /api/auth/login` - Giriş yap (role bilgisi döner)
- `GET /api/auth/profile` - Profil bilgileri (role, isActive, lastLogin)

## 📊 Veritabanı Değişiklikleri

### Admin Tablosu - Yeni Kolonlar:

- `role` - ENUM('superadmin', 'admin'), default: 'admin'
- `isActive` - BOOLEAN, default: true
- `fullName` - STRING, nullable
- `lastLogin` - DATE, nullable

### Yeni Tablo: ActivityLog

Her admin işlemi otomatik olarak loglanır:

- Admin giriş/çıkış
- Seminer oluştur/güncelle/sil
- Kategori oluştur/güncelle/sil
- Admin hesabı oluştur/güncelle/sil
- Şifre değişikliği

## 🎨 Frontend Yapısı

### Yeni Componentler:

- `AdminManagement.jsx` - Admin yönetim sayfası (superadmin)
- `ActivityLogs.jsx` - Aktivite log sayfası (superadmin)
- `AdminProfile.jsx` - Profil ve şifre değiştirme sayfası (tüm adminler)

### Yeni Tab'lar:

- **👥 Admin Yönetimi** (sadece superadmin görür)
- **📋 Aktivite Logları** (sadece superadmin görür)
- **👤 Profil** (tüm adminler görür)

## 🔒 Güvenlik

### Otomatik Kontroller:

- ❌ Pasif admin hesapları giriş yapamaz
- ❌ Admin kendi rolünü değiştiremez
- ❌ Admin kendini silemez
- ❌ Son superadmin silinemez
- ❌ Sadece superadmin başka superadmin oluşturabilir

### Log Sistemi:

- Tüm admin işlemleri kaydedilir
- IP adresi ve User-Agent saklanır
- Eski/yeni değerler metadata'da tutulur
- Loglar silinemez (updatedAt yok)

## 🐛 Sorun Giderme

### Migration Hatası Alırsanız:

```bash
# Veritabanını sıfırlayın (GELİŞTİRME ortamında)
rm database.sqlite
npm run migrate
```

### Frontend Hatası Alırsanız:

```bash
# Cache'i temizleyin
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Token Hatası Alırsanız:

- Çıkış yapın ve tekrar giriş yapın
- LocalStorage'ı temizleyin: F12 > Application > Local Storage > Clear

## 📝 Örnek Kullanım

### 1. Yeni Admin Oluşturma (Superadmin):

1. "👥 Admin Yönetimi" tab'ına git
2. "+ Yeni Admin Ekle" butonuna tıkla
3. Bilgileri doldur
4. "Oluştur" butonuna tıkla

### 2. Şifre Değiştirme (Tüm Adminler):

1. "👤 Profil" tab'ına git
2. "🔒 Şifre Değiştir" butonuna tıkla
3. Mevcut ve yeni şifreyi gir
4. "Değiştir" butonuna tıkla

### 3. Aktivite Loglarını İnceleme (Superadmin):

1. "📋 Aktivite Logları" tab'ına git
2. Filtreleri kullan (Eylem, Kaynak Türü)
3. İstatistikleri incele

## 🎉 Tamamdır!

Artık gelişmiş admin yönetim sisteminiz hazır. Herhangi bir sorun yaşarsanız console loglarını kontrol edin.

**ÖNEMLİ Hatırlatmalar:**

- ✅ İlk girişte superadmin şifresini değiştirin
- ✅ Gerçek email adresleri kullanın
- ✅ Güçlü şifreler oluşturun
- ✅ Düzenli olarak aktivite loglarını kontrol edin
