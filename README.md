Amit tudni kell: 
A frontend beindítása: ng serve utasításal kiadásával történik.
A backend beindítása: dotnet run utasítás kiadásával történik.
Az adatbázist és Azure-be hoztam létre, a migrációkat benne hagytam. Lokális adatbázist a "ConnectionString" 
babrálásaval lehet létrehozni: migráció hozzáadás: dotnet ef migrations add <MigrationNeve>, adatbázis befrirssítése:
dotnet ef database update

