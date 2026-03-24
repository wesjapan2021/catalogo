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

    // 🔥 IMAGEN DESDE GOOGLE DRIVE (CORREGIDO)
    if (params.idImagenP) {
        const img = document.querySelector('.imagenP img');

        img.crossOrigin = "anonymous";
        img.src = `https://lh3.googleusercontent.com/d/${params.idImagenP}`;
    }

    // QR fijo
    document.querySelector('.codigo_qr img').src = 'wesito.png';
}


// 🔥 FUNCIÓN PARA EXPORTAR PNG
async function printDocument() {

    const element = document.getElementById('printArea');
    const button = document.querySelector('.print-button-container');

    // Ocultar botón
    button.style.display = 'none';

    // 🔥 Esperar a que TODAS las imágenes carguen
    const images = element.querySelectorAll('img');

    await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();

        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    }));

    // 🔥 Captura real
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


// Inicialización
window.onload = function () {

    setValues();

    document
        .querySelector('.print-button')
        .addEventListener('click', printDocument);
};
