async function getClientes() {
    const getToken = () => localStorage.getItem("token");

    const res = await authFetch("clientes");

    console.log(getToken());
    const clientes = await res.json();
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";
    limpiarFormulario();
    clientes.forEach(cat => {
        const row = document.createElement("tr");

        row.classList.add(cat.eliminado ? "border-left-danger" : "border-left-info");

        row.innerHTML = `
            <td>${cat.clienteID}</td>
            <td>${cat.nombre}</td>
            <td>${cat.dniCuit}</td>
            <td>${cat.email}</td>
            <td>${cat.telefono}</td>
            <td class="text-center">               
                ${!cat.eliminado ? `<button class="btn btn-primary btn-circle" onclick="prepararEdicion(${cat.clienteID})"><i class="fas fa-edit"></i></button>` : ''}
                ${!cat.eliminado ? `<button class="btn btn-danger btn-circle" onclick="deleteCliente(${cat.clienteID}, 1)"><i class="fas fa-trash"></i></button>` : `<button class="btn btn-warning btn-circle" onclick="deleteCliente(${cat.clienteID}, 0)"><i class="fas fa-check"></i></button>`} 
            </td>
        `;
        tbody.appendChild(row);
    });
    $("#clienteModal").modal("hide");
}

// function prepararEdicion(id, nombre) {
//     document.getElementById("clienteEmail").disabled = true;
//     document.getElementById("editarClienteId").value = id;
//     document.getElementById("clienteNombre").value = nombre;
//     $("#clienteModal").modal("show");
// }

async function prepararEdicion(clienteID) {
    const res = await authFetch("clientes/" + clienteID);
    const cliente = await res.json();
    document.getElementById("exampleModalLabel").textContent = "Editar Cliente";
    document.getElementById("editarClienteId").value = cliente.clienteID;
    document.getElementById("clienteNombre").value = cliente.nombre;
    document.getElementById("clienteDNI").value = cliente.dniCuit;
    document.getElementById("clienteEmail").value = cliente.email;
    document.getElementById("clienteTeléfono").value = cliente.telefono;
    document.getElementById("clienteObservacion").value = cliente.observaciones;
    document.getElementById("clienteEmail").disabled = true;

    $("#clienteModal").modal("show");
}

function limpiarFormulario() {
    document.getElementById("editarClienteId").value = 0;
    document.getElementById("clienteNombre").value = "";
    document.getElementById("clienteDNI").value = "";
    document.getElementById("clienteEmail").value = "";
    document.getElementById("clienteTeléfono").value = "";
    document.getElementById("clienteObservacion").value = "";
    document.getElementById("clienteEmail").disabled = false;
}

function guardarCliente() {
    let clienteID = document.getElementById("editarClienteId").value;

    const nombre = document.getElementById("clienteNombre").value;
    const dni = document.getElementById("clienteDNI").value;
    const email = document.getElementById("clienteEmail").value;
    
    if (nombre && dni && email) {
        if (clienteID == 0) {
            createCliente();
        }
        else {
            updateCliente();
        }
    }
}

async function createCliente() {
    const nombre = document.getElementById("clienteNombre").value;
    const dni = document.getElementById("clienteDNI").value;
    const email = document.getElementById("clienteEmail").value;

    const cliente = {
        nombre: nombre,
        dNICuit: dni,
        email: email,
        telefono: document.getElementById("clienteTeléfono").value,
        observaciones: document.getElementById("clienteObservacion").value,
    };
    const res = await authFetch(`clientes`, {
        method: "POST",
        body: JSON.stringify(cliente)
    });

    if (res.ok) {
        getClientes();
    } else {
        alert("Error al crear: " + await res.text());
    }
}

async function updateCliente() {
    const API_URL = `${BASE_API_URL}clientes`;
    const id = document.getElementById("editarClienteId").value;
    
    const nombre = document.getElementById("clienteNombre").value;
    const dni = document.getElementById("clienteDNI").value;
    const email = document.getElementById("clienteEmail").value;

    const cliente = {
        clienteID: id,
        nombre: nombre,
        dNICuit: dni,
        email: email,
        telefono: document.getElementById("clienteTeléfono").value,
        observaciones: document.getElementById("clienteObservacion").value,
    };
    
    const getToken = () => localStorage.getItem("token");
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    });
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(cliente)
    });

    if (res.ok) {
        getClientes();
    } else {
        alert("Error al actualizar: " + await res.text());
    }
}

async function deleteCategoria(id, accion) {
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
            const res = await authFetch(`clientes/${id}?accion=${accion}`, {
                method: "DELETE"
            });

            if (res.ok) {
                getClientes();
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
getClientes();