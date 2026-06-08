// felipe/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    // 1. Logica para procesar el login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            //Evita que la pagina recargue
            e.preventDefault();
            const role = document.getElementById("username").value;
            const pass = document.getElementById("password").value;
            //Validacion basica
            if (role === "" || pass === "") {
                alert("Por favor, complete todos los campos.");
                return;
            }
            //Simulacion: Se guarda el rol en sessionstorage (se borra al cerrar la pestaña)
            sessionStorage.setItem("crm_usuario_activo", role);
            //Redirige al dashboard
            //Nota: se ajusta la ruta dependiendo de donde este index.html
            window.location.href = "cinthya/dashboard.html"; 
        });
    }
    // 2. Logica para proteger las paginas (Control de Sesion)
    //Esto se ejecutara en las otras pantallas (dashboard, clientes, productos)
    function verificarSesion() {
        //Si no estamos en la pagina de login (index.html)
        if (!window.location.pathname.includes("index.html") && window.location.pathname !== "/") {
            const usuarioActivo = sessionStorage.getItem("crm_usuario_activo");
            //Si nadie se ha logueado, lo devolvemos al login a la fuerza
            if (!usuarioActivo) {
                alert("Acceso denegado. Debe iniciar sesión primero.");
                //Ajusta esta ruta segun la estructura de tus carpetas
                window.location.href = "../index.html"; 
            }
        }
    }
    //Se ejecuta la verificación al cargar cualquier script
    verificarSesion();
});
//Funcion global para cerrar sesión (se pondra en el menú lateral luego)
function cerrarSesion() {
    sessionStorage.removeItem("crm_usuario_activo");
    window.location.href = "../index.html";
}