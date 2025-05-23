using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Szolgaltatas
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required] [StringLength(100)] public string Nev { get; set; }

    public ICollection<VedonoSzolgaltatas> VedonoSzolgaltatasok { get; set; } = new List<VedonoSzolgaltatas>();
    public ICollection<SzolgaltatasIdopont> SzolgaltatasIdopontok { get; set; } = new List<SzolgaltatasIdopont>();
    public ICollection<Idopontfoglalas> Idopontfoglalasok { get; set; } = new List<Idopontfoglalas>();
}