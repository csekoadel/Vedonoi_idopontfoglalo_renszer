import { Component, OnInit } from '@angular/core';
import { GyermekService } from '../../../shared/services/gyermek.service';
import { UserService } from '../../../shared/services/user.service';
import { filter,first } from 'rxjs/operators';

@Component({
  selector: 'app-foglalas-elso',
  templateUrl: './foglalas-elso.component.html',
  styleUrls: ['./foglalas-elso.component.css']
})
export class FoglalasElsoComponent implements OnInit {
  gyermekek: any[] = [];
  recipients: string[] = ['Magamnak'];
  selectedRecipient: string = '';

  constructor(
    private gyermekService: GyermekService,
    private userService: UserService
  ) {}

  private async ensureUserAvailable(): Promise<any> {
    if (!this.userService.currentUser) {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          this.userService.setUser(parsed);
        } catch (e) {
          console.error('Hibás currentUser a localStorage-ból:', e);
        }
      }
    }

    return new Promise<any>((resolve) => {
      this.userService.user$
        .pipe(filter(user => !!user), first())
        .subscribe(user => resolve(user));
    });
  }

  ngOnInit(): void {
    this.ensureUserAvailable().then(currentUser => {
      console.log('Bejelentkezett felhasználó:', currentUser);

      const felhasznaloId = currentUser.felhasznaloID ?? currentUser.id;

      if (!currentUser.szuloId && felhasznaloId) {
        this.userService.getSzuloIdByFelhasznaloId(felhasznaloId).subscribe(szuloId => {
          if (szuloId) {
            currentUser.szuloId = szuloId;
            this.userService.setUser(currentUser);
            this.loadGyermekek(szuloId);
          } else {
            alert("Nem található szülői azonosító. Kérjük, jelentkezzen ki és be újra.");
          }
        });
      } else if (currentUser.szuloId) {
        this.loadGyermekek(currentUser.szuloId);
      } else {
        alert("Nem található szülői azonosító. Kérjük, jelentkezzen ki és be újra.");
      }
    });
  }

  private loadGyermekek(szuloId: number): void {
    this.gyermekService.getGyermekekBySzuloId(szuloId).subscribe({
      next: (gyermekek) => {
        console.log('Gyermekek betöltve:', gyermekek);
        this.recipients = ['Magamnak', ...gyermekek.map(g => `${g.nev} (${g.kor} év)`)];
      },
      error: (error) => {
        console.error('Hiba történt a gyermekek lekérésekor:', error);
      }
    });
  }
}
