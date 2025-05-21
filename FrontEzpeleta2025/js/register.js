document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        nombreCompleto: document.getElementById("regNombre").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value
    };
    const apiBase = `${BASE_API_URL}auth`;
    const response = await fetch(`${apiBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.text();
    if (response.ok) {
        alert(result);
        window.location.href = "../views/login.html";
    } else {
        alert("Login fallido");
    }
    
    
});