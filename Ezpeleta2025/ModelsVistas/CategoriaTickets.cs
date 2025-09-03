using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.ModelsVistas
{
    public class CategoriaTickets
    {
        [Key]
        public int CategoriaID { get; set; }
        public string? Nombre { get; set; }
        public List<VistaTickets>? Tickets { get; set; }
    }
}