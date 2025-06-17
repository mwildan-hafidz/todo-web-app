// To do:
// + Buat file simpan menjadi yyyymmdd_hhmmss.json.
// + Simpan data per sesi.

let dataTugas = [];
let tugasDipilih = null;

// Tombol tambah.
const tblTambah = document.querySelector('.tbl-tambah');
tblTambah.addEventListener('click', function () {
    const inputTugas = document.getElementById('input-tugas');

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
    a.download = 'save.json';
    a.click();
})

// Functions.

const containerTugas = document.querySelector('.container-tugas');

function updateTugas() {
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