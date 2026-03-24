function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        fechaDeHoy: decodeURIComponent(urlParams.get('fechaDeHoy') || ''),
        descripcionP: decodeURIComponent(urlParams.get('descripcionP') || ''),
        codigoP: decodeURIComponent(urlParams.get('codigoP') || ''),
        precioV: decodeURIComponent(urlParams.get('precioV') || ''),
        existencias: decodeURIComponent(urlParams.get('existencias') || ''),
        idImagenP: decodeURIComponent(urlParams.get('idImagenP') || '')
    };
}

function setValues() {
    const params = getUrlParameters();

    document.getElementById("fechaDeHoy").textContent = formatDate(params.fechaDeHoy);
    document.getElementById("descripcionP").textContent = params.descripcionP;
    document.getElementById("codigoP").textContent = params.codigoP;
    document.getElementById("precioV").textContent = params.precioV;
    document.getElementById("existencias").textContent = params.existencias;

    if (params.idImagenP) {
        document.querySelector('.imagenP img').src =
            `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
    }

    document.querySelector('.codigo_qr img').src = 'wesito.png';
}

// 🔥 EXPORTAR A PNG
function printDocument() {
    const element = document.getElementById('printArea');
    const button = document.querySelector('.print-button-container');

    button.style.display = 'none';

    html2canvas(element, {
        scale: 2,
        useCORS: true
    }).then(canvas => {

        button.style.display = 'block';

        const link = document.createElement('a');
        link.download = 'catalogo_producto.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

window.onload = function () {
    setValues();

    document
        .querySelector('.print-button')
        .addEventListener('click', printDocument);
};
