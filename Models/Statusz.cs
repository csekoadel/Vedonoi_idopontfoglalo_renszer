using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Statusz
{
    public enum HetNapjaEnum
    {
        [Display(Name = "Hétfő")] Hetfo,

        [Display(Name = "Kedd")] Kedd,

        [Display(Name = "Szerda")] Szerda,

        [Display(Name = "Csütörtök")] Csutortok,

        [Display(Name = "Péntek")] Pentek,

        [Display(Name = "Szombat")] Szombat,

        [Display(Name = "Vasárnap")] Vasarnap
    }

    public enum VedoNoStatuszEnum
    {
        [Display(Name = "Elérhető")] Elerheto,

        [Display(Name = "Szabadságon")] Szabadsagon,

        [Display(Name = "Elfoglalt")] Elfoglalt
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Vedono")] public int VedonoID { get; set; }

    [Required] [StringLength(20)] public VedoNoStatuszEnum StatuszA { get; set; }

    [Required] [StringLength(50)] public HetNapjaEnum HetNapjai { get; set; }

    [Required] public DateTime StausztBeallIdopont { get; set; }
}