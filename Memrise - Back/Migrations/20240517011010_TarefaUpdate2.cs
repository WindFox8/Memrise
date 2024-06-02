using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Memrise.Migrations
{
    public partial class TarefaUpdate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdUsuario",
                table: "Tarefas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_IdUsuario",
                table: "Tarefas",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Tarefas_Usuarios_IdUsuario",
                table: "Tarefas",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tarefas_Usuarios_IdUsuario",
                table: "Tarefas");

            migrationBuilder.DropIndex(
                name: "IX_Tarefas_IdUsuario",
                table: "Tarefas");

            migrationBuilder.DropColumn(
                name: "IdUsuario",
                table: "Tarefas");
        }
    }
}
