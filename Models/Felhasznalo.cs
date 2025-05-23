using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Models;

[JsonConverter(typeof(StringEnumConverter))]
public enum Szerepkor
{
    Vedono,
    Szulo,
    Adminisztrator,
    Vendeg
}

public class Felhasznalo
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required] [StringLength(50)] public string Felhasznalonev { get; set; }

    [StringLength(256)] public string Jelszo { get; set; }

    [Required] [StringLength(50)] public string Keresztnev { get; set; }

    [Required] [StringLength(50)] public string Vezeteknev { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Phone] [StringLength(15)] public string Telefonszam { get; set; }

    public string ProfilkepUrl { get; set; }

    public byte[] ProfilkepAdat { get; set; }

    [Required] public string Szerepkor { get; set; }

    [JsonProperty("regisztracioIdopontja")]
    [DataType(DataType.DateTime)]
    public DateTime RegisztracioIdopontja { get; set; }

    public DateTime? UtolsoFrissites { get; set; }
    public Szulo Szulo { get; set; }
}