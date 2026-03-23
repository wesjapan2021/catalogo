// Función para sanitizar el HTML
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Función para formatear fecha a dd/mm/yyyy
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        console.error('Error formateando fecha:', e);
        return dateStr;
    }
}

// Función para obtener y decodificar parámetros de la URL
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        fechaDeHoy: urlParams.get('fechaDeHoy') || '',
        descripcionP: urlParams.get('descripcionP') || '',
        codigoP: urlParams.get('codigoP') || '',
        precioV: urlParams.get('precioV') || '',
        existencias: urlParams.get('existencias') || '',
        imagenP: urlParams.get('imagenP') || '',
        idImagenP: urlParams.get('idImagenP') || '',
        codigo_qr: urlParams.get('codigo_qr') || ''
    };

    Object.keys(params).forEach(key => {
        try {
            params[key] = decodeURIComponent(params[key] || '');
        } catch (e) {
            console.error(`Error decodificando ${key}:`, e);
            params[key] = '';
        }
    });

    return params;
}

// Función para asignar valores a los elementos HTML
function setValues() {
    const params = getUrlParameters();
    
    // Asignar valores a los elementos por ID
    if(document.getElementById("fechaDeHoy")) document.getElementById("fechaDeHoy").textContent = formatDate(params.fechaDeHoy);
    if(document.getElementById("descripcionP")) document.getElementById("descripcionP").textContent = params.descripcionP;
    if(document.getElementById("codigoP")) document.getElementById("codigoP").textContent = params.codigoP;
    if(document.getElementById("precioV")) document.getElementById("precioV").textContent = params.precioV;
    if(document.getElementById("existencias")) document.getElementById("existencias").textContent = params.existencias;
    
    // Manejar la imagen del producto (Google Drive)
    if (params.idImagenP) {
        const imgElement = document.querySelector('.imagenP img');
        if (imgElement) {
            imgElement.src = `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
        }
    }

    // Generar el código QR dinámicamente
    const qrElement = document.querySelector('.codigo_qr img');
    if (qrElement && params.codigoP) {
        qrElement.src = `https://quickchart.io/qr?text=${encodeURIComponent(params.codigoP)}&size=100`;
    }
}

// Función para imprimir el documento
function printDocument() {
    window.print();
}

// Inicialización cuando se carga la página
window.onload = function() {
    try {
        setValues();
        const printButton = document.querySelector('.print-button');
        if (printButton) {
            printButton.addEventListener('click', printDocument);
        }
    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
};
