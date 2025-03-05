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
        fechaDeHoy: formatDate(urlParams.get('fechaDeHoy')) || '',
        descripcionP: urlParams.get('descripcionP') || '',
        codigoP: urlParams.get('codigoP') || '',
        precioV: urlParams.get('precioV') || '',
        existencias: formatNumber(urlParams.get('existencias')) || '',
        imagenP: formatImage(urlParams.get('imagenP')) || '',
        idImagenP: urlParams.get('idImagenP') || '',
        codigo_qr: urlParams.get('codigo_qr') || ''
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
    document.getElementById("fechaDeHoy").textContent = params.fechaDeHoy;
    document.getElementById("descripcionP").textContent = params.descripcionP;
    document.getElementById("codigoP").textContent = params.codigoP;
    document.getElementById("precioV").textContent = params.precioV;
    document.getElementById("existencias").textContent = params.existencias;
    
// Manejar la imagen de la firma
    if (params.idImagenP) {
        const imagenP = document.querySelector('.codigo img');
        if (imagenP) {
            imagenP.src = `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
        }
    }

    // Generar el código QR
    const codigo_qr = document.querySelector('.qr-code img');
    if (codigo_qr && params.codigoP) {
        qrImg.src = `https://quickchart.io/qr?text=${params.codigoP}&size=100`;
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
