using System;
using System.Linq;
using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FelhasznaloController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FelhasznaloController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-user-by-firebase-uid")]
    public async Task<ActionResult<Felhasznalo>> GetUserByFirebaseUid(string firebaseUid)
    {
        if (string.IsNullOrEmpty(firebaseUid)) return BadRequest("A firebaseUid megadása kötelező.");

        var felhasznalo = await _context.Regisztracio
            .FirstOrDefaultAsync(f => f.FirebaseUid == firebaseUid);

        if (felhasznalo == null)
            return NotFound(new { message = "A felhasználó nem található a megadott FirebaseUid alapján." });

        return Ok(felhasznalo);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var felhasznalo = await _context.Felhasznalo
            .FirstOrDefaultAsync(f => f.ID == id);

        if (felhasznalo == null) return NotFound(new { message = "A felhasználó nem található." });

        var szuloId = await _context.Szulo
            .Where(s => s.FelhasznaloID == id)
            .Select(s => s.ID)
            .FirstOrDefaultAsync();

        var vedonoData = felhasznalo.Szerepkor == "Vedono"
            ? await _context.Vedono
                .Where(v => v.FelhasznaloID == id)
                .Select(v => new { v.ID,v.Bio, v.Munkahely })
                .FirstOrDefaultAsync()
            : null;

        var response = new
        {
            felhasznalo.ID,
            felhasznalo.Email,
            felhasznalo.Felhasznalonev,
            felhasznalo.Keresztnev,
            felhasznalo.Vezeteknev,
            felhasznalo.Telefonszam,
            felhasznalo.ProfilkepUrl,
            felhasznalo.RegisztracioIdopontja,
            felhasznalo.UtolsoFrissites,
            SzuloID = szuloId,
            VedonoID = vedonoData?.ID,
            VedonoAdatok = vedonoData
        };

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFelhasznalo(int id, [FromBody] UpdateFelhasznaloDto updatedFelhasznalo)
    {
        var existingUser = await _context.Felhasznalo.FindAsync(id);
        if (existingUser == null) return NotFound(new { message = "A felhasználó nem található." });

        existingUser.Felhasznalonev = updatedFelhasznalo.Felhasznalonev ?? existingUser.Felhasznalonev;
        existingUser.Vezeteknev = updatedFelhasznalo.Vezeteknev ?? existingUser.Vezeteknev;
        existingUser.Keresztnev = updatedFelhasznalo.Keresztnev ?? existingUser.Keresztnev;
        existingUser.Email = updatedFelhasznalo.Email ?? existingUser.Email;
        existingUser.Telefonszam = updatedFelhasznalo.Telefonszam ?? existingUser.Telefonszam;
        existingUser.ProfilkepUrl = updatedFelhasznalo.ProfilkepUrl ?? existingUser.ProfilkepUrl;
        existingUser.Szerepkor = updatedFelhasznalo.Szerepkor ?? existingUser.Szerepkor;
        existingUser.UtolsoFrissites = DateTime.UtcNow;

        if (existingUser.Szerepkor == "Vedono")
        {
            var existingVedono = await _context.Vedono.FirstOrDefaultAsync(v => v.FelhasznaloID == id);

            if (existingVedono != null)
            {
                existingVedono.Bio = updatedFelhasznalo.Bio ?? existingVedono.Bio;
                existingVedono.Munkahely = updatedFelhasznalo.Munkahely ?? existingVedono.Munkahely;
                _context.Entry(existingVedono).State = EntityState.Modified;
            }
            else
            {
                var newVedono = new Vedono
                {
                    FelhasznaloID = id,
                    Bio = updatedFelhasznalo.Bio,
                    Munkahely = updatedFelhasznalo.Munkahely
                };
                await _context.Vedono.AddAsync(newVedono);
            }
        }

        try
        {
            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var vedonoData = await _context.Vedono
                .Where(v => v.FelhasznaloID == id)
                .Select(v => new { v.Bio, v.Munkahely })
                .FirstOrDefaultAsync();

            var response = new
            {
                message = "Felhasználó sikeresen frissítve.",
                updatedUser = existingUser,
                vedonoData
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Hiba történt a frissítés során." });
        }
    }
}