using System;
using System.Collections.Generic;
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
public class ElerhetosegController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ElerhetosegController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("getVedonoIDs")]
    public IActionResult GetVedonoIDs([FromQuery] string felhasznaloID)
    {
        if (string.IsNullOrEmpty(felhasznaloID)) return BadRequest("Felhasználói azonosító hiányzik.");

        try
        {
            var vedonoIDs = _context.Vedono
                .Where(v => v.FelhasznaloID.ToString() == felhasznaloID)
                .Select(v => v.ID)
                .ToList();

            if (!vedonoIDs.Any()) return NotFound("Nem található védőnő az adott felhasználóhoz.");

            return Ok(vedonoIDs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hiba történt a védőnő azonosítók lekérése során: {ex.Message}");
        }
    }

    [HttpDelete("deleteElerhetoseg/{id}")]
    public async Task<IActionResult> DeleteElerhetoseg(int id)
    {
        var elerhetoseg = await _context.Elerhetoseg.FindAsync(id);
        if (elerhetoseg == null) return NotFound(new { error = "A megadott időpont nem létezik." });

        try
        {
            _context.Elerhetoseg.Remove(elerhetoseg);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Időpont sikeresen törölve." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Hiba történt az időpont törlése során.", details = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Elerhetoseg>>> GetElerhetosegek()
    {
        try
        {
            var elerhetosegek = await _context.Elerhetoseg.ToListAsync();
            return Ok(elerhetosegek);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hiba történt az elérhetőségek lekérése során: {ex.Message}");
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAvailability([FromBody] ElerhetosegDto availabilityDto)
    {
        if (availabilityDto == null) return BadRequest("availabilityDto nem lehet null!");

        Console.WriteLine("Beérkező adatok: " + JsonConvert.SerializeObject(availabilityDto));

        if (availabilityDto.VedonoID == null || availabilityDto.VedonoID == 0)
            return BadRequest("Érvénytelen védőnő azonosító!");

        if (availabilityDto.SzolgaltatasIds == null || !availabilityDto.SzolgaltatasIds.Any())
            return BadRequest("Legalább egy szolgáltatás szükséges!");

        var vedono = await _context.Vedono.FindAsync(availabilityDto.VedonoID);
        if (vedono == null) return NotFound("Védőnő nem található az adott azonosítóval: " + availabilityDto.VedonoID);

        var szolgaltatasok = await _context.Szolgaltatas
            .Where(s => availabilityDto.SzolgaltatasIds.Contains(s.ID))
            .ToListAsync();

        if (szolgaltatasok.Count != availabilityDto.SzolgaltatasIds.Count)
            return BadRequest("Néhány szolgáltatás nem található az adatbázisban!");

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var elerhetoseg = new Elerhetoseg
                {
                    VedonoID = availabilityDto.VedonoID,
                    HetNapjai = availabilityDto.HetNapjai,
                    KezdesiIdo = availabilityDto.KezdesiIdo,
                    BefejezesiIdo = availabilityDto.BefejezesiIdo,
                    Datum = availabilityDto.Datum,
                    Statusz = 0
                };

                _context.Elerhetoseg.Add(elerhetoseg);
                await _context.SaveChangesAsync();

                foreach (var szolgaltatas in szolgaltatasok)
                {
                    var kapcsolat = new ElerhetosegSzolgaltatas
                    {
                        ElerhetosegID = elerhetoseg.ID,
                        SzolgaltatasID = szolgaltatas.ID
                    };
                    _context.ElerhetosegSzolgaltatas.Add(kapcsolat);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Message = "Az elérhetőség és a szolgáltatások sikeresen hozzáadva!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Szerverhiba történt: " + ex.Message);
            }
        }
    }

    [HttpGet("get-combined-user-data")]
    public async Task<ActionResult> GetCombinedUserData(string firebaseUid)
    {
        if (string.IsNullOrEmpty(firebaseUid)) return BadRequest(new { message = "A Firebase UID nem lehet üres." });

        var user = await _context.Regisztracio
            .Where(r => r.FirebaseUid == firebaseUid)
            .Join(_context.Felhasznalo,
                reg => reg.Id,
                fel => fel.ID,
                (reg, fel) => new
                {
                    reg.FirebaseUid,
                    fel.Felhasznalonev,
                    fel.Email,
                    fel.Telefonszam,
                    fel.Keresztnev,
                    fel.Vezeteknev,
                    fel.Szerepkor,
                    fel.RegisztracioIdopontja,
                    fel.ProfilkepUrl,
                    fel.UtolsoFrissites,
                    fel.Jelszo,
                    FelhasznaloID = fel.ID
                })
            .GroupJoin(_context.Szulo,
                fel => fel.FelhasznaloID,
                szulo => szulo.FelhasznaloID,
                (fel, szulo) => new { fel, szulo })
            .SelectMany(
                result => result.szulo.DefaultIfEmpty(),
                (result, szulo) => new
                {
                    result.fel.FirebaseUid,
                    result.fel.Felhasznalonev,
                    result.fel.Email,
                    result.fel.Telefonszam,
                    result.fel.Keresztnev,
                    result.fel.Vezeteknev,
                    result.fel.Szerepkor,
                    result.fel.RegisztracioIdopontja,
                    result.fel.ProfilkepUrl,
                    result.fel.UtolsoFrissites,
                    result.fel.Jelszo,
                    result.fel.FelhasznaloID,
                    SzuloID = szulo != null ? szulo.ID : (int?)null
                })
            .FirstOrDefaultAsync();

        if (user == null) return NotFound(new { message = "Felhasználó nem található." });

        string bio = null;
        string munkahely = null;
        int? vedonoID = null;

        if (user.Szerepkor == "Vedono")
        {
            var vedonoData = await _context.Vedono
                .Where(v => v.FelhasznaloID == user.FelhasznaloID)
                .Select(v => new { v.ID, v.Bio, v.Munkahely })
                .FirstOrDefaultAsync();

            if (vedonoData != null)
            {
                bio = vedonoData.Bio ?? "";
                munkahely = vedonoData.Munkahely ?? "";
                vedonoID = vedonoData.ID;
            }
        }

        var formattedUtolsoFrissites = user.UtolsoFrissites.HasValue
            ? user.UtolsoFrissites.Value.ToString("yyyy-MM-dd HH:mm:ss")
            : "";

        return Ok(new
        {
            user.FirebaseUid,
            user.Felhasznalonev,
            user.Email,
            telefonszam = user.Telefonszam ?? "",
            user.Keresztnev,
            user.Vezeteknev,
            user.Szerepkor,
            user.RegisztracioIdopontja,
            ProfilkepUrl = user.ProfilkepUrl ?? "",
            UtolsoFrissites = formattedUtolsoFrissites,
            VedonoID = vedonoID,
            user.Jelszo,
            user.FelhasznaloID,
            user.SzuloID
        });
    }

    [HttpGet("getAppointments")]
    public async Task<ActionResult<IEnumerable<Elerhetoseg>>> GetAppointments([FromQuery] int vedonoID)
    {
        try
        {
            var elerhetosegek = await _context.Elerhetoseg
                .Include(e => e.ElerhetosegSzolgaltatasok)
                .ThenInclude(es => es.Szolgaltatas)
                .Where(e => e.VedonoID == vedonoID)
                .ToListAsync();

            if (!elerhetosegek.Any())
                return NotFound(new { message = "Nem találhatóak elérhetőségek az adott védőnőhöz." });

            return Ok(elerhetosegek);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hiba történt az időpontok lekérése során: {ex.Message}");
        }
    }

    [HttpGet("getAppointmentsByService")]
    public async Task<ActionResult<IEnumerable<Elerhetoseg>>> GetAppointmentsByService(
        [FromQuery] int vedonoID,
        [FromQuery] int szolgaltatasID)
    {
        try
        {
            var elerhetosegek = await _context.Elerhetoseg
                .Include(e => e.ElerhetosegSzolgaltatasok)
                .ThenInclude(es => es.Szolgaltatas)
                .Where(e => e.VedonoID == vedonoID &&
                            e.ElerhetosegSzolgaltatasok.Any(es => es.SzolgaltatasID == szolgaltatasID))
                .Select(e => new
                {
                    e.ID,
                    e.VedonoID,
                    e.HetNapjai,
                    e.KezdesiIdo,
                    e.BefejezesiIdo,
                    e.Datum,
                    e.Statusz,
                    Szolgaltatasok = e.ElerhetosegSzolgaltatasok
                        .Where(es => es.SzolgaltatasID == szolgaltatasID)
                        .Select(es => new
                        {
                            es.SzolgaltatasID,
                            es.Szolgaltatas.Nev
                        }).ToList()
                })
                .ToListAsync();

            if (!elerhetosegek.Any())
                return NotFound(new { message = "Nem találhatóak elérhetőségek a megadott szolgáltatáshoz." });

            return Ok(elerhetosegek);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hiba történt az időpontok lekérése során: {ex.Message}");
        }
    }

    [HttpGet("szolgaltatas/{szolgaltatasId}/idopontok")]
    public async Task<IActionResult> GetSzabadIdopontok(int szolgaltatasId, [FromQuery] int? vedonoId)
    {
        if (!vedonoId.HasValue) return BadRequest(new { message = "A védőnő azonosító (vedonoId) megadása kötelező." });

        var szabadIdopontok = await _context.SzolgaltatasIdopont
            .Where(si => si.SzolgaltatasID == szolgaltatasId && !si.Foglalt && si.Idopont.VedonoID == vedonoId)
            .Include(si => si.Idopont)
            .Select(si => new
            {
                si.IdopontID,
                si.Idopont.KezdesiIdo,
                si.Idopont.BefejezesiIdo
            })
            .ToListAsync();

        if (!szabadIdopontok.Any())
            return NotFound(new { message = "Nincsenek szabad időpontok ehhez a szolgáltatáshoz és védőnőhöz." });

        return Ok(szabadIdopontok);
    }

    [HttpPost("foglald-le")]
    public async Task<IActionResult> FoglaljIdopontot(int szolgaltatasId, int idopontId)
    {
        var foglalandoIdopont = await _context.SzolgaltatasIdopont
            .Include(si => si.Idopont)
            .Where(si => si.IdopontID == idopontId)
            .ToListAsync();

        if (foglalandoIdopont == null || foglalandoIdopont.Count == 0)
            return NotFound(new { message = "A kiválasztott időpont nem létezik." });

        if (foglalandoIdopont.Any(si => si.Foglalt))
            return BadRequest(new { message = "Ez az időpont már foglalt egy másik szolgáltatásnál!" });

        try
        {
            foreach (var idopont in foglalandoIdopont) idopont.Foglalt = true;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sikeresen lefoglaltad az időpontot. Minden más szolgáltatás is foglalt lett!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Hiba történt a foglalás mentése során.", details = ex.Message });
        }
    }
}