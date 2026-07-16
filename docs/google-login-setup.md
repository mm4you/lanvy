# Cau hinh dang nhap Google

## Google Cloud Console

1. Mo **Google Auth Platform > Branding**, dat ten ung dung va email ho tro.
2. Trong **Audience**, chon External. Khi dang thu nghiem, them hai test user:
   - `nguyenthilanvy12a2@gmail.com`
   - `ungnhutkhang53@gmail.com`
3. Mo **Clients > Create client > Web application**.
4. Them JavaScript origin local: `http://localhost:3000`.
5. Them redirect URI local chinh xac: `http://localhost:3000/api/auth/google/callback`.
6. Khi deploy, them origin HTTPS va callback cung duong dan `/api/auth/google/callback`.

## Bien moi truong

Them vao `.env.local` va khong commit file nay:

```env
GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
SESSION_SECRET="mot-chuoi-ngau-nhien-it-nhat-32-byte"
```

Tao `SESSION_SECRET` bang lenh:

```bash
openssl rand -base64 48
```

Sau khi thay bien moi truong, khoi dong lai dev server. Tren production, `GOOGLE_REDIRECT_URI` phai dung HTTPS va trung tuyet doi voi URI da khai bao trong Google Cloud Console.
