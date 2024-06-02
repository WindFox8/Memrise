using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Memrise.Entities
{
    public class Tarefa
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Titulo { get; set; }

        public string Descricao { get; set; }

        [Column(TypeName = "Date")] // Define o tipo de coluna no banco de dados como "Date"
        [Required]
        public DateTime Prazo { get; set; }

        [Required]
        public bool Prioridade { get; set; }

        [Required]
        public bool Finalizada { get; set; }

        public int? IdDiretorio { get; set; }

        public int? IdUsuario { get; set; }

        [ForeignKey("IdDiretorio")]
        public Diretorio Diretorio { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }
    }
}
