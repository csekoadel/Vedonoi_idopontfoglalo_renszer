using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Gyermek
{
    public enum NemEnum
    {
        Ferfi,
        No
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Szulo")] public int SzuloID { get; set; }

    [Required] [StringLength(50)] public string Keresztnev { get; set; }

    [Required] [StringLength(50)] public string Vezeteknev { get; set; }

    [Required] public DateTime SzuletesiDatum { get; set; }

    [Required] [StringLength(10)] public string Neme { get; set; }

    public Szulo Szulo { get; set; }
}