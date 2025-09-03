using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.ModelsVistas
{
    public class ClienteTickets
    {
        [Key]
        public int ClienteID { get; set; }
        public string? Nombre { get; set; }
        public string? Email { get; set; }

        public List<VistaTickets>? Tickets { get; set; }
    }
}