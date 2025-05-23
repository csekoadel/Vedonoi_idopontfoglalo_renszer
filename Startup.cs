using Context;
using Idopontfoglalo_Rendszer.Controllers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Idopontfoglalo_Rendszer;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // ConfigureServices metódus
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<EmailSender>();
        services.Configure<SmtpSettings>(Configuration.GetSection("SMTP"));
        services.AddControllers()
            .AddNewtonsoftJson(options =>
                options.SerializerSettings.Converters.Add(new StringEnumConverter()));
        // Adatbázis konfiguráció
        services.AddControllers()
            .AddNewtonsoftJson(options =>
            {
                // Az önhivatkozásokat figyelmen kívül hagyja
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

        // CORS beállítás
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin", builder =>
                builder.WithOrigins("http://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });


        services.AddAuthorization();
        services.AddControllersWithViews();

        // Swagger konfiguráció
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Idopontfoglalo_Rendszer API", Version = "v1" });
        });

        // SPA statikus fájlok konfigurációja (Angular alkalmazás)
        services.AddSpaStaticFiles(configuration =>
        {
            configuration.RootPath = "ClientApp/dist"; // Az Angular build mappa útvonala
        });
    }

    // Configure metódus
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Idopontfoglalo_Rendszer API v1");
                c.RoutePrefix = "swagger";
            });
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts(); // Ha szükséges, ezt is kikapcsolhatod ideiglenesen
        }


        // Kikapcsoljuk a HTTPS átirányítást ideiglenesen
        // app.UseHttpsRedirection();

        app.UseStaticFiles();
        app.UseSpaStaticFiles();

        app.UseRouting();
        app.UseCors("AllowSpecificOrigin");
        app.UseAuthorization();

        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("Content-Security-Policy",
                "default-src 'self'; " +
                "connect-src 'self' https://identitytoolkit.googleapis.com https://*.firebaseapp.com https://www.googleapis.com; " +
                "style-src 'self' 'unsafe-inline'; " +
                "script-src 'self' https://apis.google.com; " +
                "frame-src https://*.firebaseapp.com https://accounts.google.com;"
            );
            await next();
        });


        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment()) spa.UseAngularCliServer("start");
        });
    }
}