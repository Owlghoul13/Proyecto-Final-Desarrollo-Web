// felipe/database.js

// 1. Datos iniciales por defecto del catalogo (Cumple HU01 y HU02)
const DEFAULT_CATALOG = [
    { 
        id: 1, 
        nombre: "Plan Funerario Básico", 
        categoria: "Servicio", 
        descCorta: "Servicio esencial.", 
        descLarga: "Incluye traslados, urna estándar y asistencia en trámites legales.", 
        precioActual: 850000, 
        activo: true, 
        historicoPrecios: [{ precio: 850000, fecha: "2026-05-01" }] 
    },
    { 
        id: 2, 
        nombre: "Urna de Roble Presidencial", 
        categoria: "Producto", 
        descCorta: "Urna de alta gama.", 
        descLarga: "Urna construida en madera de roble tallada a mano con interiores de terciopelo.", 
        precioActual: 2100000, 
        activo: true, 
        historicoPrecios: [{ precio: 2100000, fecha: "2026-05-10" }] 
    }
];
// 2. Configuracion base de metas fijadas por el ADMINISTRADOR (Cumple HU04)
const DEFAULT_GOALS = {
    prospectos: 20,
    agendas: 10,
    citas: 5,
    ventas: 2,
    semaforo: { rojo: 40, amarillo: 79, verde: 100 }
};
// 3. Inicializacion del almacenamiento local (LocalStorage)
function initDatabase() {
    if (!localStorage.getItem("crm_catalogo")) {
        localStorage.setItem("crm_catalogo", JSON.stringify(DEFAULT_CATALOG));
    }
    if (!localStorage.getItem("crm_metas_base")) {
        localStorage.setItem("crm_metas_base", JSON.stringify(DEFAULT_GOALS));
    }
    if (!localStorage.getItem("crm_ventas")) {
        localStorage.setItem("crm_ventas", JSON.stringify([]));
    }
}
// 4. Funciones de lectura/escritura auxiliares
function getCatalog() {
    return JSON.parse(localStorage.getItem("crm_catalogo")) || [];
}
function saveCatalog(catalog) {
    localStorage.setItem("crm_catalogo", JSON.stringify(catalog));
}
// 5. Motor del catalogo: crear o editar items (Cumple HU01 y HU03)
function saveProductInDB(productData) {
    let catalog = getCatalog();
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (productData.id) {
        //Modo edicion
        catalog = catalog.map(p => {
            if (p.id === parseInt(productData.id)) {
                let historico = [...p.historicoPrecios];
                //Si el precio cambio, se añade un nuevo registro al historial sin pisar el anterior
                if (p.precioActual !== parseFloat(productData.precioActual)) {
                    historico.push({
                        precio: parseFloat(productData.precioActual),
                        fecha: fechaHoy
                    });
                }
                return {
                    ...p,
                    nombre: productData.nombre,
                    categoria: productData.categoria,
                    descCorta: productData.descCorta,
                    descLarga: productData.descLarga,
                    precioActual: parseFloat(productData.precioActual),
                    historicoPrecios: historico
                };
            }
            return p;
        });
    } else {
        //Modo creacion
        const newProduct = {
            //ID unico autogenerado
            id: Date.now(),
            nombre: productData.nombre,
            categoria: productData.categoria,
            descCorta: productData.descCorta,
            descLarga: productData.descLarga,
            precioActual: parseFloat(productData.precioActual),
            activo: true, 
            historicoPrecios: [{ precio: parseFloat(productData.precioActual), fecha: fechaHoy }]
        };
        catalog.push(newProduct);
    }
    saveCatalog(catalog);
}
// 6. Motor del catalogo: Borrado logico / Soft Delete (Cumple HU02)
function toggleProductStatusInDB(id) {
    let catalog = getCatalog();
    catalog = catalog.map(p => {
        if (p.id === parseInt(id)) {
            //Invierte el estado (activa o desactiva)
            return { ...p, activo: !p.activo };
        }
        return p;
    });
    saveCatalog(catalog);
}
//Ejecucion automatica al cargar el archivo
initDatabase();