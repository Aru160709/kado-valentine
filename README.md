# Kado Valentine

Web kejutan Valentine (Svelte + Vite di atas Node.js).
Alur berurutan: password (nama + tanggal jadian) > ketuk kado, foto berterbangan > Kenangan > Video > Game > Surat.

## Yang dibutuhkan
Node.js versi 20 atau lebih baru. Download: https://nodejs.org

## Jalankan
```
npm install
npm run dev
```
Buka alamat yang muncul. Untuk HP, pakai alamat "Network" di terminal (satu WiFi dengan laptop).

## Ganti isi (semua di src/config.js)
- Nama yang diterima, tanggal jadian, petunjuk password
- Nomor WhatsApp dan pesan awal (bagian `wa`)
- Surat, tanggal surat, P.S., alasan, nama pengirim
- Target dan hadiah game

## Taruh file sendiri
- Foto: `public/photos/` (lalu ganti nama file di config)
- Video: `public/videos/` (format mp4)
- Lagu: `public/music.mp3` (lagu "Bergema Sampai Selamanya" - Nadhif Basalamah, file mp3 kamu taruh sendiri). Setelah login muncul popup lagu yang otomatis mengecil ke pojok kanan atas.

## Dikirim ke pasangan
```
npm run build
```
Upload isi folder `dist` ke Netlify / Vercel / GitHub Pages.
