# Seminer Yönetim Sistemi - Backend

SQLite veritabanı kullanan Express.js tabanlı backend API.

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2. Sunucuyu Başlat

```bash
npm start
```

Geliştirme modu için (otomatik yeniden başlatma):

```bash
npm run dev
```

Sunucu `http://localhost:5000` adresinde çalışacaktır.

## Varsayılan Admin Hesabı

İlk çalıştırmada otomatik olarak bir admin hesabı oluşturulur:

- **Kullanıcı Adı:** admin
- **Şifre:** admin123
- **Email:** admin@seminar.com

## API Endpoints

### Authentication (Yetkilendirme)

- `POST /api/auth/register` - Yeni admin kaydı
- `POST /api/auth/login` - Admin girişi
- `GET /api/auth/profile` - Admin profili (Token gerekli)

### Seminerler

- `GET /api/seminars` - Tüm seminerleri listele
  - Query params: `category`, `search`, `isPopular`, `isUpcoming`
- `GET /api/seminars/:id` - Tek seminer detayı
- `POST /api/seminars` - Yeni seminer ekle (Admin - Token gerekli)
- `PUT /api/seminars/:id` - Seminer güncelle (Admin - Token gerekli)
- `DELETE /api/seminars/:id` - Seminer sil (Admin - Token gerekli)
- `POST /api/seminars/:id/vote` - Seminere oy ver

### Resim Yükleme

Seminer eklerken veya güncellerken `image` field'ı ile dosya gönderilebilir (multipart/form-data).

## Veritabanı

SQLite veritabanı `database.sqlite` dosyasında saklanır. İlk çalıştırmada otomatik olarak oluşturulur.

### Seminer Veritabanı Yapısı

```
Seminar:
- id (integer, primary key)
- title (string)
- instructor (string)
- description (text)
- category (string)
- date (string)
- startTime (string)
- duration (string)
- price (decimal)
- image (string)
- dayOfWeek (string)
- isPopular (boolean)
- isUpcoming (boolean)
- votes (integer)
- createdAt (datetime)
- updatedAt (datetime)
```

## Ortam Değişkenleri (.env)

```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## PostgreSQL'e Geçiş

İleride PostgreSQL'e geçmek için:

1. `package.json`'a `pg` ve `pg-hstore` paketlerini ekleyin
2. `config/database.js` dosyasını şu şekilde güncelleyin:

```javascript
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});
```

## Önemli Notlar

- Resimler `uploads/` klasöründe saklanır
- JWT token 7 gün geçerlidir
- CORS tüm originlere açıktır (production'da değiştirilmeli)
- Dosya yükleme limiti: 5MB
