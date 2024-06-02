﻿// <auto-generated />
using System;
using Memrise.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Memrise.Migrations
{
    [DbContext(typeof(MemriseContext))]
    [Migration("20240516231251_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.30")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Memrise.Entities.Diretorio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("IdUsuario")
                        .HasColumnType("int");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("IdUsuario");

                    b.ToTable("Diretorios");
                });

            modelBuilder.Entity("Memrise.Entities.Tarefa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Descricao")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Finalizada")
                        .HasColumnType("bit");

                    b.Property<int?>("IdDiretorio")
                        .HasColumnType("int");

                    b.Property<DateTime>("Prazo")
                        .HasColumnType("datetime2");

                    b.Property<bool>("Prioridade")
                        .HasColumnType("bit");

                    b.Property<string>("Titulo")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("IdDiretorio");

                    b.ToTable("Tarefas");
                });

            modelBuilder.Entity("Memrise.Entities.Usuario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Senha")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("Memrise.Entities.Diretorio", b =>
                {
                    b.HasOne("Memrise.Entities.Usuario", "Usuario")
                        .WithMany("Diretorios")
                        .HasForeignKey("IdUsuario");

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("Memrise.Entities.Tarefa", b =>
                {
                    b.HasOne("Memrise.Entities.Diretorio", "Diretorio")
                        .WithMany("Tarefas")
                        .HasForeignKey("IdDiretorio");

                    b.Navigation("Diretorio");
                });

            modelBuilder.Entity("Memrise.Entities.Diretorio", b =>
                {
                    b.Navigation("Tarefas");
                });

            modelBuilder.Entity("Memrise.Entities.Usuario", b =>
                {
                    b.Navigation("Diretorios");
                });
#pragma warning restore 612, 618
        }
    }
}
