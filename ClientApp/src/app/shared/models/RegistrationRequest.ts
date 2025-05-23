import {Szerepkor} from "./Szerepkor";

export interface RegistrationRequest {
  email: string;
  felhasznalonev: string;
  Jelszo?: string
  firebaseUid?: string;
  szerepkor: Szerepkor;
  keresztnev: string;
  vezeteknev: string;
  lakcim?: string;
  munkahely?: string;
  munkaIdo?: string;
  bio?: string;
}

