using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.Models.General
{
    public class PuestoLaboral
    {
        [Key]
        public int PuestoLaboralID { get; set;}
        public string? Nombre { get; set; }
        public bool Eliminado { get; set; }

        public virtual ICollection<Desarrollador>? Desarrolladores { get; set; }
    }
}