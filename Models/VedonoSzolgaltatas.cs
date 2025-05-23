using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class VedonoSzolgaltatas
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [ForeignKey("Vedono")] public int VedonoID { get; set; }

    public Vedono Vedono { get; set; }

    [ForeignKey("Szolgaltatas")] public int SzolgaltatasID { get; set; }

    public Szolgaltatas Szolgaltatas { get; set; }
}