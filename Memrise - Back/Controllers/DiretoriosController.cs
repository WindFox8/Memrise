using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Memrise.Data;
using Memrise.Entities;
using System;
using System.Threading.Tasks;

namespace Memrise.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiretoriosController : ControllerBase
    {
        private readonly MemriseContext _context;

        public DiretoriosController(MemriseContext context)
        {
            _context = context;
        }

        // POST: api/Diretorios/CriarDiretorio/{idUsuario}
        [HttpPost("CriarDiretorio/{idUsuario}")]
        public async Task<ActionResult<Diretorio>> CriarDiretorio(int idUsuario, Diretorio diretorio)
        {
            var usuarioExistente = await _context.Usuarios.FindAsync(idUsuario);
            if (usuarioExistente == null)
            {
                return Ok(false);
            }

            diretorio.IdUsuario = idUsuario;
            _context.Diretorios.Add(diretorio);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        // Método para obter um diretório pelo ID
        private async Task<Diretorio> ObterDiretorio(int id)
        {
            return await _context.Diretorios.FirstOrDefaultAsync(d => d.Id == id);
        }

        // GET: api/Diretorios/Usuario/{idUsuario}/Nomes
        [HttpGet("Usuario/{idUsuario}/Nomes")]
        public async Task<ActionResult<IEnumerable<DiretorioIdNome>>> ObterNomesDiretoriosPorUsuario(int idUsuario)
        {
            var diretorios = await _context.Diretorios
                .Where(d => d.IdUsuario == idUsuario)
                .Select(d => new DiretorioIdNome { Id = d.Id, Nome = d.Nome })
                .ToListAsync();

            return Ok(diretorios);
        }

        // PUT: api/Diretorios
        [HttpPut]
        public async Task<IActionResult> AlterarDiretorio(DiretorioIdNome model)
        {
            var diretorio = await _context.Diretorios.FindAsync(model.Id);
            if (diretorio == null)
            {
                return NotFound();
            }

            diretorio.Nome = model.Nome;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiretorioExists(model.Id))
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

        // DELETE: api/Diretorios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarDiretorio(int id)
        {
            var diretorio = await _context.Diretorios
                .Include(d => d.Tarefas)
                .FirstOrDefaultAsync(d => d.Id == id);
                
            if (diretorio == null)
            {
                return NotFound();
            }

            // Remover manualmente as tarefas associadas
            if (diretorio.Tarefas != null && diretorio.Tarefas.Any())
            {
                _context.Tarefas.RemoveRange(diretorio.Tarefas);
            }

            // Remover o diretório
            _context.Diretorios.Remove(diretorio);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        private bool DiretorioExists(int id)
        {
            return _context.Diretorios.Any(e => e.Id == id);
        }
    }

    public class DiretorioIdNome
    {
        public int Id { get; set; }
        public string Nome { get; set; }
    }
}
