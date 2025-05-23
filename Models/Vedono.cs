using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Vedono
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Regisztracio")] public int FelhasznaloID { get; set; }

    [StringLength(100)] public string Munkahely { get; set; }

    public string MunkaIdo { get; set; }

    [StringLength(500)] public string Bio { get; set; }

    public Regisztracio Regisztracio { get; set; }
    public ICollection<Elerhetoseg> ElerhetosegLista { get; set; }
    public ICollection<VedonoSzolgaltatas> VedonoSzolgaltatasok { get; set; }
}