using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Models;

public class ElerhetosegSzolgaltatas
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required] public int ElerhetosegID { get; set; }

    [Required] public int SzolgaltatasID { get; set; }

    [ForeignKey("ElerhetosegID")]
    [JsonIgnore]
    public Elerhetoseg Elerhetoseg { get; set; }

    [ForeignKey("SzolgaltatasID")] public Szolgaltatas Szolgaltatas { get; set; }
}