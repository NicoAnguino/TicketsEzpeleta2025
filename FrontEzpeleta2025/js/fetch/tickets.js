//HACER PRIMERO EL METODO PARA ARMAR EL COMBO DESPLEGABLE DE CATEGORIAS
async function comboCategorias() {

    const res = await authFetch("categorias");

    const categorias = await res.json();
    const comboSelect = document.querySelector("#ticketCategoriaID");
    comboSelect.innerHTML = "";
    let opciones = '';
    categorias.forEach(cat => {

        opciones += `<option value="${cat.categoriaID}">${cat.nombre}</option>`;

    });
    comboSelect.innerHTML = opciones;
}

async function getTickets() {
    const res = await authFetch("tickets");
    const tickets = await res.json();
    const tbody = document.querySelector("#tablaTickets tbody");
    tbody.innerHTML = "";
    limpiarFormulario();
    tickets.forEach(tic => {
        const row = document.createElement("tr");
        let clase = "text-info";
        if (tic.prioridad == 2) {
            clase = "text-warning";
        } else if (tic.prioridad == 3) {
            clase = "text-danger";
        }

        row.innerHTML = `
            <td class="text-center">${tic.fechaCreacionString}</td>
            <td class='text-bold'>${tic.titulo}</td>
            <td>${tic.categoriaString}</td>
            <td class="text-center text-bold ${clase}">${tic.prioridadString}</td>
            <td class="text-center text-bold text-primary">${tic.estadoString}</td>
            <td class="text-center">               
                <button class="btn btn-primary btn-circle" onclick="prepararEdicion(${tic.ticketID})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-primary btn-circle" onclick="buscarHistorial(${tic.ticketID})"><i class="fas fa-search"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });


    $("#ticketModal").modal("hide");

    comboCategorias();
}

function limpiarFormulario() {
    document.getElementById("ModalTicketLabel").textContent = "Registro de Ticket";
    document.getElementById("ticketId").value = 0;
    document.getElementById("ticketTitulo").value = '';
    document.getElementById("ticketDescripcion").value = '';
}

function guardarTicket() {
    let ticketId = document.getElementById("ticketId").value;

    const ticketTitulo = document.getElementById("ticketTitulo").value.trim();
    if (ticketTitulo) {
        if (ticketId == 0) {
            createTicket();
        }
        else {
            updateTicket();
        }
    }
else {
    alert("Ingrese el titulo");
}

}

async function createTicket() {
    const ticketTitulo = document.getElementById("ticketTitulo").value;
    const ticketDescripcion = document.getElementById("ticketDescripcion").value;
    const ticketPrioridad = Number(document.getElementById("ticketPrioridad").value);
    const ticketCategoriaID = Number(document.getElementById("ticketCategoriaID").value);
    const ticket = {
        titulo: ticketTitulo,
        descripcion: ticketDescripcion,
        prioridad: ticketPrioridad,
        categoriaID: ticketCategoriaID
    };
    console.log(ticket);
    const res = await authFetch(`tickets`, {
        method: "POST",
        body: JSON.stringify(ticket)
    });

    if (res.ok) {
        getTickets();
    } else {
        alert("Error al crear: " + await res.text());
    }
}

async function buscarHistorial(ticketID) {
    const res = await authFetch("historial/" + ticketID);
    const listado = await res.json();
    //console.log(listado);
    const tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = "";
    listado.forEach(tic => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="text-center">${tic.fechaCambioString}</td>
            <td class='text-bold'>${tic.campoModificado}</td>
            <td>${tic.valorAnterior}</td>
             <td>${tic.valorNuevo}</td>
        `;
        tbody.appendChild(row);
    });

    $("#historialModal").modal("show");
}

async function prepararEdicion(ticketID) {
    const res = await authFetch("tickets/" + ticketID);
    const ticket = await res.json();
    document.getElementById("ModalTicketLabel").textContent = "Editar Ticket";
    document.getElementById("ticketId").value = ticket.ticketID;
    document.getElementById("ticketTitulo").value = ticket.titulo;
    document.getElementById("ticketDescripcion").value = ticket.descripcion;
    document.getElementById("ticketPrioridad").value = ticket.prioridad;
    document.getElementById("ticketCategoriaID").value = ticket.categoriaID;
    $("#ticketModal").modal("show");
}

async function updateTicket() {
    const id = document.getElementById("ticketId").value;
    const ticketTitulo = document.getElementById("ticketTitulo").value;
    const ticketDescripcion = document.getElementById("ticketDescripcion").value;
    const ticketPrioridad = Number(document.getElementById("ticketPrioridad").value);
    const ticketCategoriaID = Number(document.getElementById("ticketCategoriaID").value);

    const ticket = {
        ticketID: id,
        titulo: ticketTitulo,
        descripcion: ticketDescripcion,
        prioridad: ticketPrioridad,
        categoriaID: ticketCategoriaID
    };

    const res = await authFetch(`tickets/${id}`, {
        method: "PUT",
        body: JSON.stringify(ticket)
    });

    if (res.ok) {
        getTickets();
    } else {
        alert("Error al actualizar: " + await res.text());
    }
}


getTickets();