# رفع خطای بیلد Vercel

برای اینکه بیلد روی Vercel موفق شود، **حتماً** تغییرات را به GitHub پوش کنید.

## مراحل

1. **ذخیره همه فایل‌ها** در ادیتور (Ctrl+S یا Cmd+S).

2. **در ترمینال از پوشه پروژه اجرا کنید:**

```bash
git add .
git status
git commit -m "fix: Vercel build - disable unused vars check"
git push origin main
```

3. بعد از پوش، Vercel خودش دوباره دیپلوی می‌کند؛ یا از داشبورد Vercel یک بار **Redeploy** بگیرید.

**نکته:** اگر فقط «Redeploy» بزنید بدون پوش جدید، همان کامیت قبلی (d2047a4) دوباره بیلد می‌شود و خطا برمی‌گردد. حتماً اول `git push` کنید.
