let graficoCircularCategorias;

const inputPrioridad = document.getElementById("PrioridadIDBuscar");
inputPrioridad.onchange = function () {
     graficoCircularCategorias.destroy();
    armarGrafico();
};

const inputEstado = document.getElementById("EstadoIDBuscar");
inputEstado.onchange = function () {
     graficoCircularCategorias.destroy();
    armarGrafico();
};

const inputFechaDesde = document.getElementById("FechaDesdeBuscar");
inputFechaDesde.onchange = function () {
     graficoCircularCategorias.destroy();
    armarGrafico();
};

const inputFechaHasta = document.getElementById("FechaHastaBuscar");
inputFechaHasta.onchange = function () {
     graficoCircularCategorias.destroy();
    armarGrafico();
};


async function armarGrafico() {
    //const res = await authFetch("tickets");

    let fechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let fechaHasta = document.getElementById("FechaHastaBuscar").value;

    // Convertir a objetos Date
    const fecha1 = new Date(fechaDesde);
    const fecha2 = new Date(fechaHasta);

    // Comparar
    if (fecha1 > fecha2) {
        //console.log("Fecha 1 es mayor que Fecha 2");
        fechaHasta = fechaDesde;
        document.getElementById("FechaHastaBuscar").value = fechaDesde;
    }

    const filtros = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        categoriaID: 0,
        prioridad: document.getElementById("PrioridadIDBuscar").value,
        estado: document.getElementById("EstadoIDBuscar").value
    };

    const res = await authFetch(`tickets/grafico`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const categorias = await res.json();
    console.log(categorias);
    var labels = [];
    var data = [];
    var fondo = [];

    categorias.forEach(categoria => {
        labels.push(categoria.nombre);
        var color = generarColorVerde();
        fondo.push(color);
        data.push(categoria.cantidad);
    });

    //BUSCAR Y GUARDAR EN UNA VARIABLE EL ELEMENTO DONDE SE VA A DIBUJAR EL GRAFICO
    var ctxPie = document.getElementById("grafico-circular");

    //LUEGO INICIALIZAMOS UN ELEMENTO CHARTS QUE ES EL GRAFICO
    graficoCircularCategorias = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: fondo,
            }],
        },
    });
}

armarGrafico();


function generarColorVerde() {
    // El valor de GG será alto (de 128 a 255) para garantizar que predomine el verde.
    // Los valores de RR y BB serán bajos (de 0 a 127).

    let rr = Math.floor(Math.random() * 128); // 0 a 127
    let gg = Math.floor(Math.random() * 128) + 128; // 128 a 255
    let bb = Math.floor(Math.random() * 128); // 0 a 127

    // Convertimos a hexadecimal y formateamos para que tenga siempre dos dígitos.
    let colorHex = `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
    return colorHex;
}

