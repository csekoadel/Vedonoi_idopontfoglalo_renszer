import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IdopontfoglalasService } from '../../shared/services/idopontfoglalas.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-foglalasok-listaja',
  templateUrl: './foglalasok-listaja.component.html',
  styleUrls: ['./foglalasok-listaja.component.css'],
})
export class FoglalasokListajaComponent implements OnInit {
  bookings: any[] = [];
  vedonoId!: number;
  errorMessage: string = '';
  currentRole: string = '';

  constructor(
    private foglalasService: IdopontfoglalasService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getCurrentUserRole();

    if (this.currentRole !== 'Vedono') {
      this.errorMessage = 'Hozzáférés megtagadva. Csak védőnők számára elérhető oldal.';
      this.router.navigate(['/belepes']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.errorMessage = 'Nincs bejelentkezett felhasználó.';
        this.router.navigate(['/belepes']);
        return;
      }

      this.vedonoId = this.authService.getCurrentUserId();

      if (!this.vedonoId) {
        this.errorMessage = 'Hibás védőnő azonosító.';
        this.router.navigate(['/belepes']);
        return;
      }

      this.loadBookings();
    });
  }

  private loadBookings(): void {
    this.foglalasService.getFoglalasokByVedonoId(this.vedonoId).subscribe({
      next: (data) => {
        this.bookings = data.map(booking => ({
          id: booking.id,
          felhasznaloNev: booking.felhasznaloNev,
          datum: booking.datum,
          kezdesiIdo: booking.kezdesiIdo,
          befejezesiIdo: booking.befejezesiIdo,
          statusz: booking.statusz
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a foglalásokat.';
      },
    });
  }

  elutasitFoglalas(bookingId: number): void {
    this.foglalasService.elutasitFoglalas(bookingId).subscribe({
      next: () => {
        alert('A foglalás elutasítva és az indok e-mailben elküldve.');
        this.bookings = this.bookings.map(booking =>
          booking.id === bookingId ? { ...booking, statusz: 'Elutasítva' } : booking
        );
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Nem sikerült elutasítani a foglalást.');
      }
    });
  }

}
