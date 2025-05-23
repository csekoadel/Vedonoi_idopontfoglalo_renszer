using Microsoft.EntityFrameworkCore;
using Models;

namespace Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Felhasznalo> Felhasznalo { get; set; }
    public DbSet<Szulo> Szulo { get; set; }
    public DbSet<Vedono> Vedono { get; set; }
    public DbSet<Gyermek> Gyermek { get; set; }
    public DbSet<Idopontfoglalas> Idopontfoglalas { get; set; }
    public DbSet<Elerhetoseg> Elerhetoseg { get; set; }
    public DbSet<Statusz> Statusz { get; set; }
    public DbSet<Regisztracio> Regisztracio { get; set; }
    public DbSet<Szolgaltatas> Szolgaltatas { get; set; }
    public DbSet<ElerhetosegSzolgaltatas> ElerhetosegSzolgaltatas { get; set; }
    public DbSet<SzolgaltatasIdopont> SzolgaltatasIdopont { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Szulo>()
            .HasOne(s => s.Felhasznalo)
            .WithOne()
            .HasForeignKey<Szulo>(s => s.FelhasznaloID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Felhasznalo>()
            .Property(f => f.Szerepkor)
            .HasConversion<string>();

        modelBuilder.Entity<Szulo>()
            .HasOne(s => s.Regisztracio)
            .WithOne(r => r.Szulo)
            .HasForeignKey<Szulo>(s => s.FelhasznaloID);

        modelBuilder.Entity<Vedono>()
            .HasOne(v => v.Regisztracio)
            .WithOne(r => r.Vedono)
            .HasForeignKey<Vedono>(v => v.FelhasznaloID);

        modelBuilder.Entity<Gyermek>()
            .HasOne(g => g.Szulo)
            .WithMany(s => s.Gyerekek)
            .HasForeignKey(g => g.SzuloID);

        modelBuilder.Entity<Elerhetoseg>()
            .HasOne<Vedono>()
            .WithMany(v => v.ElerhetosegLista)
            .HasForeignKey(e => e.VedonoID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Elerhetoseg>()
            .Property(e => e.HetNapjai)
            .HasConversion<string>();

        modelBuilder.Entity<VedonoSzolgaltatas>()
            .HasOne(vs => vs.Vedono)
            .WithMany(v => v.VedonoSzolgaltatasok)
            .HasForeignKey(vs => vs.VedonoID);

        modelBuilder.Entity<VedonoSzolgaltatas>()
            .HasOne(vs => vs.Szolgaltatas)
            .WithMany(s => s.VedonoSzolgaltatasok)
            .HasForeignKey(vs => vs.SzolgaltatasID);

        modelBuilder.Entity<SzolgaltatasIdopont>()
            .HasOne(si => si.Szolgaltatas)
            .WithMany(s => s.SzolgaltatasIdopontok)
            .HasForeignKey(si => si.SzolgaltatasID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SzolgaltatasIdopont>()
            .HasOne(si => si.Szolgaltatas)
            .WithMany(s => s.SzolgaltatasIdopontok)
            .HasForeignKey(si => si.SzolgaltatasID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Idopontfoglalas>()
            .HasOne(ifoglalas => ifoglalas.Szolgaltatas)
            .WithMany(s => s.Idopontfoglalasok)
            .HasForeignKey(ifoglalas => ifoglalas.SzolgaltatasID)
            .OnDelete(DeleteBehavior.Restrict);
    }
}