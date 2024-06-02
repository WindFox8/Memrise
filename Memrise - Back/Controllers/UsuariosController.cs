using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Memrise.Data;
using Memrise.Entities;

namespace Memrise.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly MemriseContext _context;

        public UsuariosController(MemriseContext context)
        {
            _context = context;
        }

        // POST: api/Usuarios/Cadastrar
        [HttpPost("Cadastrar")]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Adiciona o usuário
                    _context.Usuarios.Add(usuario);
                    await _context.SaveChangesAsync();

                    // Cria o diretório "main" para o usuário recém-criado
                    var mainDiretorio = new Diretorio
                    {
                        Nome = "main",
                        IdUsuario = usuario.Id
                    };

                    _context.Diretorios.Add(mainDiretorio);
                    await _context.SaveChangesAsync();

                    // Cria a tarefa de boas-vindas
                    var welcomeTask = new Tarefa
                    {
                        Titulo = "Seja bem-vindo",
                        Descricao = "Esta é sua tarefa inicial.",
                        Prazo = DateTime.Today,
                        Prioridade = true,
                        Finalizada = true,
                        IdDiretorio = mainDiretorio.Id,
                        IdUsuario = usuario.Id
                    };

                    _context.Tarefas.Add(welcomeTask);
                    await _context.SaveChangesAsync();

                    // Confirma a transação
                    await transaction.CommitAsync();

                    return Ok(true);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return Ok(false);
                }
            }
        }

        // GET: api/Usuarios/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // GET: api/Usuarios/VerificarEmail?email={email}
        [HttpGet("VerificarEmail")]
        public async Task<ActionResult<bool>> VerificarEmailExistente(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("O email não pode estar vazio");
            }

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

            return usuario != null;
        }

        // POST: api/Usuarios/Login
        [HttpPost("Login")]
        public async Task<ActionResult<dynamic>> Login(LoginViewModel model)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == model.Email && u.Senha == model.Senha);

            if (usuario == null)
            {
                return NotFound(false);
            }

            return Ok(new { Id = usuario.Id, Nome = usuario.Nome });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Diretorios)
                    .ThenInclude(d => d.Tarefas)
                .FirstOrDefaultAsync(u => u.Id == id);
            
            if (usuario == null)
            {
                return NotFound();
            }

            foreach (var diretorio in usuario.Diretorios)
            {
                if (diretorio.Tarefas != null && diretorio.Tarefas.Any())
                {
                    _context.Tarefas.RemoveRange(diretorio.Tarefas);
                }
            }

            _context.Diretorios.RemoveRange(usuario.Diretorios);

            _context.Usuarios.Remove(usuario);

            await _context.SaveChangesAsync();

            return Ok(true);
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }

    public class LoginViewModel
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}
