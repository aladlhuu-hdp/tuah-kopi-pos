# Tuah Kopi POS System (Admin Dashboard)

Aplikasi *Point of Sales* (POS) modern, ringan, dan *offline-first* yang dikembangkan khusus untuk operasional kedai kopi  **Tuah Kopi Indonesia** . Sistem ini dirancang untuk kemudahan manajemen transaksi harian dan pelaporan penjualan secara  *real-time* .

## Fitur Utama

* **Sistem Kasir Offline-First:** Pencatatan transaksi cepat yang tersimpan langsung di browser ( *localStorage* ), sehingga tetap berfungsi stabil meski tanpa koneksi internet.
* **Modern Admin Dashboard:** Tampilan dasbor yang bersih dan responsif, memudahkan pemilik toko memantau pendapatan, total transaksi, hingga menu terlaris.
* **Visualisasi Data:** Laporan penjualan interaktif menggunakan *Chart.js* untuk melihat performa menu secara visual.
* **Export PDF Profesional:** Fitur unduh laporan penjualan dalam format PDF berbasis vektor (kualitas tinggi dan tajam) menggunakan *jsPDF* &  *AutoTable* .
* **Mobile Responsive:** Desain UI/UX yang telah dioptimasi untuk berbagai perangkat, dari layar desktop hingga smartphone kasir.

## Teknologi yang Digunakan

* **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid Layout).
* **Programming Logic:** Vanilla JavaScript (ES6+).
* **Data Persistence:** Browser LocalStorage.
* **Libraries & Plugins:**
  * [Chart.js](https://www.chartjs.org/) (Data Visualization)
  * [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (Vector PDF Generation)
  * [FontAwesome](https://fontawesome.com/) (Icons)
  * [Google Fonts](https://fonts.google.com/?authuser=2) (Inter & Roboto Mono)

## Struktur Project

**Plaintext**

```
/tuahkopi
├── index.html        # Landing page (Publik)
├── admin.html        # Halaman Admin Panel
├── login.html        # Halaman Login Admin
├── style.css         # Styling sistem (SaaS-like aesthetic)
└── script.js         # Logika utama (Auth, CRUD Transaksi, Chart & PDF)
```

## Catatan Pengembangan

Sistem ini dikembangkan dengan filosofi  **"Lightweight & Efficient"** . Dengan tidak menggunakan *backend* atau *database* server, aplikasi ini menawarkan kecepatan akses instan. Data transaksi tetap terjaga secara lokal di perangkat kasir, menjadikannya solusi ideal untuk UMKM yang mengutamakan efisiensi operasional.

### Cara Menjalankan

1. *Clone* atau download *repository* ini.
2. Buka folder di *code editor* (seperti VS Code).
3. Jalankan menggunakan *extension* **"Live Server"** agar sistem bekerja secara optimal.

*Project UAS - Praktikum Perancangan Web 2026*
