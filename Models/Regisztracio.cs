using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Regisztracio
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required] [StringLength(100)] public string Email { get; set; }

    [Required] [StringLength(50)] public string Felhasznalonev { get; set; }

    [Required] [StringLength(256)] public string FirebaseUid { get; set; }

    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string Szerepkor { get; set; }

    [Required] [StringLength(50)] public string Keresztnev { get; set; }

    [Required] [StringLength(50)] public string Vezeteknev { get; set; }

    public Szulo Szulo { get; set; }
    public Vedono Vedono { get; set; }
}