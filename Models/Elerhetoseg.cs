using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models;

public class Elerhetoseg
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Vedono")] public int VedonoID { get; set; }

    [Required] [StringLength(50)] public string HetNapjai { get; set; }

    public DateTime KezdesiIdo { get; set; }
    public DateTime BefejezesiIdo { get; set; }

    [Required] [DataType(DataType.Date)] public DateTime Datum { get; set; }

    public int Statusz { get; set; }

    [ForeignKey("Szolgaltatas")] public int? SzolgaltatasID { get; set; }

    public virtual ICollection<ElerhetosegSzolgaltatas> ElerhetosegSzolgaltatasok { get; set; }

    [ForeignKey("SzuloID")] public Felhasznalo Szulo { get; set; }
}