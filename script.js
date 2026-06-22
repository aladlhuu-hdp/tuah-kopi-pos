// ==========================================================================
// 1. DATA MASTER
// ==========================================================================
const menus = [
    { id: 1, nama: "Kopi Susu Single Shot", harga: 10000 },
    { id: 2, nama: "Kopi Susu Double Shot", harga: 13000 },
    { id: 3, nama: "Kopi Susu Triple Shot", harga: 16000 },
    { id: 4, nama: "Caramel", harga: 13000 },
    { id: 5, nama: "Vanila", harga: 15000 },
    { id: 6, nama: "Kopi Susu Gula Aren", harga: 12000 },
    { id: 7, nama: "Americano", harga: 10000 },
    { id: 8, nama: "Cream Cheese", harga: 16000 },
    { id: 9, nama: "Butterscotch", harga: 13000 },
    { id: 10, nama: "Matcha", harga: 15000 }
];

const cabangs = [
    { nama: "Seberang Gedung LAM Bintan Kijang", jamFormat: "11.00 - 19.00", buka: 11, tutup: 19 },
    { nama: "Depan Kampus STIE Tanjungpinang", jamFormat: "08.00 - 01.00", buka: 8, tutup: 1 },
    { nama: "Jl. Wisata Bahari, Kawal", jamFormat: "09.00 - 01.00", buka: 9, tutup: 1 },
    { nama: "Jl. Bandara Ganet", jamFormat: "10.00 - 01.00", buka: 10, tutup: 1 }
];

const EXTRA_SHOT_PRICE = 4000;
const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

// ==========================================================================
// 2. ANIMASI SCROLL (HALAMAN PUBLIK)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animasi hanya berjalan 1x
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(section => observer.observe(section));
});

