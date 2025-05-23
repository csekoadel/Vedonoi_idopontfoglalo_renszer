using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Szulo
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Felhasznalo")] public int FelhasznaloID { get; set; }

    [StringLength(100)] public string Lakcim { get; set; }

    public Felhasznalo Felhasznalo { get; set; }
    public Regisztracio Regisztracio { get; set; }
    public ICollection<Gyermek> Gyerekek { get; set; }
}