# Validasi Miko v2 — 8 November 2026

## Lingkungan

Node 24.22.1, npm 11.9.0; Three.js 0.187.0, Rapier 0.21.0, Vite 8.3.6, Playwright 1.65.0. Chromium memakai SwiftShader (software WebGL2), bukan GPU desktop.

## Hasil

- Build produksi berhasil. Bundle JS sekitar 5 MB mentah / 1.84 MB gzip; Vite memberi peringatan ukuran bundle, bukan kegagalan.
- Tes Rapier lulus: ground detection, tembok, ketinggian lompat, dan mendarat.
- 22 pemeriksaan browser produksi lulus: menu Miko dan dua karakter; intro 108 detik; jeda/lanjut cerita; seluruh 12 bagian cerita dan transisi bermain; subtitle/replay/skip; berjalan/lari; lompat/mendarat; tembok; ramp; kamera orbit/zoom; enam jenis interaksi; sapaan ke kedua karakter; pause gameplay; efek High/Medium/Low, volume, sensitivitas dan fullscreen; menu di empat viewport; persistensi pengaturan/status intro; tanpa error browser atau kegagalan aset.
- Ukuran layout: 1920×866, 1366×650, 390×844, 800×450.
- High benar-benar dirender dengan SSAO dan bloom. Screenshot menu, adegan Raina, dan permainan ditinjau. Kamera menu dan lokasi tas kucing diperbaiki setelah pemeriksaan pertama.
- Alur 108 detik diuji dengan memajukan waktu secara deterministik melalui semua beat, bukan klaim menonton 108 detik secara real-time. Input keyboard, mouse, dan tombol juga diuji melalui browser.

## Batas pengujian

Software rendering cloud lambat dan tidak mewakili FPS hardware pengguna. Tidak ada klaim 60 FPS pada GPU desktop atau kualitas setara Unreal Engine 5. Windows asli, rekaman suara manusia, dan deployment publik tidak diuji/tidak tersedia. Musik menggunakan Web Audio asli; dialog saat ini berupa subtitle.
