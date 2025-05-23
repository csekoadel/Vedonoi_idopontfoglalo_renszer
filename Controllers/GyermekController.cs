using System;
using System.Linq;
using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GyermekController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GyermekController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost("add")]
    public async Task<IActionResult> AddGyermek([FromBody] GyermekDTO request)
    {
        if (request == null) return BadRequest(new { message = "A gyermek adatai nem lehetnek üresek." });

        if (!Enum.TryParse(request.Neme, true, out Gyermek.NemEnum nemeEnum))
            return BadRequest(new { message = "Érvénytelen nem érték. Csak 'Ferfi' vagy 'No' lehet." });

        try
        {
            Console.WriteLine($"Beérkező gyermek hozzáadási kérelem: {JsonConvert.SerializeObject(request)}");

            var szulo = await _context.Szulo.FirstOrDefaultAsync(s => s.FelhasznaloID == request.SzuloID);
            if (szulo == null)
                return NotFound(new { message = "A megadott FelhasznaloID-hez nem található Szulo rekord." });

            var ujGyermek = new Gyermek
            {
                SzuloID = szulo.ID,
                Keresztnev = request.Keresztnev,
                Vezeteknev = request.Vezeteknev,
                SzuletesiDatum = request.SzuletesiDatum,
                Neme = nemeEnum.ToString()
            };

            _context.Gyermek.Add(ujGyermek);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Gyermek sikeresen hozzáadva!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Szerverhiba történt. Részletekért nézze meg a konzolt." });
        }
    }

    [HttpGet("get-szulo-id-by-felhasznalo-id")]
    public async Task<IActionResult> GetSzuloIdByFelhasznaloId([FromQuery] int? felhasznaloId)
    {
        if (!felhasznaloId.HasValue)
            return BadRequest(new { message = "A felhasználó azonosító nem lehet üres vagy null." });

        var szulo = await _context.Szulo.FirstOrDefaultAsync(s => s.FelhasznaloID == felhasznaloId.Value);
        if (szulo == null) return NotFound(new { message = "Szülő nem található." });

        return Ok(new { szuloId = szulo.ID });
    }

    [HttpGet("get-by-parent-id")]
    public async Task<IActionResult> GetGyermekekByParentId([FromQuery] int szuloId)
    {
        var szulo = await _context.Szulo.FirstOrDefaultAsync(s => s.ID == szuloId);
        if (szulo == null) return NotFound(new { message = "Szülő nem található a rendszerben." });

        var gyermekek = await _context.Gyermek
            .Where(g => g.SzuloID == szuloId)
            .Select(g => new
            {
                Nev = g.Vezeteknev + " " + g.Keresztnev,
                Kor = DateTime.Now.Year - g.SzuletesiDatum.Year -
                      (DateTime.Now.DayOfYear < g.SzuletesiDatum.DayOfYear ? 1 : 0)
            })
            .ToListAsync();

        if (!gyermekek.Any()) return NotFound(new { message = "Ehhez a szülőhöz nem tartoznak gyermekek." });

        return Ok(gyermekek);
    }
}