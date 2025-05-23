using System;
using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistrationRequest request)
    {
        if (request == null) return BadRequest(new { message = "A regisztrációs adatok nem lehetnek üresek." });

        Console.WriteLine($"Beérkezett regisztrációs kérelem: {JsonConvert.SerializeObject(request)}");

        if (string.IsNullOrWhiteSpace(request.Szerepkor) ||
            !Enum.TryParse(typeof(Szerepkor), request.Szerepkor.Trim(), true, out var parsedSzerepkor))
        {
            Console.WriteLine($"Érvénytelen szerepkör: {request.Szerepkor}");
            return BadRequest(new { message = "Érvénytelen szerepkör érték." });
        }

        Console.WriteLine($"Kapott JSON a frontendtől: {JsonConvert.SerializeObject(request)}");
        if (string.IsNullOrWhiteSpace(request.Jelszo))
        {
            Console.WriteLine("Hiányzó jelszó a kérésben.");
            return BadRequest(new { message = "A jelszó megadása kötelező." });
        }

        var szerepkor = (Szerepkor)parsedSzerepkor;

        try
        {
            var dbUserRegisztracio = new Regisztracio
            {
                Email = request.Email,
                Felhasznalonev = request.Felhasznalonev,
                FirebaseUid = request.FirebaseUid,
                Keresztnev = request.Keresztnev,
                Vezeteknev = request.Vezeteknev,
                Szerepkor = szerepkor.ToString()
            };

            var felhasznalo = new Felhasznalo
            {
                Felhasznalonev = request.Felhasznalonev,
                Jelszo = BCrypt.Net.BCrypt.HashPassword(request.Jelszo),
                Keresztnev = request.Keresztnev,
                Vezeteknev = request.Vezeteknev,
                Email = request.Email,
                Szerepkor = szerepkor.ToString(),
                ProfilkepAdat = null,
                RegisztracioIdopontja = DateTime.UtcNow
            };

            _context.Felhasznalo.Add(felhasznalo);
            _context.Regisztracio.Add(dbUserRegisztracio);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Felhasznalo mentve. ID: {felhasznalo.ID}");
            Console.WriteLine($"Regisztracio mentve. ID: {dbUserRegisztracio.Id}");

            if (szerepkor == Szerepkor.Szulo)
            {
                var szulo = new Szulo
                {
                    FelhasznaloID = felhasznalo.ID,
                    Lakcim = string.IsNullOrWhiteSpace(request.Lakcim) ? null : request.Lakcim
                };
                _context.Szulo.Add(szulo);
            }
            else if (szerepkor == Szerepkor.Vedono)
            {
                var vedono = new Vedono
                {
                    FelhasznaloID = felhasznalo.ID,
                    Munkahely = string.IsNullOrWhiteSpace(request.Munkahely) ? null : request.Munkahely,
                    MunkaIdo = string.IsNullOrWhiteSpace(request.MunkaIdo) ? null : request.MunkaIdo,
                    Bio = string.IsNullOrWhiteSpace(request.Bio) ? null : request.Bio
                };
                _context.Vedono.Add(vedono);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Regisztráció sikeres!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during registration: {ex.Message}");
            return StatusCode(500, new { message = "Szerverhiba történt.", errorDetails = ex.Message });
        }
    }

    public class RegistrationRequest
    {
        [JsonProperty("email")] public string Email { get; set; }

        [JsonProperty("felhasznalonev")] public string Felhasznalonev { get; set; }

        [JsonProperty("Jelszo")] public string Jelszo { get; set; }

        [JsonProperty("firebaseUid")] public string FirebaseUid { get; set; }

        [JsonProperty("szerepkor")] public string Szerepkor { get; set; }

        [JsonProperty("keresztnev")] public string Keresztnev { get; set; }

        [JsonProperty("vezeteknev")] public string Vezeteknev { get; set; }

        [JsonProperty("lakcim")] public string Lakcim { get; set; }

        [JsonProperty("munkahely")] public string Munkahely { get; set; }

        [JsonProperty("munkaIdo")] public string MunkaIdo { get; set; }

        [JsonProperty("bio")] public string Bio { get; set; }
    }
}