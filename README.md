# Rumah Baru untuk Miko

Game kucing 3D dengan Nazwa dan Raina, dua perempuan Muslimah berhijab yang baru pertama kali memelihara kucing. Versi 2 menggantikan Robotic Dog Simulator dengan rumah, karakter, cerita, dan UI baru.

## Jalankan di Windows 11

1. Install **Node.js 22.12+ LTS** dari https://nodejs.org/.
2. Unduh versi terbaru melalui **Code → Download ZIP**, lalu ekstrak ke **folder baru**. Jangan gunakan patch UI Pawtek lama.
3. Buka Terminal di folder yang berisi `package.json`:

```powershell
npm install
npm run dev
```

Buka **http://127.0.0.1:5188/**. Alamat ini sengaja berbeda dari localhost:5173 yang sebelumnya menampilkan CompetitionHub. Jika port dipakai, server berhenti dengan pesan error; hentikan server lama atau gunakan `npm run dev -- --port 5189` dan buka port baru.

Pakai Chrome/Edge terbaru dengan WebGL2 dan akselerasi hardware. Tidak membutuhkan VPS, server berbayar, akun, atau layanan eksternal. Semua font, material, model, dan musik ada di proyek atau dibuat secara prosedural.

## Cerita pembuka: 1 menit 48 detik

Tekan **Mulai petualangan**. Pada kunjungan pertama, 12 bagian cerita berdurasi total **108 detik** memperkenalkan Miko, Nazwa, dan Raina. Ada kamera adegan, gerakan karakter, musik sintetis, dan **subtitle Indonesia**. Dialog belum memiliki rekaman suara/dubbing.

- **Jeda / Lanjutkan** atau **Esc**: jeda cerita.
- **Lewati cerita**: langsung masuk permainan.
- **Putar cerita** di menu: tonton lagi kapan saja.
- Browser menyimpan status cerita telah ditonton. Tab yang disembunyikan menjeda cerita.

Setelah cerita, dekati Nazwa dan Raina lalu tekan **E** untuk menyapa keduanya. Jelajahi rumah, temukan tiga mainan tersembunyi, lihat kenang-kenangan keluarga, makan, minum, main bola benang, dan tidur.

## Kontrol

| Tombol | Fungsi |
|---|---|
| W A S D | Gerak mengikuti arah kamera |
| Shift | Lari |
| Space | Lompat / bangun |
| E | Interaksi terdekat |
| Geser mouse | Putar kamera |
| Scroll | Zoom |
| Esc | Jeda / lanjut |

## Grafis

Pilih **Pengaturan → Kualitas grafis → Tinggi** untuk ambient occlusion (SSAO), bloom lembut, bayangan 4096px, material PBR, refleksi lingkungan, tone mapping ACES, serta detail kain/kayu. Sedang memakai bayangan 2048px tanpa SSAO; Rendah menonaktifkan bayangan dan efek berat. Resolusi menyesuaikan FPS.

Visualnya **kartun 3D sinematik berbasis Three.js**, bukan Unreal Engine 5. Tidak memakai Lumen, Nanite, ray tracing, atau aset manusia fotorealistik. Target 60 FPS perlu diuji di GPU pengguna; pengujian cloud memakai software rendering dan jauh lebih lambat.

## Build dan hosting gratis

```powershell
npm run build
npm run preview
```

Build ada di `dist/`. Buka URL preview yang dicetak terminal; jangan membuka HTML lewat `file://`. `downloads/miko-production.zip` dapat diekstrak untuk unggahan static hosting.

**Cloudflare Pages:** hubungkan repository ini, gunakan build command `npm run build`, output `dist`, Node 22. Atau unggah isi `dist` lewat Direct Upload. **Vercel / Netlify:** import repository; konfigurasi tersedia. Tidak perlu environment variable. Tidak ada klaim deployment publik pada rilis ini.

## Struktur

- `src/character/Cat.js`: Miko, telinga segitiga, kumis, mata, kaki dan ekor beruas.
- `src/world/Home.js`: rumah, furnitur, material, area dan aktivitas.
- `src/world/Residents.js`: Nazwa/Raina, pakaian panjang, hijab dan gerak sederhana.
- `src/story/IntroStory.js`: 108 detik cerita, subtitle, kamera, jeda/lewati/putar ulang.
- `src/world/BaseWorld.js`: collider, batch geometri, aktivitas dan zona.
- `src/core`, `physics`, `camera`, `controls`: rendering, loop 60 Hz, Rapier dan input.
- `src/interaction`, `audio`, `ui`: interaksi, Web Audio, menu dan HUD.

Vanilla JavaScript ES modules, Three.js, Rapier, Vite, HTML dan CSS. Tanpa React atau backend.

## Tes

```powershell
npm test
# Jalankan npm run preview -- --port 4190 di terminal lain, lalu:
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:TEST_URL = 'http://localhost:4190/?test=1'
node tests/browser.mjs
```

Lihat `VALIDATION.md`. Akses QA `window.__game` hanya tersedia saat development atau memakai `?test=1`; game ini tidak memiliki state server berprivilege.

## Batasan dan kredit

- Cerita memakai subtitle dan musik, belum dubbing/lip-sync.
- Model karakter dan rumah bergaya kartun prosedural, bukan hasil motion capture.
- Progres aktivitas belum disimpan antar-reload; pengaturan dan status intro tersimpan.
- Gameplay membutuhkan keyboard/mouse. Menu responsif tidak berarti kontrol sentuh tersedia.
- Windows 11 tidak tersedia untuk pengujian langsung; perintah dan source bersifat lintas platform.
- Semua model/tekstur/suara sintetis dibuat untuk proyek ini. Font Outfit dan DM Sans: SIL OFL, lisensi di `public/assets/licenses`. Three.js: MIT; Rapier: Apache-2.0; Vite/Playwright mengikuti lisensi upstream.
