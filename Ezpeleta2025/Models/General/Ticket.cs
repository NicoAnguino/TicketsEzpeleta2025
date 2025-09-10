using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ezpeleta2025.Models.General
{
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public EstadoTicket Estado { get; set; }

        [NotMapped]
        public string EstadoString { get { return Estado.ToString(); } }
        public PrioridadTicket Prioridad { get; set; }

        [NotMapped]
        public string PrioridadString { get { return Prioridad.ToString(); } }
        public DateTime FechaCreacion { get; set; }

        [NotMapped]
        public string FechaCreacionString { get { return FechaCreacion.ToString("dd/MM/yyyy HH:mm"); } }

        [NotMapped]
        public string? CategoriaString { get { return Categoria?.Nombre; } }

        public DateTime FechaComienzo { get; set; }
        public DateTime FechaCierre { get; set; }
        public int CategoriaID { get; set; }
        public string? UsuarioClienteID { get; set; }

        [NotMapped]
        public string? UsuarioClienteEmail { get; set; }

        public virtual Categoria? Categoria { get; set; }
    }

    public enum EstadoTicket
    {
        Abierto = 1,
        EnProceso,
        Cerrado,
        Cancelado
    }

    public enum PrioridadTicket
    {
        Baja = 1,
        Media,
        Alta
    }

    public class FiltroTicket
    {
        public string? FechaDesde { get; set; }
        public string? FechaHasta { get; set; }
        public int CategoriaID { get; set; }
        public int Prioridad { get; set; }
        public int Estado { get; set; }
    }
}