using System;
using System.Collections.Generic;

namespace Models;

public class ElerhetosegDto
{
    public int ID { get; set; }

    public int VedonoID { get; set; }


    public string HetNapjai { get; set; }


    public DateTime KezdesiIdo { get; set; }
    public DateTime BefejezesiIdo { get; set; }
    public DateTime Datum { get; set; }
    public List<int> SzolgaltatasIds { get; set; }
}