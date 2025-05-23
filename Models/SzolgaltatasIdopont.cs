using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class SzolgaltatasIdopont
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required] public int SzolgaltatasID { get; set; }

    [Required] public int IdopontID { get; set; }

    public bool Foglalt { get; set; } = false;

    [ForeignKey("SzolgaltatasID")] public Szolgaltatas Szolgaltatas { get; set; }

    [ForeignKey("IdopontID")] public Idopont Idopont { get; set; }
}