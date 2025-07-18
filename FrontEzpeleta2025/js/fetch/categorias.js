async function getCategorias() {

    //const API_URL = `${BASE_API_URL}/categorias`;
    const getToken = () => localStorage.getItem("token");

    // const authHeaders = () => ({
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${getToken()}`
    // });

    // const res = await fetch(API_URL, {
    //     method: "GET",
    //     headers: authHeaders()
    // });


    const res = await authFetch("categorias");
    // o con método POST
    // const res = await authFetch("productos/crear", {
    //   method: "POST",
    //   body: JSON.stringify({ nombre: "Coca Cola" })
    // });

    //console.log(getToken());
    const categorias = await res.json();
    const tbody = document.querySelector("#tablaCategorias tbody");
    tbody.innerHTML = "";
    limpiarFormulario();
    categorias.forEach(cat => {
        const row = document.createElement("tr");

        row.classList.add(cat.eliminado ? "border-left-danger" : "border-left-info");

        row.innerHTML = `
            <td>${cat.categoriaID}</td>
            <td>${cat.nombre}</td>
            <td class="text-center">               
                ${!cat.eliminado ? `<button class="btn btn-primary btn-circle" onclick="prepararEdicion(${cat.categoriaID}, '${cat.nombre}')"><i class="fas fa-edit"></i></button>` : ''}
                ${!cat.eliminado ? `<button class="btn btn-danger btn-circle" onclick="deleteCategoria(${cat.categoriaID}, 1)"><i class="fas fa-trash"></i></button>` : `<button class="btn btn-warning btn-circle" onclick="deleteCategoria(${cat.categoriaID}, 0)"><i class="fas fa-check"></i></button>`} 
            </td>
        `;
        tbody.appendChild(row);
    });
    $("#categoriaModal").modal("hide");
}

function prepararEdicion(id, nombre) {
    document.getElementById("editarCategoriaId").value = id;
    document.getElementById("categoriaNombre").value = nombre;
    $("#categoriaModal").modal("show");
}

function limpiarFormulario() {
    document.getElementById("editarCategoriaId").value = 0;
    document.getElementById("categoriaNombre").value = "";
}

function guardarCategoria() {
    let categoriaID = document.getElementById("editarCategoriaId").value;
    if (categoriaID == 0) {
        createCategoria();
    }
    else {
        updateCategoria();
    }
}

async function createCategoria() {
    //const API_URL = `${BASE_API_URL}/categorias`;
    const nombre = document.getElementById("categoriaNombre").value;
    // const getToken = () => localStorage.getItem("token");

    // const authHeaders = () => ({
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${getToken()}`
    // });
    // const res = await fetch(API_URL, {
    //     method: "POST",
    //     headers: authHeaders(),
    //     body: JSON.stringify({ nombre })
    // });

    const res = await authFetch(`categorias`, {
        method: "POST",
        body: JSON.stringify({ nombre })
    });

    if (res.ok) {
        getCategorias();
    } else {
        alert("Error al crear: " + await res.text());
    }
}

async function updateCategoria() {
    const API_URL = `${BASE_API_URL}categorias`;
    const id = document.getElementById("editarCategoriaId").value;
    const nombre = document.getElementById("categoriaNombre").value;
    const getToken = () => localStorage.getItem("token");
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    });
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ categoriaID: id, nombre })
    });

    // const res = await authFetch(`categorias/${id}`, {
    //     method: "PUT",
    //     body: JSON.stringify({ categoriaID: id, nombre })
    // });

    if (res.ok) {
        getCategorias();
    } else {
        alert("Error al actualizar: " + await res.text());
    }
}

async function deleteCategoria(id, accion) {
    //const API_URL = `${BASE_API_URL}/categorias`;
    //if (!confirm("¿Seguro que querés eliminar esta categoría?")) return;
    // const getToken = () => localStorage.getItem("token");
    // const authHeaders = () => ({
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${getToken()}`
    // });

    // const res = await fetch(`${API_URL}/${id}?accion=${accion}`, {
    //     method: "DELETE",
    //     headers: authHeaders()
    // });

    let titulo = '¿Está seguro de deshabilitar?';
    let texto = "¡No podrá usarlos en futuros tickets!";
    if (accion == 0) {
        titulo = '¿Está seguro de habilitar?';
        texto = "¡Podrá usarlos en futuros tickets!";
    }
    const result = await Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar"
    });

    if (result.isConfirmed) {
        try {
            const res = await authFetch(`categorias/${id}?accion=${accion}`, {
                method: "DELETE"
            });

            if (res.ok) {
                getCategorias();
            } else {
                alert("Error al eliminar: " + await res.text());
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Ocurrió un error inesperado.");
        }
    }
}

// Cargar categorías al iniciar
getCategorias();