using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2025.Models.General
{
    public class Desarrollador
    {
        [Key]
        public int DesarrolladorID { get; set; }
        public string? Nombre { get; set; }
        public string? DNICuit { get; set; }
        public string? Email { get; set; }
        public string? Telefono { get; set; }
        public int PuestoLaboralID { get; set; }
        public string? Observaciones { get; set; }
        public bool Eliminado { get; set; }
        
        public virtual PuestoLaboral? PuestoLaboral { get; set; }
    }
}