async function comboPuestosLaborales() {

    const res = await authFetch("puestolaborales");

    const puestoslaborales = await res.json();

    //const comboSelectBuscar = document.querySelector("#PuestoLaboralIDBuscar");
    //comboSelectBuscar.innerHTML = "";
    const comboSelect = document.querySelector("#desarrolladorPuestoLaboralID");
    comboSelect.innerHTML = "";

    //let opcionesBuscar = `<option value="0">[Todas los puestos laborales]</option>`;
    let opciones = '';
    puestoslaborales.forEach(cat => {

        opciones += `<option value="${cat.puestoLaboralID}">${cat.nombre}</option>`;
        //opcionesBuscar += `<option value="${cat.puestoLaboralID}">${cat.nombre}</option>`;
    });
    comboSelect.innerHTML = opciones;
    //comboSelectBuscar.innerHTML = opcionesBuscar;

    getDesarrolladores();
}


async function getDesarrolladores() {
    const getToken = () => localStorage.getItem("token");

    const res = await authFetch("desarrolladores");

    console.log(getToken());
    const desarrolladores = await res.json();
    const tbody = document.querySelector("#tablaDesarrolladores tbody");
    tbody.innerHTML = "";
    limpiarFormulario();
    desarrolladores.forEach(cat => {
        const row = document.createElement("tr");

        row.classList.add(cat.eliminado ? "border-left-danger" : "border-left-info");

        row.innerHTML = `
            <td>${cat.desarrolladorID}</td>
            <td>${cat.nombre}</td>
            <td>${cat.dniCuit}</td>
            <td>${cat.email}</td>
            <td>${cat.telefono}</td>
            <td class="text-center">               
                ${!cat.eliminado ? `<button class="btn btn-primary btn-circle" onclick="prepararEdicion(${cat.desarrolladorID})"><i class="fas fa-edit"></i></button>` : ''}
                ${!cat.eliminado ? `<button class="btn btn-danger btn-circle" onclick="deleteDesarrollador(${cat.desarrolladorID}, 1)"><i class="fas fa-trash"></i></button>` : `<button class="btn btn-warning btn-circle" onclick="deleteDesarrollador(${cat.desarrolladorID}, 0)"><i class="fas fa-check"></i></button>`} 
            </td>
        `;
        tbody.appendChild(row);
    });
    $("#desarrolladorModal").modal("hide");
}

async function prepararEdicion(desarrolladorID) {
    const res = await authFetch("desarrolladores/" + desarrolladorID);
    const desarrollador = await res.json();
    document.getElementById("exampleModalLabel").textContent = "Editar Desarrollador";
    document.getElementById("editarDesarrolladorId").value = desarrollador.desarrolladorID;
    document.getElementById("desarrolladorNombre").value = desarrollador.nombre;
    document.getElementById("desarrolladorDNI").value = desarrollador.dniCuit;
    document.getElementById("desarrolladorEmail").value = desarrollador.email;
    document.getElementById("desarrolladorTeléfono").value = desarrollador.telefono;
    document.getElementById("desarrolladorObservacion").value = desarrollador.observaciones;
    document.getElementById("desarrolladorEmail").disabled = true;
    document.getElementById("desarrolladorPuestoLaboralID").value = desarrollador.puestoLaboralID;

    $("#desarrolladorModal").modal("show");
}

function limpiarFormulario() {
    document.getElementById("editarDesarrolladorId").value = 0;
    document.getElementById("desarrolladorNombre").value = "";
    document.getElementById("desarrolladorDNI").value = "";
    document.getElementById("desarrolladorEmail").value = "";
    document.getElementById("desarrolladorTeléfono").value = "";
    document.getElementById("desarrolladorObservacion").value = "";
    document.getElementById("desarrolladorEmail").disabled = false;
}

function guardarDesarrollador() {
    let desarrolladorID = document.getElementById("editarDesarrolladorId").value;

    const nombre = document.getElementById("desarrolladorNombre").value;
    const dni = document.getElementById("desarrolladorDNI").value;
    const email = document.getElementById("desarrolladorEmail").value;
    
    if (nombre && dni && email) {
        if (desarrolladorID == 0) {
            createDesarrollador();
        }
        else {
            updateDesarrollador();
        }
    }
}

async function createDesarrollador() {
    const nombre = document.getElementById("desarrolladorNombre").value;
    const dni = document.getElementById("desarrolladorDNI").value;
    const email = document.getElementById("desarrolladorEmail").value;

    const desarrollador = {
        nombre: nombre,
        dNICuit: dni,
        email: email,
        puestoLaboralID: document.getElementById("desarrolladorPuestoLaboralID").value,
        telefono: document.getElementById("desarrolladorTeléfono").value,
        observaciones: document.getElementById("desarrolladorObservacion").value,
    };
    const res = await authFetch(`desarrolladores`, {
        method: "POST",
        body: JSON.stringify(desarrollador)
    });

    if (res.ok) {
        getDesarrolladores();
    } else {
        alert("Error al crear: " + await res.text());
    }
}

async function updateDesarrollador() {
    const API_URL = `${BASE_API_URL}desarrolladores`;
    const id = document.getElementById("editarDesarrolladorId").value;
    
    const nombre = document.getElementById("desarrolladorNombre").value;
    const dni = document.getElementById("desarrolladorDNI").value;
    const email = document.getElementById("desarrolladorEmail").value;

    const desarrollador = {
        desarrolladorID: id,
        nombre: nombre,
        dNICuit: dni,
        puestoLaboralID: document.getElementById("desarrolladorPuestoLaboralID").value,
        email: email,
        telefono: document.getElementById("desarrolladorTeléfono").value,
        observaciones: document.getElementById("desarrolladorObservacion").value,
    };
    
    const getToken = () => localStorage.getItem("token");
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    });
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(desarrollador)
    });

    if (res.ok) {
        getDesarrolladores();
    } else {
        alert("Error al actualizar: " + await res.text());
    }
}

async function deleteDesarrollador(id, accion) {
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
            const res = await authFetch(`desarrolladores/${id}?accion=${accion}`, {
                method: "DELETE"
            });

            if (res.ok) {
                getDesarrolladores();
            } else {
                alert("Error al eliminar: " + await res.text());
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Ocurrió un error inesperado.");
        }
    }
}

// Cargar Puestos Laborales al iniciar
comboPuestosLaborales();