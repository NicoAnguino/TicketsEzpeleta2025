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
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public ClientesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Clientes
        //[Authorize(Roles = "ADMINISTRADOR")]
        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            //  var usuarioLogueadoID = HttpContext.User.Identity.Name;
            //  var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //  var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            return await _context.Clientes.OrderBy(c => c.Nombre).ToListAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // PUT: api/Clientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Cliente cliente)
        {
            if (id != cliente.ClienteID)
            {
                return BadRequest();
            }

            try
            {
                if (!_context.Clientes.Any(c => c.DNICuit == cliente.DNICuit && c.ClienteID != cliente.ClienteID))
                {
                    var clienteEditar = await _context.Clientes.FindAsync(id);
                    if (clienteEditar != null)
                    {
                        clienteEditar.Nombre = cliente.Nombre;
                        clienteEditar.Telefono = cliente.Telefono;
                        clienteEditar.Observaciones = cliente.Observaciones;
                        clienteEditar.DNICuit = cliente.DNICuit;

                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // POST: api/Clientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Cliente cliente)
        {
            if (!String.IsNullOrEmpty(cliente.Nombre) && !String.IsNullOrEmpty(cliente.DNICuit) && !String.IsNullOrEmpty(cliente.Email))
            {
                //VALIDAR QUE NO EXISTA CON EL MISMO NUMERO DE DOCUMENTO
                if (!_context.Clientes.Any(c => c.DNICuit == cliente.DNICuit))
                {
                    _context.Clientes.Add(cliente);
                    await _context.SaveChangesAsync();

                    //ARMAMOS EL OBJETO COMPLETANDO LOS ATRIBUTOS COMPLETADOS POR EL USUARIO
                    var user = new ApplicationUser
                    {
                        UserName = cliente.Email,
                        Email = cliente.Email,
                        NombreCompleto = cliente.Nombre
                    };

                    var result = await _userManager.CreateAsync(user, "Ezpeleta2025");
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, "CLIENTE");
                    }
                }

            }

            return CreatedAtAction("GetCliente", new { id = cliente.ClienteID }, cliente);
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id, int accion)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }
            if (accion == 1)
            {
                cliente.Eliminado = true;
                await _context.SaveChangesAsync();
            }
            else
            {
                cliente.Eliminado = false;
                await _context.SaveChangesAsync();
            }


            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.ClienteID == id);
        }
    }
}
