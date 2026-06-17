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
                // 1. Ocultar cualquier contenido de fondo y bloquear el scroll
    document.body.style.overflow = "hidden";
    
    // 2. Reemplazar toda la pantalla con tu Modal personalizado
    document.body.innerHTML = `
      <div class="d-flex align-items-center justify-content-center vh-100" style="background-color: rgba(0,0,0,0.8); position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;">
        <div class="modal-dialog m-0 shadow-lg" style="width: 100%; max-width: 400px;">
          <div class="modal-content border-0" style="border-radius: 8px; overflow: hidden; background: white;">
            
            <div class="modal-header p-3 text-white" style="background-color: #D4321E;">
              <h5 class="modal-title fw-bold m-0">Acceso Denegado</h5>
            </div>
            
            <div class="modal-body text-center p-4">
              <h4 class="mb-3 text-dark">⚠️ Atención</h4>
              <p class="fs-5 mb-0 text-secondary">Debes iniciar sesión para acceder a esta página.</p>
            </div>
            
            <div class="modal-footer justify-content-center bg-light p-3 border-top">
              <button id="btnRedirigirLogin" class="btn fw-bold text-white px-4 py-2" style="background-color: #D4321E; border-radius: 6px;">
                Ir a Iniciar Sesión
              </button>
            </div>
            
          </div>
        </div>
      </div>
    `;

    // 3. Darle la acción de redirección al botón rojo
    document.getElementById('btnRedirigirLogin').addEventListener('click', function() {
        window.location.href = '../index.html'; 
    });

    // 4. Detener el resto del código para que no cargue el dashboard de fondo
    throw new Error("Acceso denegado: redirigiendo al login.");
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