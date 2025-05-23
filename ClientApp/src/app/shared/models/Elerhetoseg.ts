export interface Elerhetoseg {
  id?: number;
  vedonoID: number;
  hetNapjai: string;
  kezdesiIdo: string;
  befejezesiIdo: string;
  datum: string;
  statusz: number;
  szolgaltatasok?: Array<{
    szolgaltatasID: number;
    nev: string;
  }>;
}
