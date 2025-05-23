using System;

namespace Models;

public class GyermekDTO
{
    public int SzuloID { get; set; }
    public string Keresztnev { get; set; }
    public string Vezeteknev { get; set; }
    public DateTime SzuletesiDatum { get; set; }
    public string Neme { get; set; }
}