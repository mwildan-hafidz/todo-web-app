let dataTugas = [];
let tugasDipilih = null;

// Memuat data sesi.
document.addEventListener('DOMContentLoaded', function () {
    const sessionData = sessionStorage.getItem('dataTugas');
    if (!sessionData) return;
    muatData(sessionData);
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

const tblUrutNama = document.querySelector('.tbl-urut-nama');
const tblUrutCek = document.querySelector('.tbl-urut-cek');
let urutNamaAsc;
let urutCekAsc;

tblUrutNama.onclick = function () {
    switch (urutNamaAsc) {
        case false:
            dataTugas.sort((x, y) => y.isi.localeCompare(x.isi));
            urutNamaAsc = true;
            break;
            
        default:
            dataTugas.sort((x, y) => x.isi.localeCompare(y.isi));
            urutNamaAsc = false;
            break;
    }
        updateTugas();
};

tblUrutCek.onclick = function () {
    switch (urutCekAsc) {
        case false:
            dataTugas.sort((x, y) => Number(y.cek) - Number(x.cek));
            urutCekAsc = true;
            break;
            
        default:
            dataTugas.sort((x, y) => Number(x.cek) - Number(y.cek));
            urutCekAsc = false;
            break;
    }
        updateTugas();
};

document.body.addEventListener('click', function (e) {
    // Tombol cek.
    if (e.target.classList.contains('tbl-cek')) {   
        const tugas = e.target.closest('.tugas');
        const data = dataTugas[tugas.dataset.index];
        data.cek = !data.cek;
        
        updateTugas();
        return;
    }

    // Tombol edit.
    if (e.target.classList.contains('tbl-edit')) {
        const tugas = e.target.closest('.tugas');
        const data = dataTugas[tugas.dataset.index];
        const inputEdit = tugas.querySelector('.input-edit');
        const p = tugas.querySelector('p');
        
        p.style.display = 'none';
        inputEdit.style.display = 'block';
        
        inputEdit.value = `${data.isi}`;
        inputEdit.focus();
        
        inputEdit.onblur = function () {
            inputEdit.value = '';
            
            p.style.display = 'block';
            inputEdit.style.display = 'none';
        }

        inputEdit.onkeypress = function (e) {
            if (e.key !== 'Enter') return;

            data.isi = inputEdit.value;
            updateTugas();
        }
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

const inputFile = document.querySelector('#input-file')
const tblMuat = document.querySelector('.tbl-muat');
const tblSimpan = document.querySelector('.tbl-simpan');

tblMuat.addEventListener('click', function () {
    inputFile.click();
});

inputFile.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            muatData(e.target.result);
        }
        catch {
            alert('File tidak valid.');
        }
    }
    reader.readAsText(file);

    this.value = '';
});

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

    updateUrut();
    
    dataTugas.forEach(function (tugas, index) {
        containerTugas.innerHTML += 
        `<li class="tugas ${tugas.cek ? 'cek' : ''}" data-index="${index}">
        <button class="tbl-cek">Cek</button>
        <p>${tugas.isi}</p>
        <input type="text" class="input-edit" name="input-edit" style="display: none;">
            <button class="tbl-edit">Edit</button>
            <button class="tbl-hapus">Hapus</button>
        </li>`;
    });
}

const containerUrut = document.querySelector('.container-urut');
function updateUrut() {
    if (dataTugas.length !== 0) {
        containerUrut.style.display = 'flex';
    }
    else {
        containerUrut.style.display = 'none';
    }
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

function muatData(json) {
    const data = JSON.parse(json);
    dataTugas = data;

    updateTugas();
}