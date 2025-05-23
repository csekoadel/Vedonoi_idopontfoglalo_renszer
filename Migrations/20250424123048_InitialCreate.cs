using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idopontfoglalo_Rendszer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Felhasznalo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Felhasznalonev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Jelszo = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Keresztnev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Vezeteknev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefonszam = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    ProfilkepUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfilkepAdat = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Szerepkor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegisztracioIdopontja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UtolsoFrissites = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Felhasznalo", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Regisztracio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Felhasznalonev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FirebaseUid = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Szerepkor = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Keresztnev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Vezeteknev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regisztracio", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Statusz",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VedonoID = table.Column<int>(type: "int", nullable: false),
                    StatuszA = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    HetNapjai = table.Column<int>(type: "int", maxLength: 50, nullable: false),
                    StausztBeallIdopont = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statusz", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Szolgaltatas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nev = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Szolgaltatas", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Szulo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FelhasznaloID = table.Column<int>(type: "int", nullable: false),
                    Lakcim = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FelhasznaloID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Szulo", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Szulo_Felhasznalo_FelhasznaloID",
                        column: x => x.FelhasznaloID,
                        principalTable: "Felhasznalo",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Szulo_Felhasznalo_FelhasznaloID1",
                        column: x => x.FelhasznaloID1,
                        principalTable: "Felhasznalo",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Szulo_Regisztracio_FelhasznaloID",
                        column: x => x.FelhasznaloID,
                        principalTable: "Regisztracio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vedono",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FelhasznaloID = table.Column<int>(type: "int", nullable: false),
                    Munkahely = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MunkaIdo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vedono", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Vedono_Regisztracio_FelhasznaloID",
                        column: x => x.FelhasznaloID,
                        principalTable: "Regisztracio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Idopontfoglalas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SzuloID = table.Column<int>(type: "int", nullable: false),
                    VedonoID = table.Column<int>(type: "int", nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KezdesiIdo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    BefejezesiIdo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Statusz = table.Column<int>(type: "int", nullable: false),
                    FoglalasIdopontja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UtolsoFrissites = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FelhasznaloNev = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FelhasznaloEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FelhasznaloTeljesNev = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FoglalasIndok = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SzolgaltatasID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Idopontfoglalas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Idopontfoglalas_Felhasznalo_SzuloID",
                        column: x => x.SzuloID,
                        principalTable: "Felhasznalo",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Idopontfoglalas_Szolgaltatas_SzolgaltatasID",
                        column: x => x.SzolgaltatasID,
                        principalTable: "Szolgaltatas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Gyermek",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SzuloID = table.Column<int>(type: "int", nullable: false),
                    Keresztnev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Vezeteknev = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SzuletesiDatum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Neme = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gyermek", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Gyermek_Szulo_SzuloID",
                        column: x => x.SzuloID,
                        principalTable: "Szulo",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Elerhetoseg",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VedonoID = table.Column<int>(type: "int", nullable: false),
                    HetNapjai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    KezdesiIdo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BefejezesiIdo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Statusz = table.Column<int>(type: "int", nullable: false),
                    SzolgaltatasID = table.Column<int>(type: "int", nullable: true),
                    SzuloID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elerhetoseg", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Elerhetoseg_Felhasznalo_SzuloID",
                        column: x => x.SzuloID,
                        principalTable: "Felhasznalo",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Elerhetoseg_Vedono_VedonoID",
                        column: x => x.VedonoID,
                        principalTable: "Vedono",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Idopont",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KezdesiIdo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BefejezesiIdo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VedonoID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Idopont", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Idopont_Vedono_VedonoID",
                        column: x => x.VedonoID,
                        principalTable: "Vedono",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VedonoSzolgaltatas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VedonoID = table.Column<int>(type: "int", nullable: false),
                    SzolgaltatasID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VedonoSzolgaltatas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_VedonoSzolgaltatas_Szolgaltatas_SzolgaltatasID",
                        column: x => x.SzolgaltatasID,
                        principalTable: "Szolgaltatas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VedonoSzolgaltatas_Vedono_VedonoID",
                        column: x => x.VedonoID,
                        principalTable: "Vedono",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ElerhetosegSzolgaltatas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ElerhetosegID = table.Column<int>(type: "int", nullable: false),
                    SzolgaltatasID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ElerhetosegSzolgaltatas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ElerhetosegSzolgaltatas_Elerhetoseg_ElerhetosegID",
                        column: x => x.ElerhetosegID,
                        principalTable: "Elerhetoseg",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ElerhetosegSzolgaltatas_Szolgaltatas_SzolgaltatasID",
                        column: x => x.SzolgaltatasID,
                        principalTable: "Szolgaltatas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SzolgaltatasIdopont",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SzolgaltatasID = table.Column<int>(type: "int", nullable: false),
                    IdopontID = table.Column<int>(type: "int", nullable: false),
                    Foglalt = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SzolgaltatasIdopont", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SzolgaltatasIdopont_Idopont_IdopontID",
                        column: x => x.IdopontID,
                        principalTable: "Idopont",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SzolgaltatasIdopont_Szolgaltatas_SzolgaltatasID",
                        column: x => x.SzolgaltatasID,
                        principalTable: "Szolgaltatas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Elerhetoseg_SzuloID",
                table: "Elerhetoseg",
                column: "SzuloID");

            migrationBuilder.CreateIndex(
                name: "IX_Elerhetoseg_VedonoID",
                table: "Elerhetoseg",
                column: "VedonoID");

            migrationBuilder.CreateIndex(
                name: "IX_ElerhetosegSzolgaltatas_ElerhetosegID",
                table: "ElerhetosegSzolgaltatas",
                column: "ElerhetosegID");

            migrationBuilder.CreateIndex(
                name: "IX_ElerhetosegSzolgaltatas_SzolgaltatasID",
                table: "ElerhetosegSzolgaltatas",
                column: "SzolgaltatasID");

            migrationBuilder.CreateIndex(
                name: "IX_Gyermek_SzuloID",
                table: "Gyermek",
                column: "SzuloID");

            migrationBuilder.CreateIndex(
                name: "IX_Idopont_VedonoID",
                table: "Idopont",
                column: "VedonoID");

            migrationBuilder.CreateIndex(
                name: "IX_Idopontfoglalas_SzolgaltatasID",
                table: "Idopontfoglalas",
                column: "SzolgaltatasID");

            migrationBuilder.CreateIndex(
                name: "IX_Idopontfoglalas_SzuloID",
                table: "Idopontfoglalas",
                column: "SzuloID");

            migrationBuilder.CreateIndex(
                name: "IX_SzolgaltatasIdopont_IdopontID",
                table: "SzolgaltatasIdopont",
                column: "IdopontID");

            migrationBuilder.CreateIndex(
                name: "IX_SzolgaltatasIdopont_SzolgaltatasID",
                table: "SzolgaltatasIdopont",
                column: "SzolgaltatasID");

            migrationBuilder.CreateIndex(
                name: "IX_Szulo_FelhasznaloID",
                table: "Szulo",
                column: "FelhasznaloID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Szulo_FelhasznaloID1",
                table: "Szulo",
                column: "FelhasznaloID1",
                unique: true,
                filter: "[FelhasznaloID1] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Vedono_FelhasznaloID",
                table: "Vedono",
                column: "FelhasznaloID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VedonoSzolgaltatas_SzolgaltatasID",
                table: "VedonoSzolgaltatas",
                column: "SzolgaltatasID");

            migrationBuilder.CreateIndex(
                name: "IX_VedonoSzolgaltatas_VedonoID",
                table: "VedonoSzolgaltatas",
                column: "VedonoID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ElerhetosegSzolgaltatas");

            migrationBuilder.DropTable(
                name: "Gyermek");

            migrationBuilder.DropTable(
                name: "Idopontfoglalas");

            migrationBuilder.DropTable(
                name: "Statusz");

            migrationBuilder.DropTable(
                name: "SzolgaltatasIdopont");

            migrationBuilder.DropTable(
                name: "VedonoSzolgaltatas");

            migrationBuilder.DropTable(
                name: "Elerhetoseg");

            migrationBuilder.DropTable(
                name: "Szulo");

            migrationBuilder.DropTable(
                name: "Idopont");

            migrationBuilder.DropTable(
                name: "Szolgaltatas");

            migrationBuilder.DropTable(
                name: "Felhasznalo");

            migrationBuilder.DropTable(
                name: "Vedono");

            migrationBuilder.DropTable(
                name: "Regisztracio");
        }
    }
}
