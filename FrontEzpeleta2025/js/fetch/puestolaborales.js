async function getPuestoLaborales() {

    const getToken = () => localStorage.getItem("token");

    const res = await authFetch("puestolaborales");
    //console.log(getToken());
    const puestoLaborales = await res.json();
    const tbody = document.querySelector("#tablaPuestoLaborales tbody");
    tbody.innerHTML = "";
    limpiarFormulario();
    puestoLaborales.forEach(cat => {
        const row = document.createElement("tr");

        row.classList.add(cat.eliminado ? "border-left-danger" : "border-left-info");

        row.innerHTML = `
            <td>${cat.puestoLaboralID}</td>
            <td>${cat.nombre}</td>
            <td class="text-center">               
                ${!cat.eliminado ? `<button class="btn btn-primary btn-circle" onclick="prepararEdicion(${cat.puestoLaboralID}, '${cat.nombre}')"><i class="fas fa-edit"></i></button>` : ''}
                ${!cat.eliminado ? `<button class="btn btn-danger btn-circle" onclick="deletePuestoLaboral(${cat.puestoLaboralID}, 1)"><i class="fas fa-trash"></i></button>` : `<button class="btn btn-warning btn-circle" onclick="deletePuestoLaboral(${cat.puestoLaboralID}, 0)"><i class="fas fa-check"></i></button>`} 
            </td>
        `;
        tbody.appendChild(row);
    });
    $("#puestoLaboralModal").modal("hide");
}

function prepararEdicion(id, nombre) {
    document.getElementById("editarPuestoLaboralID").value = id;
    document.getElementById("puestoLaboralNombre").value = nombre;
    $("#puestoLaboralModal").modal("show");
}

function limpiarFormulario() {
    document.getElementById("editarPuestoLaboralID").value = 0;
    document.getElementById("puestoLaboralNombre").value = "";
}

function guardarPuestoLaboral() {
    let puestoLaboralID = document.getElementById("editarPuestoLaboralID").value;
    if (puestoLaboralID == 0) {
        createPuestoLaboral();
    }
    else {
        updatePuestoLaboral();
    }
}

async function createPuestoLaboral() {
    const nombre = document.getElementById("puestoLaboralNombre").value;
    const res = await authFetch(`puestolaborales`, {
        method: "POST",
        body: JSON.stringify({ nombre })
    });

    if (res.ok) {
        getPuestoLaborales();
    } else {
        alert("Error al crear: " + await res.text());
    }
}

async function updatePuestoLaboral() {
    const API_URL = `${BASE_API_URL}puestolaborales`;
    const id = document.getElementById("editarPuestoLaboralID").value;
    const nombre = document.getElementById("puestoLaboralNombre").value;
    const getToken = () => localStorage.getItem("token");
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    });
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ puestoLaboralID: id, nombre })
    });

    if (res.ok) {
        getPuestoLaborales();
    } else {
        alert("Error al actualizar: " + await res.text());
    }
}

async function deletePuestoLaboral(id, accion) {
    let titulo = '¿Está seguro de deshabilitar?';
    let texto = "¡No podrá usarlos en futuros registros!";
    if (accion == 0) {
        titulo = '¿Está seguro de habilitar?';
        texto = "¡Podrá usarlos en futuros registros!";
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
            const res = await authFetch(`puestolaborales/${id}?accion=${accion}`, {
                method: "DELETE"
            });

            if (res.ok) {
                getPuestoLaborales();
            } else {
                alert("Error al eliminar: " + await res.text());
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Ocurrió un error inesperado.");
        }
    }
}

// Cargar PuestoLaborales al iniciar
getPuestoLaborales();