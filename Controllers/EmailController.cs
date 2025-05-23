using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Idopontfoglalo_Rendszer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly EmailSender _emailSender;

    public EmailController(EmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        try
        {
            await _emailSender.SendEmailAsync(request.To, request.Subject, request.Body);
            return Ok(new { message = "Email sent successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error sending email: {ex.Message}" });
        }
    }
}

public class EmailRequest
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}