﻿// <auto-generated />
using System;
using Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Idopontfoglalo_Rendszer.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Elerhetoseg", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<DateTime>("BefejezesiIdo")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<string>("HetNapjai")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("KezdesiIdo")
                        .HasColumnType("datetime2");

                    b.Property<int>("Statusz")
                        .HasColumnType("int");

                    b.Property<int?>("SzolgaltatasID")
                        .HasColumnType("int");

                    b.Property<int?>("SzuloID")
                        .HasColumnType("int");

                    b.Property<int>("VedonoID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("SzuloID");

                    b.HasIndex("VedonoID");

                    b.ToTable("Elerhetoseg");
                });

            modelBuilder.Entity("Idopont", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<DateTime>("BefejezesiIdo")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("KezdesiIdo")
                        .HasColumnType("datetime2");

                    b.Property<int>("VedonoID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("VedonoID");

                    b.ToTable("Idopont");
                });

            modelBuilder.Entity("Models.ElerhetosegSzolgaltatas", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("ElerhetosegID")
                        .HasColumnType("int");

                    b.Property<int>("SzolgaltatasID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("ElerhetosegID");

                    b.HasIndex("SzolgaltatasID");

                    b.ToTable("ElerhetosegSzolgaltatas");
                });

            modelBuilder.Entity("Models.Felhasznalo", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Felhasznalonev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Jelszo")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Keresztnev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<byte[]>("ProfilkepAdat")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("ProfilkepUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RegisztracioIdopontja")
                        .HasColumnType("datetime2");

                    b.Property<string>("Szerepkor")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Telefonszam")
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<DateTime?>("UtolsoFrissites")
                        .HasColumnType("datetime2");

                    b.Property<string>("Vezeteknev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("ID");

                    b.ToTable("Felhasznalo");
                });

            modelBuilder.Entity("Models.Gyermek", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("Keresztnev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Neme")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<DateTime>("SzuletesiDatum")
                        .HasColumnType("datetime2");

                    b.Property<int>("SzuloID")
                        .HasColumnType("int");

                    b.Property<string>("Vezeteknev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("ID");

                    b.HasIndex("SzuloID");

                    b.ToTable("Gyermek");
                });

            modelBuilder.Entity("Models.Idopontfoglalas", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("BefejezesiIdo")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<string>("FelhasznaloEmail")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FelhasznaloNev")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FelhasznaloTeljesNev")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime>("FoglalasIdopontja")
                        .HasColumnType("datetime2");

                    b.Property<string>("FoglalasIndok")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("KezdesiIdo")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<int>("Statusz")
                        .HasColumnType("int");

                    b.Property<int>("SzolgaltatasID")
                        .HasColumnType("int");

                    b.Property<int>("SzuloID")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UtolsoFrissites")
                        .HasColumnType("datetime2");

                    b.Property<int>("VedonoID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("SzolgaltatasID");

                    b.HasIndex("SzuloID");

                    b.ToTable("Idopontfoglalas");
                });

            modelBuilder.Entity("Models.Regisztracio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Felhasznalonev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("FirebaseUid")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Keresztnev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Szerepkor")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Vezeteknev")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Regisztracio");
                });

            modelBuilder.Entity("Models.Statusz", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("HetNapjai")
                        .HasMaxLength(50)
                        .HasColumnType("int");

                    b.Property<int>("StatuszA")
                        .HasMaxLength(20)
                        .HasColumnType("int");

                    b.Property<DateTime>("StausztBeallIdopont")
                        .HasColumnType("datetime2");

                    b.Property<int>("VedonoID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.ToTable("Statusz");
                });

            modelBuilder.Entity("Models.Szolgaltatas", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("Nev")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("ID");

                    b.ToTable("Szolgaltatas");
                });

            modelBuilder.Entity("Models.SzolgaltatasIdopont", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<bool>("Foglalt")
                        .HasColumnType("bit");

                    b.Property<int>("IdopontID")
                        .HasColumnType("int");

                    b.Property<int>("SzolgaltatasID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("IdopontID");

                    b.HasIndex("SzolgaltatasID");

                    b.ToTable("SzolgaltatasIdopont");
                });

            modelBuilder.Entity("Models.Szulo", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("FelhasznaloID")
                        .HasColumnType("int");

                    b.Property<int?>("FelhasznaloID1")
                        .HasColumnType("int");

                    b.Property<string>("Lakcim")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("ID");

                    b.HasIndex("FelhasznaloID")
                        .IsUnique();

                    b.HasIndex("FelhasznaloID1")
                        .IsUnique()
                        .HasFilter("[FelhasznaloID1] IS NOT NULL");

                    b.ToTable("Szulo");
                });

            modelBuilder.Entity("Models.Vedono", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("Bio")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<int>("FelhasznaloID")
                        .HasColumnType("int");

                    b.Property<string>("MunkaIdo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Munkahely")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("ID");

                    b.HasIndex("FelhasznaloID")
                        .IsUnique();

                    b.ToTable("Vedono");
                });

            modelBuilder.Entity("Models.VedonoSzolgaltatas", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("SzolgaltatasID")
                        .HasColumnType("int");

                    b.Property<int>("VedonoID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("SzolgaltatasID");

                    b.HasIndex("VedonoID");

                    b.ToTable("VedonoSzolgaltatas");
                });

            modelBuilder.Entity("Elerhetoseg", b =>
                {
                    b.HasOne("Models.Felhasznalo", "Szulo")
                        .WithMany()
                        .HasForeignKey("SzuloID");

                    b.HasOne("Models.Vedono", null)
                        .WithMany("ElerhetosegLista")
                        .HasForeignKey("VedonoID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Szulo");
                });

            modelBuilder.Entity("Idopont", b =>
                {
                    b.HasOne("Models.Vedono", "Vedono")
                        .WithMany()
                        .HasForeignKey("VedonoID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Vedono");
                });

            modelBuilder.Entity("Models.ElerhetosegSzolgaltatas", b =>
                {
                    b.HasOne("Elerhetoseg", "Elerhetoseg")
                        .WithMany("ElerhetosegSzolgaltatasok")
                        .HasForeignKey("ElerhetosegID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Szolgaltatas", "Szolgaltatas")
                        .WithMany()
                        .HasForeignKey("SzolgaltatasID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Elerhetoseg");

                    b.Navigation("Szolgaltatas");
                });

            modelBuilder.Entity("Models.Gyermek", b =>
                {
                    b.HasOne("Models.Szulo", "Szulo")
                        .WithMany("Gyerekek")
                        .HasForeignKey("SzuloID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Szulo");
                });

            modelBuilder.Entity("Models.Idopontfoglalas", b =>
                {
                    b.HasOne("Models.Szolgaltatas", "Szolgaltatas")
                        .WithMany("Idopontfoglalasok")
                        .HasForeignKey("SzolgaltatasID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Models.Felhasznalo", "Szulo")
                        .WithMany()
                        .HasForeignKey("SzuloID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Szolgaltatas");

                    b.Navigation("Szulo");
                });

            modelBuilder.Entity("Models.SzolgaltatasIdopont", b =>
                {
                    b.HasOne("Idopont", "Idopont")
                        .WithMany("SzolgaltatasIdopontok")
                        .HasForeignKey("IdopontID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Szolgaltatas", "Szolgaltatas")
                        .WithMany("SzolgaltatasIdopontok")
                        .HasForeignKey("SzolgaltatasID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Idopont");

                    b.Navigation("Szolgaltatas");
                });

            modelBuilder.Entity("Models.Szulo", b =>
                {
                    b.HasOne("Models.Felhasznalo", "Felhasznalo")
                        .WithOne()
                        .HasForeignKey("Models.Szulo", "FelhasznaloID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Regisztracio", "Regisztracio")
                        .WithOne("Szulo")
                        .HasForeignKey("Models.Szulo", "FelhasznaloID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Felhasznalo", null)
                        .WithOne("Szulo")
                        .HasForeignKey("Models.Szulo", "FelhasznaloID1");

                    b.Navigation("Felhasznalo");

                    b.Navigation("Regisztracio");
                });

            modelBuilder.Entity("Models.Vedono", b =>
                {
                    b.HasOne("Models.Regisztracio", "Regisztracio")
                        .WithOne("Vedono")
                        .HasForeignKey("Models.Vedono", "FelhasznaloID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Regisztracio");
                });

            modelBuilder.Entity("Models.VedonoSzolgaltatas", b =>
                {
                    b.HasOne("Models.Szolgaltatas", "Szolgaltatas")
                        .WithMany("VedonoSzolgaltatasok")
                        .HasForeignKey("SzolgaltatasID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Vedono", "Vedono")
                        .WithMany("VedonoSzolgaltatasok")
                        .HasForeignKey("VedonoID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Szolgaltatas");

                    b.Navigation("Vedono");
                });

            modelBuilder.Entity("Elerhetoseg", b =>
                {
                    b.Navigation("ElerhetosegSzolgaltatasok");
                });

            modelBuilder.Entity("Idopont", b =>
                {
                    b.Navigation("SzolgaltatasIdopontok");
                });

            modelBuilder.Entity("Models.Felhasznalo", b =>
                {
                    b.Navigation("Szulo");
                });

            modelBuilder.Entity("Models.Regisztracio", b =>
                {
                    b.Navigation("Szulo");

                    b.Navigation("Vedono");
                });

            modelBuilder.Entity("Models.Szolgaltatas", b =>
                {
                    b.Navigation("Idopontfoglalasok");

                    b.Navigation("SzolgaltatasIdopontok");

                    b.Navigation("VedonoSzolgaltatasok");
                });

            modelBuilder.Entity("Models.Szulo", b =>
                {
                    b.Navigation("Gyerekek");
                });

            modelBuilder.Entity("Models.Vedono", b =>
                {
                    b.Navigation("ElerhetosegLista");

                    b.Navigation("VedonoSzolgaltatasok");
                });
#pragma warning restore 612, 618
        }
    }
}
