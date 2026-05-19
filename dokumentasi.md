# Dokumentasi Pembangunan Website Portofolio Kelompok

Website ini merupakan proyek portofolio bertema **Cyberpunk** yang dibangun menggunakan React, Vite, dan Vanilla CSS. Dokumentasi ini merinci panduan langkah demi langkah serta contoh *prompt* AI yang digunakan untuk menyusun kode proyek ini.

---

## 🤖 Panduan dan Prompt AI

Berikut adalah daftar *prompt* yang digunakan untuk membangun situs web dari awal hingga tahap akhir:

### Langkah 1: Persiapan dan Setup Proyek
Gunakan prompt berikut untuk meminta AI membuatkan struktur awal proyek.

> **Prompt:**
> "Buatkan saya setup awal untuk website portofolio kelompok menggunakan React dan Vite. Saya ingin menggunakan Vanilla CSS (tanpa Tailwind) dengan tema Cyberpunk yang kuat (warna neon, dark mode, glassmorphism). Tolong berikan struktur folder yang baik untuk komponen, aset, dan konstanta data."

### Langkah 2: Mengelola Data Kelompok (Constants)
Buat file khusus untuk menyimpan data agar mudah diubah.

> **Prompt:**
> "Buatkan file `src/constants/index.js` yang berisi data tentang kelompok kami. Data ini mencakup nama kelompok (Tim 7), deskripsi, informasi sekolah (SMK RAJASA, jurusan TKJ), serta array objek untuk data setiap anggota tim (nama, role, kelas, foto, dan link sosial media/github)."

### Langkah 3: Membuat Desain Tema Cyberpunk (CSS)
Minta AI untuk membuat sistem desain CSS yang menakjubkan.

> **Prompt:**
> "Tuliskan kode untuk `index.css` yang mengimplementasikan tema Cyberpunk. Gunakan font modern (seperti Inter atau Roboto), warna background gelap yang elegan, aksen neon (cyan, magenta, ungu), efek glow pada teks dan kotak, serta animasi halus (micro-animations) saat kursor diarahkan ke elemen. Buat agar desainnya terlihat premium dan responsif."

### Langkah 4: Membuat Komponen UI
Minta AI untuk memecah UI menjadi komponen-komponen yang dapat digunakan kembali.

> **Prompt:**
> "Berdasarkan data di `constants/index.js`, buatkan komponen React untuk:
> 1. **Hero Section**: Menampilkan nama kelompok dan tagline dengan efek animasi mengetik atau glitch.
> 2. **About Section**: Menampilkan informasi sekolah SMK RAJASA dan jurusan kami.
> 3. **Team Section**: Menampilkan kartu (card) untuk setiap anggota kelompok yang berisi foto, nama, role, kelas, dan link ke GitHub masing-masing menggunakan desain glassmorphism.
> Pastikan semua komponen menggunakan class CSS yang telah dibuat di `index.css`."

### Langkah 5: Menggabungkan Komponen di App.jsx
> **Prompt:**
> "Gabungkan semua komponen (Hero, About, Team) ke dalam `App.jsx`. Tambahkan juga Navbar yang menempel di atas (sticky) dan Footer sederhana. Pastikan halamannya bisa di-scroll dengan mulus (smooth scrolling)."

### Langkah 6: Revisi dan Perbaikan (Debugging)
Jika ada bagian yang perlu disesuaikan (misal merubah nama sekolah atau layout).

> **Prompt:**
> "Tolong ubah nama sekolah di bagian About dari 'SMK RAJASA' menjadi 'SMK RAJASA'. Selain itu, tolong perbaiki bagian kartu anggota agar teksnya tidak keluar dari kotak saat dilihat di layar HP."

---
*Dibuat oleh Tim 7 - SMK RAJASA*
