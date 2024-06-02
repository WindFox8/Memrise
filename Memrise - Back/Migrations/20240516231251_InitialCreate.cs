using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Memrise.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Diretorios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diretorios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Diretorios_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prazo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Prioridade = table.Column<bool>(type: "bit", nullable: false),
                    Finalizada = table.Column<bool>(type: "bit", nullable: false),
                    IdDiretorio = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarefas_Diretorios_IdDiretorio",
                        column: x => x.IdDiretorio,
                        principalTable: "Diretorios",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Diretorios_IdUsuario",
                table: "Diretorios",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_IdDiretorio",
                table: "Tarefas",
                column: "IdDiretorio");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "Diretorios");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
