function verificarUsuario(){
    const token = getToken();
    const email = getEmail(); // suponiendo que guardaste el email al hacer login
   
    $("#email-usuario").text(email);

    if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "../views/login.html";
        return;
    }
}  

async function cerrarSesion() {
    //FUNCION DE LEER TOKEN DEL DISPOSITIVO
    //const getToken = () => localStorage.getItem("token");
    const token = getToken();
    const email = localStorage.getItem("email"); // suponiendo que guardaste el email al hacer login

    if (!token || !email) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "../views/login.html";
        return;
    }
    const apiBase = `${BASE_API_URL}auth`;
    try {
        const res = await fetch(`${apiBase}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            //alert("Sesión cerrada correctamente");
        } else {
            alert("Error al cerrar sesión: " + await res.text());
        }
    } catch (error) {
        console.error("Error en logout:", error);
    }

    // Limpiar token y redirigir
    localStorage.removeItem("token");
    localStorage.removeItem("email");
   
    window.location.href = "../views/login.html";
}