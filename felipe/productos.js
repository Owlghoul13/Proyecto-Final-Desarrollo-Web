// felipe/productos.js
document.addEventListener("DOMContentLoaded", () => {
    //Referencias a los elementos del DOM (HTML)
    const productForm = document.getElementById("product-form");
    const catalogTableBody = document.getElementById("catalog-table-body");
    const submitBtn = document.getElementById("submit-btn");
    const productIdInput = document.getElementById("product-id");
    //Elementos de los campos del formulario para validación y captura
    const productName = document.getElementById("product-name");
    const productCategory = document.getElementById("product-category");
    const productShortDesc = document.getElementById("product-short-desc");
    const productLongDesc = document.getElementById("product-long-desc");
    const productPrice = document.getElementById("product-price");
    /*1. RENDERIZAR EL CATÁLOGO EN LA TABLA*/
    /*Lee los datos desde database.js y dibuja las filas dinamicamente*/
    function renderCatalog() {
        if (!catalogTableBody) return;
        //Se obtiene los productos actuales de la "BD" simulada
        const catalog = getCatalog();
        //Se limpia la tabla antes de reescribir
        catalogTableBody.innerHTML = "";
        catalog.forEach(item => {
            const row = document.createElement("tr");
            //Se configura los estilos visuales segun el estado del item (Soft Delete)
            const statusText = item.activo ? "Activo" : "Inactivo";
            const statusClass = item.activo ? "badge-active" : "badge-inactive";
            const rowClass = item.activo ? "" : "row-disabled";
            row.className = rowClass;
            row.innerHTML = `
                <td><strong>${item.nombre}</strong></td>
                <td><span class="badge-category">${item.categoria}</span></td>
                <td>$${item.precioActual.toLocaleString('es-CL')}</td>
                <td><span class="badge-status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-action btn-edit" data-id="${item.id}">✏️ Editar</button>
                    <button class="btn-action btn-toggle ${item.activo ? 'btn-disable' : 'btn-enable'}" data-id="${item.id}">
                        ${item.activo ? '🛑 Desactivar' : '🟢 Activar'}
                    </button>
                </td>
            `;
            catalogTableBody.appendChild(row);
        });
        //Se vouelve a vincular los eventos de los botones recien creados
        setupTableEventListeners();
    }
    /*2. ASIGNAR EVENTOS A LOS BOTONES DE LA TABLA*/
    /*escucha los clics de editar y activar/desactivar*/
    function setupTableEventListeners() {
        //Se maneja del borrado logico (HU02) - Invierte el estado activo/inactivo
        document.querySelectorAll(".btn-toggle").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                toggleProductStatusInDB(id);
                //Se busca el item para saber que mensaje mostrar en la notificacion
                const item = getCatalog().find(p => p.id === parseInt(id));
                const mensaje = item.activo ? "Ítem reactivado con éxito." : "Ítem desactivado del catálogo.";
                showToast(mensaje);
                renderCatalog();
            });
        });
        //Se maneja de la Edición (HU01) - Carga los datos del item en el formulario
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const item = getCatalog().find(p => p.id === parseInt(id));
                if (item) {
                    //Se traspasan los valores del objeto al formulario HTML
                    productIdInput.value = item.id;
                    productName.value = item.nombre;
                    productCategory.value = item.categoria;
                    productShortDesc.value = item.descCorta;
                    productLongDesc.value = item.descLarga;
                    productPrice.value = item.precioActual;
                    //Se cambia el texto del boton para guiar al usuario
                    if (submitBtn) submitBtn.textContent = "🔄 Actualizar Ítem";
                    showToast("Datos cargados en el formulario.");
                    //Se hace scroll suave hacia el formulario para mejorar la UX en moviles
                    productForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    /*3. PROCESAR EL FORMULARIO (CREAR O EDITAR)*/
    /*Valida los campos y guarda la informacion*/
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitamos que la página se recargue
            //Captura y limpia los espacios en blanco
            const productData = {
                id: productIdInput ? productIdInput.value : "",
                nombre: productName.value.trim(),
                categoria: productCategory.value,
                descCorta: productShortDesc.value.trim(),
                descLarga: productLongDesc.value.trim(),
                precioActual: productPrice.value.trim()
            };
            //Validacion estricta del FRONTEND (Criterio de Aceptación HU01)
            if (!productData.nombre || !productData.categoria || !productData.descCorta || !productData.descLarga || !productData.precioActual) {
                showToast("⚠️ Error: Todos los campos son estrictamente obligatorios.", "error");
                return;
            }
            if (parseFloat(productData.precioActual) <= 0) {
                showToast("⚠️ Error: El valor actual debe ser un número mayor a cero.", "error");
                return;
            }
            //Se envian los datos procesados a nuestra base de datos en localStorage
            saveProductInDB(productData);
            //Es la confirmacion visual exitosa (Criterio de Aceptación HU01)
            const successMessage = productData.id ? "¡Ítem modificado correctamente!" : "¡Nuevo ítem guardado en el catálogo!";
            showToast(successMessage, "success");
            //Se resetea el estado del formulario
            productForm.reset();
            if (productIdInput) productIdInput.value = "";
            if (submitBtn) submitBtn.textContent = "💾 Guardar Ítem";
            //Se refresca la tabla instantaneamente en tiempo real
            renderCatalog();
        });
    }
    /* 4. NOTIFICACIONES FLOTANTES (TOASTS)*/
    /*Reemplaza los molestos 'alert()' nativos por componentes elegantes*/
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        //Se desvanece y elimina automaticamente a los 3 segundos
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    //Render inicial automatico al abrir o refrescar la pantalla
    renderCatalog();
});