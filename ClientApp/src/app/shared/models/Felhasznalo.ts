export interface Felhasznalo {
  id: number;
  felhasznaloID: number;
  firebaseUid?: string;
  email: string;
  felhasznalonev: string;
  keresztnev: string;
  vezeteknev: string;
  szerepkor: string;
  telefonszam?: string;
  profilkepUrl?: string;
  regisztracioIdopontja?: Date;
  utolsoFrissites?: Date;
  jelszo?: string;
  lakcim?: string;
  munkahely?: string;
  munkaIdo?: string;
  bio?: string;
  szuloId?: number;
  szuloID?: number;
  vedonoID?: number;
}
