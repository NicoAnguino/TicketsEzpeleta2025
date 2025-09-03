using Ezpeleta2025.Models.General;

namespace Ezpeleta2025.ModelsVistas
{
    public class VistaTickets
    {
        public int TicketID { get; set; }
        public string Titulo { get; set; }
        public PrioridadTicket Prioridad { get; set; }
        public string EstadoString { get; set; }
        public string FechaCreacionString { get; set; }
        public string PrioridadString { get; set; }
        public string? CategoriaString { get; set; }

    }
}