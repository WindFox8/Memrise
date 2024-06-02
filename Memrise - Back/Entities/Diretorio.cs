using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Memrise.Entities
{
    public class Diretorio
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Nome { get; set; }

        public int? IdUsuario { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }

        public ICollection<Tarefa> Tarefas { get; set; }
    }
}
