document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };
    const apiBase = `${BASE_API_URL}auth`;

    try {
        const response = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        //console.log(response.status);
        // if(response.status == 401){
        //     document.getElementById("tokenOutput").textContent = "Verifique sus credenciales";
        // }

        if (!response.ok) {
           
            throw new Error("Error en la solicitud");
        }
      
        const result = await response.json();
        //document.getElementById("tokenOutput").textContent = result.token;
        localStorage.setItem("token", result.token);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("email", document.getElementById("loginEmail").value);
        window.location.href = "../index.html";
    } catch (error) {
        //alert("No conecta: " + error.message);
        document.getElementById("tokenOutput").textContent = "No conecta a la API";
    }
});

function getToken(){
    return localStorage.getItem("token");
}

