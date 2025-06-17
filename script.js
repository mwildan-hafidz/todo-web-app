let dataTugas = [];
let tugasDipilih = null;

// Memuat data sesi.
document.addEventListener('DOMContentLoaded', function () {
    const sessionData = sessionStorage.getItem('dataTugas');
    if (!sessionData) return;

    dataTugas = JSON.parse(sessionData);
    updateTugas();
});

const inputTugas = document.getElementById('input-tugas');
const tblTambah = document.querySelector('.tbl-tambah');

inputTugas.addEventListener('keypress', function (e) {
    if (e.key !== 'Enter') return;
        
    e.preventDefault();
    tblTambah.click();
});

tblTambah.addEventListener('click', function () {
    if (inputTugas.value == '') return;
    
    dataTugas.push({
        isi: inputTugas.value,
        cek: false
    });
    updateTugas();
    
    inputTugas.value = '';
});

document.body.addEventListener('click', function (e) {
    // Tombol cek.
    if (e.target.classList.contains('tbl-cek')) {   
        const tugas = e.target.closest('.tugas');
        const data = dataTugas[tugas.dataset.index];
        data.cek = !data.cek;
        
        updateTugas();
        return;
    }

    // Tombol hapus.
    if (e.target.classList.contains('tbl-hapus')) {
        tugasDipilih = e.target.closest('.tugas');
        showModal();
        return;
    }
});

const tblLanjut = document.querySelector('.tbl-lanjut');
const tblTidak = document.querySelector('.tbl-tidak');

tblLanjut.addEventListener('click', function () {
    hapusTugas(tugasDipilih);
    tugasDipilih = null;

    hideModal();
    updateTugas();
});

tblTidak.addEventListener('click', function () {
    hideModal();
});

const tblSimpan = document.querySelector('.tbl-simpan');
tblSimpan.addEventListener('click', function () {
    const saveJSON = JSON.stringify(dataTugas);
    const file = new Blob([saveJSON], {type: 'text/plain'});

    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = `${getTanggal()}.json`;
    a.click();
});

// Functions.

const containerTugas = document.querySelector('.container-tugas');

function updateTugas() {
    saveToSession();
    resetTugas();
    
    dataTugas.forEach(function (tugas, index) {
        containerTugas.innerHTML += 
        `<li class="tugas ${tugas.cek ? 'cek' : ''}" data-index="${index}">
            <div>
                <button class="tbl-cek">Cek</button>
                <p>${tugas.isi}</p>
            </div>
            <button class="tbl-hapus">Hapus</button>
        </li>`;
    });
}

function resetTugas() {
    containerTugas.innerHTML = '';
}

function hapusTugas(tugas) {
    dataTugas.splice(tugas.dataset.index, 1);
}

const modal = document.querySelector('.container-modal');

function showModal() {
    modal.style.display = 'flex';
}

function hideModal() {
    modal.style.display = 'none';
}

function getTanggal() {
    function pad(n) {
        return n.toString().padStart(2, '0');
    }
    
    const tgl = new Date();

    let tglString = '';
    tglString += `${tgl.getFullYear()}`;
    tglString += `${pad(tgl.getMonth() + 1)}`;
    tglString += `${pad(tgl.getDate())}`;
    tglString += '_';
    tglString += `${pad(tgl.getHours())}`;
    tglString += `${pad(tgl.getMinutes())}`;
    tglString += `${pad(tgl.getSeconds())}`;

    return tglString;
}

function saveToSession() {
    sessionStorage.setItem('dataTugas', JSON.stringify(dataTugas));
}