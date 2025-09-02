using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.Models.General
{
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set; }
        public string? Nombre { get; set; }
        public bool Eliminado { get; set; }

        public virtual ICollection<Ticket>? Tickets { get; set; }
    }

    public class TicketsPorCategoria
    {
        public int CategoriaID { get; set; }
        public string? Nombre { get; set; }
        public int Cantidad { get; set; }
    }
}