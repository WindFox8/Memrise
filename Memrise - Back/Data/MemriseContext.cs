using Microsoft.EntityFrameworkCore;
using Memrise.Entities;

namespace Memrise.Data
{
    public class MemriseContext : DbContext
    {
        public MemriseContext(DbContextOptions<MemriseContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Diretorio> Diretorios { get; set; }
        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
