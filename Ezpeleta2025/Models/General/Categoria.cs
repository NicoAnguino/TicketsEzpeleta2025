using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.Models.General
{
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set;}
        public string? Nombre { get; set; }
        public bool Eliminado { get; set; }
    }
}