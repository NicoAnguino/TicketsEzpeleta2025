//HACER PRIMERO EL METODO PARA ARMAR EL COMBO DESPLEGABLE DE CATEGORIAS
async function comboCategorias() {

    const res = await authFetch("categorias");

    const categorias = await res.json();

    const comboSelectBuscar = document.querySelector("#CategoriaIDBuscar");
    comboSelectBuscar.innerHTML = "";
    const comboSelect = document.querySelector("#ticketCategoriaID");
    comboSelect.innerHTML = "";

    let opcionesBuscar = `<option value="0">[Todas las categorias]</option>`;
    let opciones = '';
    categorias.forEach(cat => {

        opciones += `<option value="${cat.categoriaID}">${cat.nombre}</option>`;
        opcionesBuscar += `<option value="${cat.categoriaID}">${cat.nombre}</option>`;
    });
    comboSelect.innerHTML = opciones;
    comboSelectBuscar.innerHTML = opcionesBuscar;

    getTickets();
}

const input = document.getElementById("CategoriaIDBuscar");
input.onchange = function () {
  getTickets();
};

async function getTickets() {
    //const res = await authFetch("tickets");
    let categoriaIDBuscar = document.getElementById("CategoriaIDBuscar").value;
    const filtros = {
        categoriaID: categoriaIDBuscar
    };

    const res = await authFetch(`tickets/filtrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

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

    //comboCategorias();
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

//getTickets();
comboCategorias();

function Imprimir() {
    var doc = new jsPDF();
    //var doc = new jsPDF('l', 'mm', [297, 210]);

    var totalPagesExp = "{total_pages_count_string}";
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // FOOTER
        var str = "Pagina " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        doc.setLineWidth(8);
        doc.setDrawColor(78, 115, 223);
        doc.setTextColor(255, 255, 255);
        doc.line(14, pageHeight - 11, 196, pageHeight - 11);

        doc.setFontSize(10);

        doc.setFontStyle('bold');

        doc.text(str, 17, pageHeight - 10);
    };


    var elem = document.getElementById("tablaTickets");
    var res = doc.autoTableHtmlToJson(elem);

    // Eliminar la columna 5 (índice 5)
    res.columns.splice(5, 1); // Elimina la columna de encabezado
    res.data = res.data.map(row => {
        row.splice(5, 1); // Elimina la celda correspondiente de cada fila
        return row;
    });

    doc.autoTable(res.columns, res.data,
        {
            addPageContent: pageContent,
            margin: { top: 15 },
            styles: {
                fillStyle: 'DF',
                overflow: 'linebreak',
                columnWidth: 110,
                lineWidth: 0.1,
                lineColor: [238, 238, 238]
            },
            headerStyles: {
                fillColor: [78, 115, 223],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { columnWidth: 28 },//FECHA
                1: { columnWidth: 62 },//TITULO
                2: { columnWidth: 50 },//CATEGORIA
                3: { columnWidth: 20 },//PRIORIDAD
                4: { columnWidth: 20 }//ESTADO
            },
            createdHeaderCell: function (cell, opts) {
                if (opts.column.index == 0 || opts.column.index == 3 || opts.column.index == 4) {
                    cell.styles.halign = 'center';
                }
                cell.styles.fontSize = 8;
            },
            createdCell: function (cell, opts) {
                cell.styles.fontSize = 7;
                if (opts.column.index == 0 || opts.column.index == 3 || opts.column.index == 4) {
                    cell.styles.halign = 'center';
                }
            }
        }
    );

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('Listado de Tickets.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}