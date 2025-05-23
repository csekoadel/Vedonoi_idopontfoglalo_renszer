using System.Threading.Tasks;
using Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Idopontfoglalo_Rendszer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RoleController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-user-role")]
    public async Task<IActionResult> GetUserRole(string firebaseUid)
    {
        var user = await _context.Regisztracio.FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);
        if (user == null) return NotFound(new { message = "Felhasználó nem található." });

        return Ok(new { role = user.Szerepkor });
    }
}