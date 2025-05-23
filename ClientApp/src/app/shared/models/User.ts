import {Szerepkor} from "./Szerepkor";

export interface User {
  felhasznaloID: number;
  firebaseUid: string;
  email: string;
  felhasznalonev: string;
  keresztnev: string;
  vezeteknev: string;
  szerepkor: Szerepkor;
}
