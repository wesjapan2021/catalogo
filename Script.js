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
        const img = document.querySelector('.imagenP img');

        // 🔥 IMPORTANTE: usar proxy limpio para evitar CORS
        img.crossOrigin = "anonymous";
        img.src = `https://drive.google.com/uc?export=view&id=${params.idImagenP}`;
    }

    document.querySelector('.codigo_qr img').src = 'wesito.png';
}


// 🔥 FUNCIÓN PRO (ESPERA CARGA DE IMÁGENES)
async function printDocument() {

    const element = document.getElementById('printArea');
    const button = document.querySelector('.print-button-container');

    // Ocultar botón
    button.style.display = 'none';

    // 🔥 ESPERAR A QUE TODAS LAS IMÁGENES CARGUEN
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    }));

    // 🔥 CAPTURA REAL
    html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null
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
