# Render Deployment Guide

Bu proje Render platformunda deploy edilmeye hazır hale getirilmiştir.

## Gereksinimler

- GitHub hesabı
- Render hesabı (ücretsiz: https://render.com)
- Cloudinary hesabı (https://cloudinary.com)

## Deployment Adımları

### 1. GitHub'a Projeyi Yükleyin

```bash
git add .
git commit -m "Render deployment hazırlığı"
git push origin main
```

### 2. Render'da Yeni Blueprint Oluşturun

1. Render Dashboard'a gidin: https://dashboard.render.com
2. "New" > "Blueprint" seçeneğini tıklayın
3. GitHub repository'nizi seçin
4. `render.yaml` dosyası otomatik algılanacaktır
5. "Apply" butonuna tıklayın

### 3. Environment Variables Ayarlayın

Render otomatik olarak servisleri oluşturacaktır. Her servis için environment variables ayarlanmalıdır:

#### Backend Service Environment Variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=[Güçlü bir JWT secret key - otomatik oluşturulacak]
CLOUDINARY_CLOUD_NAME=[Cloudinary cloud name]
CLOUDINARY_API_KEY=[Cloudinary API key]
CLOUDINARY_API_SECRET=[Cloudinary API secret]
DATABASE_URL=[Otomatik atanacak - PostgreSQL connection string]
```

#### Frontend Service Environment Variables:

```
VITE_API_URL=https://sunum-website-backend.onrender.com
```

**NOT**: Backend URL'ini kendi Render service URL'iniz ile değiştirin.

### 4. Database Migrations

İlk deployment sonrası, backend service'in shell'ine girerek migration çalıştırın:

1. Render Dashboard > Backend Service > Shell
2. Aşağıdaki komutu çalıştırın:

```bash
node create-superadmin.js
```

Bu komut superadmin hesabını oluşturacaktır.

### 5. CORS Ayarları

Backend `server.js` dosyasında CORS ayarları production için yapılandırılmalıdır:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-url.onrender.com", // Frontend URL'inizi buraya ekleyin
];
```

## Manuel Deployment (Alternatif)

Blueprint kullanmak istemiyorsanız, servisları manuel oluşturabilirsiniz:

### Backend (Web Service)

1. New > Web Service
2. GitHub repo'nuzu seçin
3. Ayarlar:
   - Name: `sunum-website-backend`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Yukarıdaki listeden ekleyin

### Frontend (Static Site)

1. New > Static Site
2. GitHub repo'nuzu seçin
3. Ayarlar:
   - Name: `sunum-website-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Environment Variables: `VITE_API_URL` ekleyin

### PostgreSQL Database

1. New > PostgreSQL
2. Ayarlar:
   - Name: `sunum-website-db`
   - Database: `seminar_db`
   - User: `seminar_user`
3. Oluşturulduktan sonra Internal Database URL'yi kopyalayın
4. Backend service'in environment variables'ına `DATABASE_URL` olarak ekleyin

## Deployment Sonrası

1. Frontend URL'inizi tarayıcıda açın
2. Admin paneline giriş yapın: `/admin/login`
   - Username: `superadmin`
   - Password: `admin123`
3. İlk girişte şifrenizi değiştirin!

## Sorun Giderme

### Build Hatası

- Log'ları kontrol edin: Service > Logs
- Environment variables'ların doğru olduğundan emin olun

### Database Bağlantı Hatası

- PostgreSQL servisinin running durumda olduğundan emin olun
- DATABASE_URL environment variable'ının doğru olduğundan emin olun

### CORS Hatası

- Backend CORS ayarlarında frontend URL'inin ekli olduğundan emin olun
- Tarayıcı konsolunda detaylı hata mesajlarını kontrol edin

## Güvenlik Notları

1. **JWT_SECRET**: Güçlü ve benzersiz bir key kullanın
2. **Admin Şifresi**: İlk girişte mutlaka değiştirin
3. **Environment Variables**: Asla git'e commit etmeyin
4. **Cloudinary**: API credentials'ları gizli tutun

## Ücretsiz Plan Limitleri (Render)

- **Web Services**: 750 saat/ay (1 service için yeterli)
- **Static Sites**: Unlimited
- **PostgreSQL**: 90 gün sonra 256MB'a düşer
- **Free tier services**: 15 dakika kullanılmadığında sleep mode'a geçer

## Faydalı Komutlar

```bash
# Local development
cd backend && npm run dev
cd frontend && npm run dev

# Production build test
cd frontend && npm run build && npm run preview

# Database migration
cd backend && node migration.js

# Superadmin oluştur
cd backend && node create-superadmin.js
```

## Destek

Herhangi bir sorun yaşarsanız Render dokümantasyonuna başvurun:
https://render.com/docs
