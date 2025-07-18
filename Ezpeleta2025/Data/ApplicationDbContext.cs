using Ezpeleta2025.Models.General;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Agrega tus DbSet aquí
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<HistorialTicket> HistorialTickets { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<PuestoLaboral> PuestoLaborales { get; set; }
      public DbSet<Desarrollador> Desarrolladores { get; set; }
}
