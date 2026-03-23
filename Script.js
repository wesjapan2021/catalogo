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
    
    // Manejar la imagen del producto
    const imgElement = document.querySelector('.imagenP img');
    if (imgElement) {
        // Prioridad: usar imagenP si está disponible, si no usar idImagenP de Google Drive
        if (params.imagenP) {
            imgElement.src = params.imagenP;
        } else if (params.idImagenP) {
            imgElement.src = `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
        }
    }

    // Cargar la imagen wesito.png en lugar de generar código QR dinámicamente
    const qrElement = document.querySelector('.codigo_qr img');
    if (qrElement) {
        qrElement.src = 'wesito.png';
    }
}

// Función para capturar y descargar la tarjeta completa como PNG
function printDocument() {
    // Esperar a que las imágenes se carguen completamente
    const printArea = document.getElementById('printArea');
    const button = document.querySelector('.print-button');
    
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas no está cargado');
        alert('Error: No se puede capturar la tarjeta. Por favor recarga la página.');
        return;
    }

    // Mostrar indicador de carga y ocultar el botón
    const originalText = button.textContent;
    button.textContent = 'Procesando...';
    button.disabled = true;
    button.style.display = 'none';

    html2canvas(printArea, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        imageTimeout: 0
    }).then(canvas => {
        // Crear descarga
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        link.href = canvas.toDataURL('image/png');
        link.download = `catalogo_producto_${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Restaurar estado del botón
        button.textContent = originalText;
        button.disabled = false;
        button.style.display = 'block';
    }).catch(error => {
        console.error('Error al capturar la tarjeta:', error);
        alert('Error al descargar la tarjeta. Verifica la consola para más detalles.');
        button.textContent = originalText;
        button.disabled = false;
        button.style.display = 'block';
    });
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