using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ezpeleta2025.Models.General;
using Microsoft.AspNetCore.Authorization;

namespace APILogin2025.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HistorialController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Historial      
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<HistorialTicket>>> GetHistorial(int id)
        {

            var historialTicket = await _context.HistorialTickets.Where(h => h.TicketID == id).OrderByDescending(c => c.FechaCambio).ToListAsync();
            foreach (var historial in historialTicket)
            {
                var usuarioCrea = _context.Users.Where(u => u.Id == historial.UsuarioID).SingleOrDefault();
                if (usuarioCrea != null)
                {
                    historial.UsuarioEmail = usuarioCrea.Email;
                }
            }


            return historialTicket.ToList();
        }
    }
}
