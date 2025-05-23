import { Component, OnInit } from '@angular/core';
import { IdopontfoglalasService } from '../../../shared/services/idopontfoglalas.service';
import { UserService } from '../../../shared/services/user.service';
import { Felhasznalo } from '../../../shared/models/Felhasznalo';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-foglalasaim',
  templateUrl: './foglalasaim.component.html',
  styleUrls: ['./foglalasaim.component.css']
})
export class FoglalasaimComponent implements OnInit {
  foglalasaim: any[] = [];
  errorMessage: string = '';

  constructor(
    private foglalasService: IdopontfoglalasService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ensureUserAvailable().then((user) => {
      if (user?.id) {
        this.loadFoglalasok(user.id);
      } else {
        this.errorMessage = 'Hiányzó felhasználói azonosító.';
      }
    });
  }

  private loadFoglalasok(felhasznaloId: number): void {
    console.log('Küldött felhasználó ID:', felhasznaloId);
    this.foglalasService.getFoglalasaim(felhasznaloId).subscribe({
      next: (data) => {
        console.log('Foglalások:', data);

        this.foglalasaim = data;
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a foglalásokat.';
      }
    });
  }

  private async ensureUserAvailable(): Promise<Felhasznalo> {
    if (!this.userService.currentUser) {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const parsedUser: Felhasznalo = JSON.parse(raw);
        this.userService.setUser(parsedUser);
      }
    }

    return new Promise<Felhasznalo>((resolve) => {
      this.userService.user$
        .pipe(filter(user => !!user), first())
        .subscribe(user => resolve(user!));
    });
  }
}
