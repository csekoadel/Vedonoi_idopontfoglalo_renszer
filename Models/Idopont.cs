using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models;

public class Idopont
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    public DateTime Datum { get; set; }
    public DateTime KezdesiIdo { get; set; }
    public DateTime BefejezesiIdo { get; set; }

    [ForeignKey("Vedono")] public int VedonoID { get; set; }

    public Vedono Vedono { get; set; }

    public ICollection<SzolgaltatasIdopont> SzolgaltatasIdopontok { get; set; } = new List<SzolgaltatasIdopont>();
}