using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IdopontfoglalasController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;


    public IdopontfoglalasController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Idopontfoglalas>>> GetIdopontfoglalasok()
    {
        return await _context.Idopontfoglalas.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Idopontfoglalas>> GetIdopontfoglalas(int id)
    {
        var foglalas = await _context.Idopontfoglalas.FindAsync(id);
        if (foglalas == null) return NotFound(new { error = "Foglalás nem található." });

        return foglalas;
    }

    [HttpPost("foglalas")]
    public async Task<IActionResult> PostIdopontfoglalas(Idopontfoglalas foglalas)
    {
        var szolgaltatas = new Szolgaltatas();

        if (foglalas.VedonoID == 0 || foglalas.SzuloID == 0)
            return BadRequest(new { error = "VedonoID vagy SzuloID hiányzik." });

        if (foglalas.Datum == default || foglalas.Datum == DateTime.MinValue)
            return BadRequest(new { error = "A dátum érvénytelen vagy hiányzik!" });

        if (!TimeSpan.TryParseExact(foglalas.KezdesiIdo, @"hh\:mm\:ss", null, out var parsedKezdesiIdo) ||
            !TimeSpan.TryParseExact(foglalas.BefejezesiIdo, @"hh\:mm\:ss", null, out var parsedBefejezesiIdo))
            return BadRequest(new { error = "Időpontok formátuma nem megfelelő. Használj HH:mm:ss formátumot." });

        if (parsedBefejezesiIdo <= parsedKezdesiIdo)
            return BadRequest(new { error = "Befejezési idő nem lehet korábbi vagy azonos a kezdési idővel." });

        foglalas.Datum = foglalas.Datum.Date;

        var felhasznalo = await _context.Felhasznalo.FirstOrDefaultAsync(f => f.ID == foglalas.SzuloID);
        if (felhasznalo == null) return NotFound(new { error = "A felhasználó nem található." });

        try
        {
            foglalas.FoglalasIdopontja = DateTime.UtcNow;
            foglalas.UtolsoFrissites = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Érvénytelen dátumformátum!" });
        }

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var idopontok = await _context.Elerhetoseg
                    .Where(i => i.Datum.Date == foglalas.Datum.Date &&
                                parsedKezdesiIdo < i.BefejezesiIdo.TimeOfDay &&
                                parsedBefejezesiIdo > i.KezdesiIdo.TimeOfDay &&
                                i.Statusz != 1)
                    .ToListAsync();

                if (idopontok.Count == 0)
                    return NotFound(new { error = "A kiválasztott időpont nem található vagy már foglalt!" });

                foreach (var idopont in idopontok)
                {
                    idopont.Statusz = 1;
                    idopont.SzolgaltatasID =
                        foglalas.SzolgaltatasID;
                    _context.Elerhetoseg.Update(idopont);
                }

                foglalas.FelhasznaloNev = felhasznalo.Felhasznalonev;
                foglalas.FelhasznaloEmail = felhasznalo.Email;
                foglalas.Statusz = Idopontfoglalas.IdopontStatuszEnum.Elfogadva;
                _context.Idopontfoglalas.Add(foglalas);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                await SendConfirmationEmail(foglalas, szolgaltatas);

                return Ok(new { id = foglalas.ID, message = "Foglalás sikeres." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { error = "Hiba történt a foglalás mentése során.", details = ex.Message });
            }
        }
    }

    [HttpGet("foglalasaim/{szuloId}")]
    public async Task<ActionResult<IEnumerable<Idopontfoglalas>>> GetFoglalasaim(int szuloId)
    {
        var foglalasok = await _context.Idopontfoglalas
            .Where(f => f.SzuloID == szuloId)
            .OrderByDescending(f => f.FoglalasIdopontja)
            .ToListAsync();

        if (foglalasok == null || foglalasok.Count == 0)
            return NotFound(new { error = "A felhasználóhoz nem tartozik foglalás." });

        return Ok(foglalasok);
    }

    [HttpGet("vedono/{vedonoId}")]
    public async Task<ActionResult<IEnumerable<Idopontfoglalas>>> GetFoglalasokByVedonoId(int vedonoId)
    {
        var foglalasok = await _context.Idopontfoglalas
            .Where(f => f.VedonoID == vedonoId)
            .OrderBy(f => f.Datum)
            .ThenBy(f => f.KezdesiIdo)
            .ToListAsync();

        if (foglalasok == null || foglalasok.Count == 0)
            return NotFound(new { error = "Ehhez a védőnőhöz nem tartozik foglalás." });

        return Ok(foglalasok);
    }

    [HttpPut("elutasitas/{id}")]
    public async Task<IActionResult> ElutasitFoglalas(int id)
    {
        Szolgaltatas szolgaltatas;
        var foglalas = await _context.Idopontfoglalas.FindAsync(id);

        if (foglalas == null) return NotFound(new { error = "Foglalás nem található." });

        foglalas.Statusz = Idopontfoglalas.IdopontStatuszEnum.Elutasítva;
        foglalas.UtolsoFrissites = DateTime.Now;

        await _context.SaveChangesAsync();

        await SendRejectionEmail(foglalas);

        return NoContent();
    }

    private async Task SendRejectionEmail(Idopontfoglalas foglalas)
    {
        var szolgaltatas = await _context.Szolgaltatas.FindAsync(foglalas.ID);
        var emailSender = new EmailSender(_configuration);
        var subject = "Foglalás elutasítva";

        var body = $@"
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                width: 90%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #ffecec;
            }}
            h2 {{
                color: #C0392B;
            }}
            p {{
                font-size: 14px;
            }}
            .highlight {{
                font-weight: bold;
                color: #C0392B;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>❌ Foglalás elutasítva</h2>
            <p>Kedves <strong>{foglalas.FelhasznaloNev}</strong>,</p>
            <p>Sajnálattal értesítünk, hogy az alábbi foglalásodat elutasítottuk.</p>
            
            <hr>

            <p><strong>📅 Dátum:</strong> <span class='highlight'>{foglalas.Datum:yyyy.MM.dd}</span></p>
            <p><strong>🕒 Időpont:</strong> <span class='highlight'>{foglalas.KezdesiIdo} - {foglalas.BefejezesiIdo}</span></p>
            <p><strong>💼 Szolgáltatás:</strong> <span class='highlight'>{szolgaltatas.Nev}</span></p>
            <p><strong>📋 Indok:</strong> <span class='highlight'>{foglalas.FoglalasIndok}</span></p>

            <hr>

            <p><strong>📌 Ha szeretnéd újra lefoglalni az időpontot, kérlek, látogass el a foglalási rendszerünkbe.</strong></p>
            <p>ℹ️ Ha kérdésed van, fordulj hozzánk bizalommal!</p>

            <div class='footer'>
                <p>Üdvözlettel,</p>
                <p><strong>Az Időpontfoglaló csapata</strong></p>
            </div>
        </div>
    </body>
    </html>";

        try
        {
            await emailSender.SendEmailAsync(foglalas.FelhasznaloEmail, subject, body);
            Console.WriteLine($"📧 Foglalás elutasító email elküldve: {foglalas.FelhasznaloEmail}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Hiba az email küldésekor: {ex.Message}");
        }
    }


    private async Task SendConfirmationEmail(Idopontfoglalas foglalas, Szolgaltatas szolgaltatas)
    {
        var emailSender = new EmailSender(_configuration);
        var subject = "✅ Foglalás visszaigazolás";

        var body = $@"
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                width: 90%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }}
            h2 {{
                color: #2C3E50;
            }}
            p {{
                font-size: 14px;
            }}
            .highlight {{
                font-weight: bold;
                color: #007bff;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>📅 Foglalás visszaigazolás</h2>
            <p>Kedves <strong>{foglalas.FelhasznaloNev}</strong>,</p>
            <p>Örömmel értesítünk, hogy foglalásod sikeresen rögzítésre került!</p>
            
            <hr>

            <p><strong>📅 Dátum:</strong> <span class='highlight'>{foglalas.Datum:yyyy.MM.dd}</span></p>
            <p><strong>🕒 Időpont:</strong> <span class='highlight'>{foglalas.KezdesiIdo} - {foglalas.BefejezesiIdo}</span></p>
            <p><strong>💼 Szolgáltatás:</strong> <span class='highlight'>{szolgaltatas.Nev}</span></p>
            <p><strong>📋 Indok:</strong> <span class='highlight'>{foglalas.FoglalasIndok}</span></p>

            <hr>

            <p><strong>📌 Kérjük, hogy érkezésed előtt legalább 5 perccel jelenj meg a helyszínen.</strong></p>
            <p>❗ Ha nem tudsz részt venni, kérjük, jelezd minél hamarabb!</p>

            <div class='footer'>
                <p>Üdvözlettel,</p>
                <p><strong>Az Időpontfoglaló csapata</strong></p>
            </div>
        </div>
    </body>
    </html>";

        try
        {
            await emailSender.SendEmailAsync(foglalas.FelhasznaloEmail, subject, body);
        }
        catch (Exception ex)
        {
        }
    }


    [HttpGet("total")]
    public async Task<ActionResult<int>> GetTotalBookings()
    {
        return await _context.Idopontfoglalas.CountAsync();
    }

    [HttpGet("weekly")]
    public async Task<ActionResult<int>> GetWeeklyBookings()
    {
        var oneWeekAgo = DateTime.Now.AddDays(-7);
        return await _context.Idopontfoglalas
            .CountAsync(f => f.Datum >= oneWeekAgo);
    }

    [HttpGet("daily")]
    public async Task<ActionResult<int>> GetDailyBookings()
    {
        var today = DateTime.Now.Date;
        return await _context.Idopontfoglalas
            .CountAsync(f => f.Datum == today);
    }

    [HttpGet("unique-parents")]
    public async Task<ActionResult<int>> GetUniqueParents()
    {
        return await _context.Idopontfoglalas
            .Select(f => f.SzuloID)
            .Distinct()
            .CountAsync();
    }

    [HttpGet("daily-list")]
    public async Task<ActionResult<IEnumerable<Idopontfoglalas>>> GetDailyBookingsList()
    {
        var today = DateTime.Now.Date;

        var bookings = await _context.Idopontfoglalas
            .Join(
                _context.Felhasznalo,
                foglalas => foglalas.SzuloID,
                felhasznalo => felhasznalo.ID,
                (foglalas, felhasznalo) => new { foglalas, felhasznalo }
            )
            .Join(
                _context.Szolgaltatas,
                combined => combined.foglalas.SzolgaltatasID,
                szolgaltatas => szolgaltatas.ID,
                (combined, szolgaltatas) => new
                {
                    combined.foglalas.ID,
                    combined.foglalas.Datum,
                    combined.foglalas.KezdesiIdo,
                    combined.foglalas.BefejezesiIdo,
                    combined.felhasznalo.Felhasznalonev,
                    combined.felhasznalo.Email,
                    FelhasznaloTeljesNev = combined.felhasznalo.Vezeteknev + " " + combined.felhasznalo.Keresztnev,
                    SzolgaltatasNev = szolgaltatas.Nev
                }
            )
            .Where(f => f.Datum.Date == today)
            .OrderBy(f => f.KezdesiIdo)
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpGet("weekly-list")]
    public async Task<ActionResult<IEnumerable<Idopontfoglalas>>> GetWeeklyBookingsList()
    {
        var today = DateTime.Now.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1);
        var endOfWeek = startOfWeek.AddDays(6);

        var bookings = await _context.Idopontfoglalas
            .Join(
                _context.Felhasznalo,
                foglalas => foglalas.SzuloID,
                felhasznalo => felhasznalo.ID,
                (foglalas, felhasznalo) => new { foglalas, felhasznalo }
            )
            .Join(
                _context.Szolgaltatas,
                combined => combined.foglalas.SzolgaltatasID,
                szolgaltatas => szolgaltatas.ID,
                (combined, szolgaltatas) => new
                {
                    combined.foglalas.ID,
                    combined.foglalas.Datum,
                    combined.foglalas.KezdesiIdo,
                    combined.foglalas.BefejezesiIdo,
                    combined.felhasznalo.Felhasznalonev,
                    combined.felhasznalo.Email,
                    FelhasznaloTeljesNev = combined.felhasznalo.Vezeteknev + " " + combined.felhasznalo.Keresztnev,
                    SzolgaltatasNev = szolgaltatas.Nev
                }
            )
            .Where(f => f.Datum >= startOfWeek && f.Datum <= endOfWeek)
            .OrderBy(f => f.Datum)
            .ThenBy(f => f.KezdesiIdo)
            .ToListAsync();

        return Ok(bookings);
    }


    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalBookings = await _context.Idopontfoglalas.CountAsync();
        var weeklyBookings = await _context.Idopontfoglalas
            .Where(f => f.Datum >= DateTime.Now.AddDays(-7))
            .CountAsync();
        var dailyBookings = await _context.Idopontfoglalas
            .Where(f => f.Datum.Date == DateTime.Today)
            .CountAsync();
        var uniqueParents = await _context.Idopontfoglalas
            .Select(f => f.SzuloID)
            .Distinct()
            .CountAsync();

        return Ok(new
        {
            totalBookings,
            weeklyBookings,
            dailyBookings,
            uniqueParents
        });
    }

    [HttpGet("total-bookings-by-month")]
    public async Task<ActionResult<IEnumerable<object>>> GetTotalBookingsByMonth()
    {
        var result = await _context.Idopontfoglalas
            .GroupBy(f => new { f.Datum.Year, f.Datum.Month })
            .Select(g => new
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(result);
    }
}