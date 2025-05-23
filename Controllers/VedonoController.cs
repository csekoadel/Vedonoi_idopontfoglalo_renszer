using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VedonoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VedonoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("vedono/{vedonoId}")]
    public async Task<ActionResult<Vedono>> GetVedonoById(int vedonoId)
    {
        var vedono = await _context.Vedono.FindAsync(vedonoId);

        if (vedono == null) return NotFound(new { error = "Védőnő nem található." });

        return Ok(vedono);
    }

    [HttpGet("get-vedonok")]
    public async Task<ActionResult<IEnumerable<Vedono>>> GetVedonok()
    {
        var vedonok = await _context.Vedono
            .Include(v => v.ElerhetosegLista)
            .ToListAsync();
        return Ok(vedonok);
    }

    [HttpGet("get-vedono-naptar/{vedonoId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetVedonoNaptar(int vedonoId)
    {
        var naptar = await _context.Idopontfoglalas
            .Where(f => f.VedonoID == vedonoId)
            .Include(f => f.Szulo)
            .Include(f => f.Szolgaltatas)
            .Select(f => new
            {
                f.ID,
                f.Datum,
                KezdesiIdo = TimeSpan.Parse(f.KezdesiIdo),
                BefejezesiIdo = TimeSpan.Parse(f.BefejezesiIdo),
                f.FoglalasIndok,
                FelhasznaloNev = f.Szulo.Vezeteknev + " " + f.Szulo.Keresztnev,
                SzolgaltatasNev = f.Szolgaltatas.Nev,
                IdoHossz = (DateTime.Parse(f.BefejezesiIdo) - DateTime.Parse(f.KezdesiIdo)).TotalMinutes
            })
            .OrderBy(n => n.Datum)
            .ToListAsync();

        if (!naptar.Any()) return NotFound(new { message = "Nincs elérhető időpont a védőnő számára." });

        return Ok(naptar);
    }

    [HttpGet("filter")]
    public IActionResult GetElerhetosegekByDateRange(
        [FromQuery] int vedonoId,
        [FromQuery] string startDate,
        [FromQuery] string endDate)
    {
        if (string.IsNullOrWhiteSpace(startDate) || string.IsNullOrWhiteSpace(endDate))
            return BadRequest("A dátumtartomány nem megfelelő.");

        var format = "yyyy-MM-dd HH:mm:ss'Z'";

        if (!DateTime.TryParseExact(startDate, format, CultureInfo.InvariantCulture, DateTimeStyles.None,
                out var startDt) ||
            !DateTime.TryParseExact(endDate, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var endDt))
            return BadRequest("A dátumok formátuma érvénytelen. Várható formátum: yyyy-MM-dd HH:mm:ssZ");

        var elerhetosegek = _context.Elerhetoseg
            .Where(e => e.VedonoID == vedonoId && e.Datum >= startDt && e.Datum <= endDt)
            .ToList();

        if (!elerhetosegek.Any())
            return NotFound(new { message = "Nem található elérhetőség a megadott tartományban." });

        return Ok(elerhetosegek);
    }


    [HttpGet("vedono-details/{vedonoId}")]
    public async Task<ActionResult> GetVedonoDetails(int vedonoId)
    {
        var vedono = await _context.Vedono
            .Where(v => v.ID == vedonoId)
            .Select(v => new
            {
                v.ID,
                Name = _context.Felhasznalo
                    .Where(f => f.ID == v.FelhasznaloID)
                    .Select(f => f.Vezeteknev + " " + f.Keresztnev)
                    .FirstOrDefault(),
                ProfilePictureUrl = _context.Felhasznalo
                    .Where(f => f.ID == v.FelhasznaloID)
                    .Select(f => f.ProfilkepUrl)
                    .FirstOrDefault(),
                v.Bio,
                v.Munkahely
            })
            .FirstOrDefaultAsync();

        if (vedono == null) return NotFound(new { message = "A védőnő adatai nem elérhetők." });

        return Ok(vedono);
    }
}