using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Idopontfoglalas
{
    public enum IdopontStatuszEnum
    {
        [Display(Name = "Elfogadva")] Elfogadva = 1,

        [Display(Name = "Elutasítva")] Elutasítva = 2
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required] [ForeignKey("Szulo")] public int SzuloID { get; set; }

    public virtual Felhasznalo Szulo { get; set; }

    [Required] [ForeignKey("Vedono")] public int VedonoID { get; set; }

    [Required] public DateTime Datum { get; set; }

    [Required] [StringLength(10)] public string KezdesiIdo { get; set; }

    [Required] [StringLength(10)] public string BefejezesiIdo { get; set; }

    [Required]
    [EnumDataType(typeof(IdopontStatuszEnum))]
    public IdopontStatuszEnum Statusz { get; set; }

    [Required] public DateTime FoglalasIdopontja { get; set; }

    public DateTime? UtolsoFrissites { get; set; }

    [Required] [StringLength(100)] public string FelhasznaloNev { get; set; }

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string FelhasznaloEmail { get; set; }

    [StringLength(200)] public string FelhasznaloTeljesNev { get; set; }

    [StringLength(500)] public string FoglalasIndok { get; set; }

    [Required]
    [ForeignKey("Szolgaltatas")]
    public int SzolgaltatasID { get; set; }

    public virtual Szolgaltatas Szolgaltatas { get; set; }
}