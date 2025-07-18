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
    public class PuestoLaboralesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PuestoLaboralesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PuestoLaborales
        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PuestoLaboral>>> GetPuestoLaborales()
        {
           
            return await _context.PuestoLaborales.OrderBy(c => c.Nombre).ToListAsync();
        }

        // GET: api/PuestoLaborales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PuestoLaboral>> GetPuestoLaboral(int id)
        {
            var PuestoLaboral = await _context.PuestoLaborales.FindAsync(id);

            if (PuestoLaboral == null)
            {
                return NotFound();
            }

            return PuestoLaboral;
        }

        // PUT: api/PuestoLaborales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuestoLaboral(int id, PuestoLaboral PuestoLaboral)
        {
            if (id != PuestoLaboral.PuestoLaboralID)
            {
                return BadRequest();
            }

            _context.Entry(PuestoLaboral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PuestoLaboralExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PuestoLaborales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PuestoLaboral>> PostPuestoLaboral(PuestoLaboral PuestoLaboral)
        {
            _context.PuestoLaborales.Add(PuestoLaboral);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPuestoLaboral", new { id = PuestoLaboral.PuestoLaboralID }, PuestoLaboral);
        }

        // DELETE: api/PuestoLaborales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuestoLaboral(int id, int accion)
        {
            var PuestoLaboral = await _context.PuestoLaborales.FindAsync(id);
            if (PuestoLaboral == null)
            {
                return NotFound();
            }
            if (accion == 1)
            {
                PuestoLaboral.Eliminado = true;
                 await _context.SaveChangesAsync();
            }
            else
            {
                PuestoLaboral.Eliminado = false;
                 await _context.SaveChangesAsync();
            }
           

            return NoContent();
        }

        private bool PuestoLaboralExists(int id)
        {
            return _context.PuestoLaborales.Any(e => e.PuestoLaboralID == id);
        }
    }
}
