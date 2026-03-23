function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    const keys = ['fechaDeHoy', 'descripcionP', 'codigoP', 'precioV', 'existencias', 'imagenP', 'idImagenP'];
    
    keys.forEach(key => {
        params[key] = decodeURIComponent(urlParams.get(key) || '');
    });
    return params;
}

function formatDate(dateStr) {
    if (!dateStr) return new Date().toLocaleDateString('es-ES');
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('es-ES');
}

function setValues() {
    const params = getUrlParameters();
    
    if(document.getElementById("fechaDeHoy")) document.getElementById("fechaDeHoy").textContent = formatDate(params.fechaDeHoy);
    if(document.getElementById("descripcionP")) document.getElementById("descripcionP").textContent = params.descripcionP;
    if(document.getElementById("codigoP")) document.getElementById("codigoP").textContent = params.codigoP;
    if(document.getElementById("precioV")) document.getElementById("precioV").textContent = params.precioV;
    if(document.getElementById("existencias")) document.getElementById("existencias").textContent = params.existencias;
    
    const imgElement = document.getElementById('imgProducto');
    if (imgElement) {
        // Configuración para evitar problemas de CORS al descargar la imagen
        imgElement.crossOrigin = "anonymous";

        // Intentar cargar imagen local, si falla pasar a Google Drive
        if (params.imagenP) {
            // Quitamos la barra inicial si existe para que la ruta sea relativa a la carpeta 'catalogo'
            const cleanPath = params.imagenP.startsWith('/') ? params.imagenP.substring(1) : params.imagenP;
            imgElement.src = cleanPath;

            // Si la imagen local falla, intenta con el ID de Drive
            imgElement.onerror = function() {
                if (params.idImagenP) {
                    imgElement.src = `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
                }
                imgElement.onerror = null; // Evitar bucle infinito
            };
        } else if (params.idImagenP) {
            imgElement.src = `https://drive.google.com/thumbnail?id=${params.idImagenP}&sz=4000`;
        }
    }
}

function printDocument() {
    const printArea = document.getElementById('printArea');
    const button = document.getElementById('btnDescargar');
    
    button.disabled = true;
    button.textContent = 'Generando...';

    html2canvas(printArea, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        backgroundColor: "#f6f7f9"
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `producto_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        button.disabled = false;
        button.textContent = 'Descargar Imagen';
    }).catch(err => {
        console.error("Error al capturar:", err);
        button.disabled = false;
        button.textContent = 'Error - Reintentar';
    });
}

window.onload = () => {
    setValues();
    document.getElementById('btnDescargar').addEventListener('click', printDocument);
};
