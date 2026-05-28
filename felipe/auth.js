// felipe/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    // 1. Lógica para procesar el Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita que la página recargue

            const role = document.getElementById("username").value;
            const pass = document.getElementById("password").value;

            // Validación básica
            if (role === "" || pass === "") {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Simulación: Guardamos el rol en sessionStorage (se borra al cerrar la pestaña)
            sessionStorage.setItem("crm_usuario_activo", role);

            // Redirigimos al Dashboard
            // Nota: Ajusta la ruta dependiendo de dónde esté index.html
            window.location.href = "cinthya/dashboard.html"; 
        });
    }

    // 2. Lógica para proteger las páginas (Control de Sesión)
    // Esto se ejecutará en las otras pantallas (dashboard, clientes, productos)
    function verificarSesion() {
        // Si no estamos en la página de login (index.html)
        if (!window.location.pathname.includes("index.html") && window.location.pathname !== "/") {
            const usuarioActivo = sessionStorage.getItem("crm_usuario_activo");
            
            // Si nadie se ha logueado, lo devolvemos al login a la fuerza
            if (!usuarioActivo) {
                alert("Acceso denegado. Debe iniciar sesión primero.");
                // Ajusta esta ruta según la estructura de tus carpetas
                window.location.href = "../index.html"; 
            }
        }
    }

    // Ejecutamos la verificación al cargar cualquier script
    verificarSesion();
});

// Función global para cerrar sesión (la pondremos en el menú lateral luego)
function cerrarSesion() {
    sessionStorage.removeItem("crm_usuario_activo");
    window.location.href = "../index.html";
}