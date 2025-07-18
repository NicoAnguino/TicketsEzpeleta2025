using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ezpeleta2025.Models.General;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace APILogin2025.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DesarrolladoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public DesarrolladoresController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Desarrolladores
        //[Authorize(Roles = "ADMINISTRADOR")]
        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Desarrollador>>> GetDesarrolladores()
        {
            //  var usuarioLogueadoID = HttpContext.User.Identity.Name;
            //  var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //  var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            return await _context.Desarrolladores.OrderBy(c => c.Nombre).ToListAsync();
        }

        // GET: api/Desarrolladores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Desarrollador>> GetDesarrollador(int id)
        {
            var desarrollador = await _context.Desarrolladores.FindAsync(id);

            if (desarrollador == null)
            {
                return NotFound();
            }

            return desarrollador;
        }

        // PUT: api/Desarrolladores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDesarrollador(int id, Desarrollador desarrollador)
        {
            if (id != desarrollador.DesarrolladorID)
            {
                return BadRequest();
            }

            try
            {
                if (!_context.Desarrolladores.Any(c => c.DNICuit == desarrollador.DNICuit && c.DesarrolladorID != desarrollador.DesarrolladorID))
                {
                    var desarrolladorEditar = await _context.Desarrolladores.FindAsync(id);
                    if (desarrolladorEditar != null)
                    {
                        desarrolladorEditar.Nombre = desarrollador.Nombre;
                        desarrolladorEditar.Telefono = desarrollador.Telefono;
                        desarrolladorEditar.Observaciones = desarrollador.Observaciones;
                        desarrolladorEditar.DNICuit = desarrollador.DNICuit;
                        desarrolladorEditar.PuestoLaboralID = desarrollador.PuestoLaboralID;

                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DesarrolladorExists(id))
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

        // POST: api/Desarrolladores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Desarrollador>> PostDesarrollador(Desarrollador desarrollador)
        {
            if (!String.IsNullOrEmpty(desarrollador.Nombre) && !String.IsNullOrEmpty(desarrollador.DNICuit) && !String.IsNullOrEmpty(desarrollador.Email))
            {
                //VALIDAR QUE NO EXISTA CON EL MISMO NUMERO DE DOCUMENTO
                if (!_context.Desarrolladores.Any(c => c.DNICuit == desarrollador.DNICuit))
                {
                    _context.Desarrolladores.Add(desarrollador);
                    await _context.SaveChangesAsync();

                    //ARMAMOS EL OBJETO COMPLETANDO LOS ATRIBUTOS COMPLETADOS POR EL USUARIO
                    var user = new ApplicationUser
                    {
                        UserName = desarrollador.Email,
                        Email = desarrollador.Email,
                        NombreCompleto = desarrollador.Nombre
                    };

                    var result = await _userManager.CreateAsync(user, "Ezpeleta2025");
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, "DESARROLLADOR");
                    }
                }

            }

            return CreatedAtAction("GetDesarrollador", new { id = desarrollador.DesarrolladorID }, desarrollador);
        }

        // DELETE: api/Desarrolladores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDesarrollador(int id, int accion)
        {
            var desarrollador = await _context.Desarrolladores.FindAsync(id);
            if (desarrollador == null)
            {
                return NotFound();
            }
            if (accion == 1)
            {
                desarrollador.Eliminado = true;
                await _context.SaveChangesAsync();
            }
            else
            {
                desarrollador.Eliminado = false;
                await _context.SaveChangesAsync();
            }


            return NoContent();
        }

        private bool DesarrolladorExists(int id)
        {
            return _context.Desarrolladores.Any(e => e.DesarrolladorID == id);
        }
    }
}
