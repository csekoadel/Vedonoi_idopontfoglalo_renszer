using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Models;

namespace Idopontfoglalo_Rendszer.Controllers;

public class EmailSender
{
    private readonly SmtpSettings _smtpSettings;

    public EmailSender(IConfiguration configuration)
    {
        var host = configuration["SMTP:Host"];
        if (string.IsNullOrEmpty(host))
            throw new ArgumentNullException("SMTP_Host", "The SMTP_Host configuration is missing or null.");

        _smtpSettings = new SmtpSettings
        {
            Host = host,
            Port = int.Parse(configuration["SMTP:Port"] ?? "587"),
            EnableSSL = bool.Parse(configuration["SMTP:EnableSSL"] ?? "true"),
            Username = configuration["SMTP:Username"],
            Password = configuration["SMTP:Password"]
        };
    }


    public async Task SendEmailAsync(string to, string subject, string body)
    {
        using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
        {
            EnableSsl = _smtpSettings.EnableSSL,
            Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password)
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_smtpSettings.Username),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(to);

        try
        {
            await client.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email küldése sikertelen: {ex.Message}");
            throw;
        }
    }
}