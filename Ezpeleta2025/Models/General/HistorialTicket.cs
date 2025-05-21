using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ezpeleta2025.Models.General
{
    public class HistorialTicket
    {
        [Key]
        public int HistorialTicketID { get; set;}
        public int TicketID { get; set;}
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
        public DateTime FechaCambio { get; set; }

          [NotMapped]
        public string FechaCambioString { get { return FechaCambio.ToString("dd/MM/yyyy HH:mm"); } }

    }
}