document.addEventListener("DOMContentLoaded", function() {
    const harga = {
        1: 50, 2: 30, 3: 20, 10: 10, 20: 15
    };

    const jumlah = Object.fromEntries(Object.keys(harga).map(id => [id, 0]));

    const namaMenu = {
        1: "Nasi Goreng", 2: "Ayam Bakar", 3: "Soto Ayam",
        10: "Krupuk", 20: "Es Teh"
    };

    const whatsappNumber = "6285370883257"; 
    const telegramUsername = "safira995";
    const sheetURL = "https://script.google.com/macros/s/AKfycbx3WtX6_fZ8fYURL8PZaVeftaKvug2TQPlZgrbKsyD2VknGskHgtl7ZemCRc33iaeST/exec"; 

    function updateTampilan() {
        let totalHarga = Object.keys(jumlah).reduce((total, id) => {
            document.getElementById("jumlah" + id).innerText = jumlah[id];
            return total + jumlah[id] * harga[id];
        }, 0);

        document.getElementById("total").innerText = totalHarga.toLocaleString('id-ID', { style: 'currency', currency: 'THB' });
    }

    window.tambah = function(id) {
        jumlah[id]++;
        updateTampilan();
    };

    window.kurangi = function(id) {
        if (jumlah[id] > 0) {
            jumlah[id]--;
            updateTampilan();
        }
    };

    window.pesan = function(platform) {
        const alamat = document.getElementById("alamat").value.trim();
        const nomor = document.getElementById("nomor").value.trim();
        const telegramID = document.getElementById("telegram").value.trim();

        if (!alamat) {
            alert("Masukkan alamat pengiriman!");
            return;
        }

        if (!nomor && !telegramID) {
            alert("Masukkan nomor WhatsApp atau ID Telegram!");
            return;
        }

        const pesananList = Object.keys(jumlah)
            .filter(id => jumlah[id] > 0)
            .map(id => `${jumlah[id]}x ${namaMenu[id]} (฿ ${harga[id].toLocaleString()})`)
            .join("\n");

        if (!pesananList) {
            alert("Pilih minimal satu menu sebelum memesan!");
            return;
        }

        const totalHarga = Object.keys(jumlah).reduce((total, id) => total + jumlah[id] * harga[id], 0);
        const message = `Halo, saya ingin memesan:\n${pesananList}\n\nTotal: ฿ ${totalHarga.toLocaleString()}\nAlamat: ${alamat}\n\nNomor WhatsApp: ${nomor || "-"}\nID Telegram: ${telegramID || "-"}`;

        const data = {
            nama: "Pelanggan", 
            alamat: alamat,
            nomor: nomor || "-",
            telegram: telegramID || "-",
            pesanan: pesananList,
            total: totalHarga,
            platform: platform
        };

        fetch(sheetURL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (platform === "whatsapp") {
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappURL;
        } else if (platform === "telegram") {
            const telegramURL = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
            window.location.href = telegramURL;
        } else {
            alert("Platform tidak dikenal.");
        }
    };

    window.reset = function() {
        Object.keys(jumlah).forEach(id => jumlah[id] = 0);
        updateTampilan();
    };

    window.tampilkanKategori = function(kategori) {
        document.getElementById("menu-makanan").style.display = "none";
        document.getElementById("menu-cemilan").style.display = "none";
        document.getElementById("menu-minuman").style.display = "none";

        if (kategori === 'makanan') {
            document.getElementById("menu-makanan").style.display = "block";
        } else if (kategori === 'cemilan') {
            document.getElementById("menu-cemilan").style.display = "block";
        } else if (kategori === 'minuman') {
            document.getElementById("menu-minuman").style.display = "block";
        }
    };

    updateTampilan();
});
