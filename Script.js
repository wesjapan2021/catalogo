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
        if (isNaN(date.getTime())) return dateStr; // Si no es una fecha válida, retorna el string original
        
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
        fechaDevolucion: formatDate(urlParams.get('fechaDevolucion')) || '',
        noComprobante: urlParams.get('noComprobante') || '',
        idCliente: urlParams.get('idCliente') || '',
        nombreCliente: urlParams.get('nombreCliente') || '',
        noVenta: urlParams.get('noVenta') || '',
        fechaVenta: formatDate(urlParams.get('fechaVenta')) || '',
        precioV: urlParams.get('precioV') || '',
        codigoP: urlParams.get('codigoP') || '',
        descripcionP: urlParams.get('descripcionP') || '',
        cantidadDevuelta: urlParams.get('cantidadDevuelta') || '',
        status: urlParams.get('status') || '',
        motivoDevolucion: urlParams.get('motivoDevolucion') || '',
        procedoA: urlParams.get('procedoA') || '',
        nombreAsesor: urlParams.get('nombreAsesor') || '',
        idFirmaAsesorImagen: urlParams.get('idFirmaAsesorImagen') || '',
        firmaAsesor: urlParams.get('firmaAsesor') || '',
        qr: urlParams.get('qr') || ''
    };

    // Decodificar todos los valores
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
    
    // Asignar valores a los elementos
    document.getElementById("fechaDevolucion").textContent = params.fechaDevolucion;
    document.getElementById("noComprobante").textContent = params.noComprobante;
    document.getElementById("idCliente").textContent = params.idCliente;
    document.getElementById("nombreCliente").textContent = params.nombreCliente;
    document.getElementById("noVenta").textContent = params.noVenta;
    document.getElementById("fechaVenta").textContent = params.fechaVenta;
    document.getElementById("precioV").textContent = params.precioV;
    document.getElementById("codigoP").textContent = params.codigoP;
    document.getElementById("descripcionP").textContent = params.descripcionP;
    document.getElementById("cantidadDevuelta").textContent = params.cantidadDevuelta;
    document.getElementById("status").textContent = params.status;
    document.getElementById("motivoDevolucion").textContent = params.motivoDevolucion;
    document.getElementById("procedoA").textContent = params.procedoA;
    document.getElementById("nombreAsesor").textContent = params.nombreAsesor;

// Manejar la imagen de la firma
    if (params.idFirmaAsesorImagen) {
        const firmaImg = document.querySelector('.signature img');
        if (firmaImg) {
            firmaImg.src = `https://drive.google.com/thumbnail?id=${params.idFirmaAsesorImagen}&sz=4000`;
        }
    }

    // Generar el código QR
    const qrImg = document.querySelector('.qr-code img');
    if (qrImg && params.noComprobante) {
        qrImg.src = `https://quickchart.io/qr?text=${params.noComprobante}&size=100`;
    }
}

// Función para imprimir el documento
function printDocument() {
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.style.display = 'none';
    }
    
    window.print();
    
    setTimeout(() => {
        if (printButton) {
            printButton.style.display = 'block';
        }
    }, 100);
}

// Inicialización cuando se carga la página
window.onload = function() {
    try {
        setValues();
        // Agregar el evento de impresión al botón
        const printButton = document.querySelector('.print-button');
        if (printButton) {
            printButton.addEventListener('click', printDocument);
        }
    } catch (error) {
        console.error('Error en la inicialización:', error);
        alert('Ocurrió un error al inicializar la página. Por favor, recargue la página.');
    }
};
