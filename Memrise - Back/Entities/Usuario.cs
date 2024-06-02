using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Memrise.Entities
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string Senha { get; set; }

        [Required]
        [StringLength(255)]
        public string Nome { get; set; }

        public ICollection<Diretorio> Diretorios { get; set; }
    }
}
