# Archimedean & Equiangular Spiral Antenna 3D Simulator
> **EL234504 Antena & Propagasi Radio**  
> Departemen Teknik Elektro — Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)  
> **Institut Teknologi Sepuluh Nopember (ITS) Surabaya**  
> **Kelompok VI** — Rancang Bangun Antena Penerima Siaran TV Broadcast DVB-T2 Kanal 44 UHF (658 MHz)

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.187-black?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Design-shadcn%2Fui-000000)](https://ui.shadcn.com/)

---

## 📡 Ringkasan Proyek

Simulator interaktif 3D berbasis WebGL ini dirancang secara presisi untuk memodelkan, memvalidasi ukuran geometris, serta mensimulasikan penerapan nyata (*real case*) **Antena Spiral Archimedes & Equiangular Dua Lengan** yang terhubung langsung ke perangkat televisi digital DVB-T2.

### Spesifikasi Alokasi Tugas Kelompok VI
- **Frekuensi Resonansi ($f_0$)**: $658\text{ MHz}$ (Kanal 44 UHF)
- **Panjang Gelombang ($\lambda$)**: $45.56\text{ cm}$
- **Cincin Radiasi Aktif ($r_{active}$)**: $7.25\text{ cm}$ (Diameter aktif $14.50\text{ cm}$)
- **Grup Siaran TV**: MUX TransMedia (*Trans TV HD, Trans7 HD, CNN Indonesia HD, CNBC Indonesia HD*)
- **Pencatuan**: Saluran Koaksial 75 $\Omega$ (RG-6) dipadu dengan **Sleeve Balun $\lambda/4$** ($\approx 11.4\text{ cm}$) mengacu pada **ARRL Handbook 2019 Fig 20.18 (B)** untuk transformasi seimbang ke tidak seimbang (*balanced-to-unbalanced*).
- **Konektor**: F-Connector RG-6 (ulir drat nikel) & Jack Antena TV IEC 169-2 Male (Belling-Lee RF plug) yang terhubung ke port RF TV.

---

## 🛠️ Fitur Utama Aplikasi

1. **Formulasi Matematis Spiral Archimedes & Equiangular Presisi (Satuan cm)**:
   - $r(\theta) = r_{in} + b \cdot \theta$ dengan $b = \frac{w + s}{2\pi}$.
   - Kondisi *Self-Complementary* ($w = s = 1.0\text{ cm}$) menghasilkan impedansi input $Z_{in} \approx 188.5\ \Omega$ di ruang bebas.
2. **Koneksi Fisik Nyata Lengkap ke Smart TV 3D**:
   - Kabel koaksial RG-6 lentur melengkung 3D (`TubeGeometry` + `CatmullRomCurve3`) yang menghubungkan titik umpan spiral langsung ke port TV di atas meja lab.
   - Layar TV aktif dinamis dengan siaran langsung DVB-T2 resolusi 1080p FHD, logo stasiun, meteran SNR, dan *breaking news ticker*.
3. **Bongkar Pasang Perangkat (Modular Assembly & Exploded View)**:
   - Setiap komponen fisik (Pita Foil, Papan Akrilik, Balun $\lambda/4$, Kabel RG-6, F-Connector, Jack TV, dan Unit TV) dapat dipasang/dilepas secara independen.
   - Slider *Pandangan Terurai* (0% - 100%) memisahkan komponen di sepanjang sumbu Z untuk demonstrasi visual perakitan.
4. **Preset Sudut Pandang Kamera Simetris**:
   - `Isometrik 3D`: Sudut isometrik proporsional yang membingkai antena, kabel, dan TV.
   - `Antena & TV`: Tampilan utuh kedua perangkat saat pengujian siaran.
   - `Tampak Atas (2D)`: Pandangan tegak lurus untuk verifikasi pola lilitan spiral 2D.
   - `Tampak Samping`: Inspeksi profil ketebalan board, balun, dan kaki TV.
5. **Ekspor Gambar Multi-Format (PNG & JPG)**:
   - Unduh hasil tangkapan layar kanvas 3D dalam format PNG (transparan/jernih) atau JPG (solid studio 96%).
6. **Mal Cetak 1:1 Skala Nyata (Printable SVG)**:
   - Unduh template mal pola potong foil skala 1:1 dalam satuan centimeter untuk pemotongan aluminium foil tape presisi.
7. **Layar Monitor DVB-T2 & Generator Laporan Proyek**:
   - Simulasi penerima TV digital dengan pengalih kanal UHF se-Surabaya, pengukuran level sinyal RF, SNR, dan BER.
   - Generator draf laporan Bab I s.d. Bab VI lengkap dengan lembar observasi lapangan dalam format Markdown / CSV.

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js (v18.x atau lebih baru)
- npm / pnpm / yarn

### Instalasi & Menjalankan Dev Server
```bash
# Clone repositori
git clone https://github.com/shuuyaaa/proyekAntenaPropagasi.git
cd proyekAntenaPropagasi

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```
Buka browser pada tautan `http://localhost:5173`.

### Build untuk Produksi
```bash
npm run build
```
File hasil build statis akan berada di direktori `dist/`.

---

## 🚀 Panduan Deployment ke Vercel

Aplikasi ini dapat di-deploy secara instan ke [Vercel](https://vercel.com/) sebagai Web App Publik:

### Cara 1: Melalui Dashboard Vercel (Rekomendasi)
1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Pilih **Import Git Repository** dan pilih repositori `shuuyaaa/proyekAntenaPropagasi`.
3. Vercel akan otomatis mendeteksi:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Klik **Deploy**. Website Anda akan langsung aktif dengan domain publik gratis `*.vercel.app`!

### Cara 2: Menggunakan Vercel CLI
```bash
# Instal Vercel CLI
npm i -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke Vercel (Public)
vercel --prod
```

---

## 📚 Anggota Kelompok VI
- **Departemen**: Teknik Elektro FTEIC ITS
- **Mata Kuliah**: EL234504 Antena & Propagasi Radio
- **Topik Tugas**: Rancang Bangun Antena Dua Lengan Spiral Archimedes Penerima TV Broadcast DVB-T2 Kanal 44 UHF (658 MHz)
