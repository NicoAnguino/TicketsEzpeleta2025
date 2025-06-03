using Ezpeleta2025.Models.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILogin2025.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VistaTickets>>> GetTickets()
        {
            List<VistaTickets> vista = new List<VistaTickets>();

            var tickets = await _context.Tickets.Include(c => c.Categoria).ToListAsync();

            foreach (var ticket in tickets.OrderByDescending(t => t.FechaCreacion))
            {
                var ticketMostrar = new VistaTickets
                {
                    TicketID = ticket.TicketID,
                    Titulo = ticket.Titulo,
                    FechaCreacionString = ticket.FechaCreacionString,
                    Prioridad = ticket.Prioridad,
                    EstadoString = ticket.EstadoString,
                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                vista.Add(ticketMostrar);
            }

            return vista.ToList();
        }

        [HttpPost("filtrar")]
        public async Task<ActionResult<IEnumerable<VistaTickets>>> FiltrarTickets([FromBody] FiltroTicket filtro)
        {
            List<VistaTickets> vista = new List<VistaTickets>();

            var tickets = _context.Tickets.Include(t => t.Categoria).AsQueryable();

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            foreach (var ticket in tickets.OrderByDescending(t => t.FechaCreacion))
            {
                var ticketMostrar = new VistaTickets
                {
                    TicketID = ticket.TicketID,
                    Titulo = ticket.Titulo,
                    FechaCreacionString = ticket.FechaCreacionString,
                    Prioridad = ticket.Prioridad,
                    EstadoString = ticket.EstadoString,
                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                vista.Add(ticketMostrar);
            }

            return vista.ToList();
        }

        // GET: api/GetTicket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        // PUT: api/Tickets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticket)
        {
            if (id != ticket.TicketID)
            {
                return BadRequest();
            }

            try
            {
                //2- ES MODIFICAR SOLO LOS CAMPOS DESEADOS
                //PRIMERO BUSCAMOS EL TICKET A MODIFICAR
                var ticketEditar = await _context.Tickets.FindAsync(id);
                //PREGUNTAMOS SI ES DISTINTO DE NULL, ES DECIR SI EXISTE EL REGISTRO CON ESE ID
                if (ticketEditar != null)
                {
                    DateTime fechaCambio = DateTime.Now;
                    //COMENZAMOS CON LA EDICION DE LOS DATOS
                    //TITULO, DESCRIPCION, PRIORIDAD, CATEGORIAID
                    if (ticketEditar.Titulo != ticket.Titulo)
                    {
                        var historialTicketTitulo = new HistorialTicket
                        {
                            TicketID = ticket.TicketID,
                            CampoModificado = "TITULO",
                            ValorAnterior = ticketEditar.Titulo,
                            ValorNuevo = ticket.Titulo,
                            FechaCambio = fechaCambio
                        };
                        _context.HistorialTickets.Add(historialTicketTitulo);
                        await _context.SaveChangesAsync();

                        ticketEditar.Titulo = ticket.Titulo;
                    }

                    if (ticketEditar.Descripcion != ticket.Descripcion)
                    {

                        var historialTicketDescripcion = new HistorialTicket
                        {
                            TicketID = ticket.TicketID,
                            CampoModificado = "DESCRIPCION",
                            ValorAnterior = ticketEditar.Descripcion,
                            ValorNuevo = ticket.Descripcion,
                            FechaCambio = fechaCambio
                        };
                        _context.HistorialTickets.Add(historialTicketDescripcion);
                        await _context.SaveChangesAsync();

                        ticketEditar.Descripcion = ticket.Descripcion;
                    }


                    if (ticketEditar.Prioridad != ticket.Prioridad)
                    {
                        var historialTicketPrioridad = new HistorialTicket
                        {
                            TicketID = ticket.TicketID,
                            CampoModificado = "PRIORIDAD",
                            ValorAnterior = ticketEditar.Prioridad.ToString(),
                            ValorNuevo = ticket.Prioridad.ToString(),
                            FechaCambio = fechaCambio
                        };
                        _context.HistorialTickets.Add(historialTicketPrioridad);
                        await _context.SaveChangesAsync();

                        ticketEditar.Prioridad = ticket.Prioridad;
                    }

                    if (ticketEditar.CategoriaID != ticket.CategoriaID)
                    {

                        var categoriaAnterior = _context.Categorias.Where(c => c.CategoriaID == ticketEditar.CategoriaID).Single();
                        var categoriaNueva = _context.Categorias.Where(c => c.CategoriaID == ticket.CategoriaID).Single();

                        var historialTicketCategoria = new HistorialTicket
                        {
                            TicketID = ticket.TicketID,
                            CampoModificado = "CATEGORIA",
                            ValorAnterior = categoriaAnterior.Nombre,
                            ValorNuevo = categoriaNueva.Nombre,
                            FechaCambio = fechaCambio
                        };
                        _context.HistorialTickets.Add(historialTicketCategoria);
                        await _context.SaveChangesAsync();

                        ticketEditar.CategoriaID = ticket.CategoriaID;
                    }

                    await _context.SaveChangesAsync();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tickets
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket ticket)
        {
            //LO QUE DEBEMOS HACER ES GUARDAR LOS SIGUIENTES DATOS FIJOS
            //EL ESTADO DEL TICKET POR DEFECTO ES ABIERTO
            ticket.Estado = EstadoTicket.Abierto;
            //-LA FECHA DE CREACION = LA FECHA ACTUAL DE CUANDO PRESIONA EL BOTON GUARDAR
            ticket.FechaCreacion = DateTime.Now;
            //LA FECHA DE CIERRE = UNA FECHA FIJA ESTANDAR HASTA QUE SE CIERRE REALMENTE EL TICKET
            ticket.FechaCierre = Convert.ToDateTime("01/01/2025");
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTicket", new { id = ticket.TicketID }, ticket);
        }

        private bool TicketExists(int id)
        {
            return _context.Tickets.Any(e => e.TicketID == id);
        }

    }
}