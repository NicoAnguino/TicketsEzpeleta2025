//HACER PRIMERO EL METODO PARA ARMAR EL COMBO DESPLEGABLE DE CATEGORIAS
async function comboCategorias() {

    const res = await authFetch("categorias");

    const categorias = await res.json();

    const comboSelectBuscar = document.querySelector("#CategoriaIDBuscar");
    comboSelectBuscar.innerHTML = "";


    let opcionesBuscar = `<option value="0">[Todas las categorias]</option>`;
    categorias.forEach(cat => {

        opcionesBuscar += `<option value="${cat.categoriaID}">${cat.nombre}</option>`;
    });
  
    comboSelectBuscar.innerHTML = opcionesBuscar;

    getTickets();
}

const inputCategoria = document.getElementById("CategoriaIDBuscar");
inputCategoria.onchange = function () {
    getTickets();
};

const inputPrioridad = document.getElementById("PrioridadIDBuscar");
inputPrioridad.onchange = function () {
    getTickets();
};

const inputEstado = document.getElementById("EstadoIDBuscar");
inputEstado.onchange = function () {
    getTickets();
};

const inputFechaDesde = document.getElementById("FechaDesdeBuscar");
inputFechaDesde.onchange = function () {
    getTickets();
};

const inputFechaHasta = document.getElementById("FechaHastaBuscar");
inputFechaHasta.onchange = function () {
    getTickets();
};

async function getTickets() {
    let fechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let fechaHasta = document.getElementById("FechaHastaBuscar").value;

    const fecha1 = new Date(fechaDesde);
    const fecha2 = new Date(fechaHasta);

    if (fecha1 > fecha2) {
        fechaHasta = fechaDesde;
        document.getElementById("FechaHastaBuscar").value = fechaDesde;
    }

    const filtros = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        categoriaID: document.getElementById("CategoriaIDBuscar").value,
        prioridad: document.getElementById("PrioridadIDBuscar").value,
        estado: document.getElementById("EstadoIDBuscar").value
    };

    const res = await authFetch(`tickets/ticketsporcategoria`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const categorias = await res.json();
    const tbody = document.querySelector("#tablaTickets tbody");
    tbody.innerHTML = "";
 
    categorias.forEach(categoria => {

        const rowCategoria = document.createElement("tr");
        rowCategoria.innerHTML = `          
            <td class='text-bold table-success' colspan='4'>${categoria.nombre}</td>          
        `;
        tbody.appendChild(rowCategoria);

        categoria.tickets.forEach(tic => {
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
            <td class="text-center text-bold ${clase}">${tic.prioridadString}</td>
            <td class="text-center text-bold text-primary">${tic.estadoString}</td>
        `;
            tbody.appendChild(row);
        });

    });
}

//getTickets();
comboCategorias();