// ==========================================================================
// 3. LOGIKA HALAMAN PUBLIK (index.html)
// ==========================================================================
if (document.getElementById('public-page')) {
    const cabangContainer = document.getElementById('publicCabangContainer');
    if(cabangContainer) {
        cabangContainer.innerHTML = ''; 
        const jamSekarang = new Date().getHours();

        cabangs.forEach(cabang => {
            let isOpen = false;
            if (cabang.buka > cabang.tutup) {
                if (jamSekarang >= cabang.buka || jamSekarang < cabang.tutup) isOpen = true;
            } else {
                if (jamSekarang >= cabang.buka && jamSekarang < cabang.tutup) isOpen = true;
            }

            const statusClass = isOpen ? 'status-open' : 'status-closed';
            const statusText = isOpen ? 'Buka Sekarang' : 'Tutup';

            cabangContainer.innerHTML += `
                <div class="outlet-card">
                    <div class="outlet-header">
                        <div class="outlet-title">
                            <svg class="outlet-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3>${cabang.nama}</h3>
                        </div>
                        <div class="status-badge ${statusClass}">
                            <div class="status-dot"></div>
                            <span>${statusText}</span>
                        </div>
                    </div>
                    <div class="outlet-body">
                        <svg class="outlet-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="outlet-time">
                            <span class="time-label">Jam Operasional</span>
                            <span class="time-value">${cabang.jamFormat}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// ==========================================================================
// 4. AUTENTIKASI (LOGIN & LOGOUT)
// ==========================================================================
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const isAdminPage = document.getElementById('admin-page');

if (isAdminPage && localStorage.getItem('tuahKopiLogin') !== 'true') window.location.href = 'login.html';
if (loginForm && localStorage.getItem('tuahKopiLogin') === 'true') window.location.href = 'admin.html';

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (user === 'admin' && pass === 'admin123') {
            localStorage.setItem('tuahKopiLogin', 'true');
            window.location.href = 'admin.html';
        } else {
            alert('Username atau password salah!');
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', function() {
        localStorage.removeItem('tuahKopiLogin');
        window.location.href = 'login.html';
    });
}

// ==========================================================================
// 5. LOGIKA HALAMAN ADMIN & KASIR (admin.html)
// ==========================================================================
if (isAdminPage) {
    let transaksiData = JSON.parse(localStorage.getItem('tuahKopiTrx')) || [];
    let salesChartInstance = null;

    // A. SISTEM TAB MENU ADMIN (Agar tidak numpuk)
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const target = this.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            if (target === 'dashboard') renderDashboard();
            if (target === 'riwayat') renderRiwayat();
            if (target === 'laporan') renderLaporan();
        });
    });

    // B. LOGIKA FORM KASIR
    const selectMenu = document.getElementById('pilihMenu');
    if(selectMenu) {
        menus.forEach(menu => {
            selectMenu.innerHTML += `<option value="${menu.id}">${menu.nama}</option>`;
        });
    }

    const inputJumlah = document.getElementById('jumlah');
    const inputExtra = document.getElementById('extraShot');
    
    const hitungTotalKasir = () => {
        if(!selectMenu) return 0;
        const menuId = parseInt(selectMenu.value);
        if (!menuId) {
            document.getElementById('hargaSatuan').value = "Rp0";
            document.getElementById('totalBayar').innerText = "Rp0";
            return 0;
        }

        const menu = menus.find(m => m.id === menuId);
        document.getElementById('hargaSatuan').value = formatRp(menu.harga);

        let total = menu.harga;
        if (inputExtra && inputExtra.checked) total += EXTRA_SHOT_PRICE;
        total *= parseInt(inputJumlah.value) || 0;

        document.getElementById('totalBayar').innerText = formatRp(total);
        return total;
    };

    if(selectMenu) selectMenu.addEventListener('change', hitungTotalKasir);
    if(inputJumlah) inputJumlah.addEventListener('input', hitungTotalKasir);
    if(inputExtra) inputExtra.addEventListener('change', hitungTotalKasir);

    const formKasir = document.getElementById('formKasir');
    if(formKasir) {
        formKasir.addEventListener('submit', function(e) {
            e.preventDefault();
            const menuId = parseInt(selectMenu.value);
            if (!menuId) return alert("Pilih menu terlebih dahulu!");

            const menu = menus.find(m => m.id === menuId);
            const qty = parseInt(inputJumlah.value);
            const total = hitungTotalKasir();

            const trx = {
                id: Date.now(),
                tanggal: new Date().toLocaleString('id-ID'),
                menu: menu.nama,
                harga: menu.harga,
                addon: inputExtra.checked ? "Extra Shot" : "-",
                qty: qty,
                metode: document.getElementById('metode').value,
                total: total
            };

            transaksiData.push(trx);
            localStorage.setItem('tuahKopiTrx', JSON.stringify(transaksiData));
            alert("Transaksi berhasil disimpan!");
            this.reset();
            hitungTotalKasir();
            renderDashboard();
        });
    }

    window.hapusTransaksi = function(id) {
        if(confirm("Hapus transaksi ini?")) {
            transaksiData = transaksiData.filter(t => t.id !== id);
            localStorage.setItem('tuahKopiTrx', JSON.stringify(transaksiData));
            renderRiwayat();
            renderDashboard();
        }
    };

    // C. RENDER TABEL RIWAYAT
    function renderRiwayat() {
        const tbody = document.getElementById('tabelRiwayat');
        if(!tbody) return;
        tbody.innerHTML = '';
        if (transaksiData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada transaksi</td></tr>`;
            return;
        }
        transaksiData.slice().reverse().forEach(t => {
            tbody.innerHTML += `
                <tr>
                    <td>${t.tanggal}</td>
                    <td>${t.menu}</td>
                    <td>${t.addon}</td>
                    <td>${formatRp(t.harga)}</td>
                    <td>${t.qty}</td>
                    <td>${formatRp(t.total)}</td>
                    <td>${t.metode}</td>
                    <td><button class="btn-danger" onclick="hapusTransaksi(${t.id})">Hapus</button></td>
                </tr>
            `;
        });
    }

    function getAnalytics() {
        let pendapatan = 0, cash = 0, qris = 0;
        let menuCount = {};
        let menuRevenue = {};

        menus.forEach(m => { menuCount[m.nama] = 0; menuRevenue[m.nama] = 0; });

        transaksiData.forEach(t => {
            pendapatan += t.total;
            t.metode === "Cash" ? cash++ : qris++;
            if(menuCount[t.menu] !== undefined) {
                menuCount[t.menu] += t.qty;
                menuRevenue[t.menu] += t.total;
            }
        });

        let terlaris = "-";
        let maxQty = 0;
        for (let m in menuCount) {
            if (menuCount[m] > maxQty) {
                maxQty = menuCount[m];
                terlaris = m;
            }
        }

        const rataRata = transaksiData.length > 0 ? (pendapatan / transaksiData.length) : 0;
        return { pendapatan, trxCount: transaksiData.length, terlaris, rataRata, cash, qris, menuCount, menuRevenue };
    }

    function renderDashboard() {
        const d = getAnalytics();
        const dashPend = document.getElementById('dashPendapatan');
        if(dashPend) dashPend.innerText = formatRp(d.pendapatan);
        
        const dashTrx = document.getElementById('dashTotalTrx');
        if(dashTrx) dashTrx.innerText = d.trxCount;
        
        const dashLaris = document.getElementById('dashTerlaris');
        if(dashLaris) dashLaris.innerText = d.terlaris;
        
        const dashRata = document.getElementById('dashRataRata');
        if(dashRata) dashRata.innerText = formatRp(d.rataRata);
    }

    // D. RENDER LAPORAN & CHART.JS
    function renderLaporan() {
        const d = getAnalytics();
        const lapCash = document.getElementById('lapCash');
        if(lapCash) lapCash.innerText = d.cash + " Transaksi";
        
        const lapQris = document.getElementById('lapQris');
        if(lapQris) lapQris.innerText = d.qris + " Transaksi";

        const tbody = document.getElementById('tabelLaporan');
        if(tbody) {
            tbody.innerHTML = '';
            for (let m in d.menuCount) {
                tbody.innerHTML += `
                    <tr>
                        <td>${m}</td>
                        <td>${d.menuCount[m]} Cup</td>
                        <td>${formatRp(d.menuRevenue[m])}</td>
                    </tr>
                `;
            }
        }

        const canvas = document.getElementById('salesChart');
        if(canvas) {
            const ctx = canvas.getContext('2d');
            if (salesChartInstance) salesChartInstance.destroy();

            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#6B7280';

            salesChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(d.menuCount),
                    datasets: [{
                        label: 'Terjual',
                        data: Object.values(d.menuCount),
                        backgroundColor: '#8B5E3C', 
                        hoverBackgroundColor: '#5C3B28', 
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.4, 
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#111827',
                            padding: 12,
                            titleFont: { size: 13, weight: 'normal', family: 'Inter' },
                            bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
                            displayColors: false,
                            cornerRadius: 8,
                            callbacks: { label: function(context) { return context.parsed.y + ' Cup Terjual'; } }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            border: { display: false }, 
                            grid: { color: '#E5E7EB', drawTicks: false, borderDash: [5, 5] },
                            ticks: { padding: 10, stepSize: 1 }
                        },
                        x: {
                            border: { display: false }, 
                            grid: { display: false, drawTicks: false },
                            ticks: { padding: 10, maxRotation: 45, minRotation: 0 }
                        }
                    }
                }
            });
        }
    }

    // E. EXPORT PDF VEKTOR (HIGH QUALITY)
    const btnExportPdf = document.getElementById('btnExportPdf');
    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', function() {
            const d = getAnalytics();
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses PDF...';
            this.disabled = true;

            setTimeout(() => {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF('landscape', 'pt', 'A4');

                    // KOP SURAT
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(22);
                    doc.setTextColor(43, 33, 24);
                    doc.text("Laporan Penjualan - Tuah Kopi", 40, 50);

                    // INFO STATISTIK
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(12);
                    doc.setTextColor(107, 114, 128);
                    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 40, 75);
                    
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(43, 33, 24);
                    doc.text(`Total Pendapatan: ${formatRp(d.pendapatan)}`, 40, 95);
                    doc.text(`Total Transaksi: ${d.trxCount} Transaksi`, 40, 115);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Metode Pembayaran -> Cash: ${d.cash} | QRIS: ${d.qris}`, 40, 135);

                    // RENDER GAMBAR GRAFIK
                    const canvas = document.getElementById('salesChart');
                    if(canvas) {
                        const chartImg = canvas.toDataURL("image/png", 1.0);
                        doc.addImage(chartImg, 'PNG', 40, 160, 760, 200);
                    }

                    // RENDER TABEL VEKTOR
                    const tableData = [];
                    for (let m in d.menuCount) {
                        tableData.push([m, `${d.menuCount[m]} Cup`, formatRp(d.menuRevenue[m])]);
                    }

                    doc.autoTable({
                        startY: 390,
                        head: [['NAMA MENU', 'TOTAL CUP TERJUAL', 'TOTAL PENDAPATAN']],
                        body: tableData,
                        theme: 'grid',
                        headStyles: { fillColor: [139, 94, 60], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                        styles: { font: 'helvetica', fontSize: 11, textColor: [43, 33, 24], cellPadding: 8 },
                        alternateRowStyles: { fillColor: [249, 250, 251] }
                    });

                    doc.save('Laporan_Penjualan_Tuah_Kopi.pdf');
                } catch(err) {
                    console.error(err);
                    alert("Terjadi kesalahan saat membuat PDF.");
                } finally {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }
            }, 300);
        });
    }

    // Jalankan dashboard
    renderDashboard();
}