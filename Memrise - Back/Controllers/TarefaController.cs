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
    public class TarefasController : ControllerBase
    {
        private readonly MemriseContext _context;

        public TarefasController(MemriseContext context)
        {
            _context = context;
        }

        [HttpPost("CriarTarefa")]
        public async Task<ActionResult<Tarefa>> CriarTarefa(TarefaViewModel model)
        {
            var tarefa = new Tarefa
            {
                Titulo = model.Titulo,
                Descricao = model.Descricao,
                Prazo = model.Prazo,
                Prioridade = model.Prioridade,
                Finalizada = model.Finalizada,
                IdDiretorio = model.IdDiretorio,
                IdUsuario = model.IdUsuario
            };

            _context.Tarefas.Add(tarefa);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarTarefa(int id, TarefaViewModelId model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound();
            }

            tarefa.Titulo = model.Titulo;
            tarefa.Descricao = model.Descricao;
            tarefa.Prazo = model.Prazo;
            tarefa.Prioridade = model.Prioridade;
            tarefa.Finalizada = model.Finalizada;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TarefaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(true);
        }

        private bool TarefaExists(int id)
        {
            return _context.Tarefas.Any(e => e.Id == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound();
            }

            _context.Tarefas.Remove(tarefa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("Usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Tarefa>>> ObterTarefasPorUsuario(int idUsuario)
        {
            var tarefas = await _context.Tarefas
                .Where(t => t.IdUsuario == idUsuario)
                .ToListAsync();

            if (tarefas == null || !tarefas.Any())
            {
                return Ok();
            }

            return Ok(tarefas);
        }

        [HttpPatch("{id}/inverter-prioridade")]
        public async Task<IActionResult> InverterPrioridade(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound();
            }

            tarefa.Prioridade = !tarefa.Prioridade;
            await _context.SaveChangesAsync();

            return Ok(tarefa.Prioridade);
        }

        [HttpPatch("{id}/inverter-finalizado")]
        public async Task<IActionResult> InverterFinalizado(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound();
            }

            tarefa.Finalizada = !tarefa.Finalizada;
            await _context.SaveChangesAsync();

            return Ok(tarefa.Finalizada);
        }
    }

    public class TarefaViewModelId
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime Prazo { get; set; }
        public bool Prioridade { get; set; }
        public bool Finalizada { get; set; }
    }

    public class TarefaViewModel
    {
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime Prazo { get; set; }
        public bool Prioridade { get; set; }
        public bool Finalizada { get; set; }
        public int IdDiretorio { get; set; }
        public int IdUsuario { get; set; }
    }
}
