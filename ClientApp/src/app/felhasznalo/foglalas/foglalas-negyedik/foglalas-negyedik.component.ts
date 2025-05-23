import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VedonoService} from '../../../shared/services/vedono.service';
import {IdopontfoglalasService} from '../../../shared/services/idopontfoglalas.service';
import {MatButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../../shared/services/auth.service";
import {ElerhetosegService} from "../../../shared/services/elerhetoseg.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-foglalas-negyedik',
  templateUrl: './foglalas-negyedik.component.html',
  standalone: true,
  styleUrls: ['./foglalas-negyedik.component.css'],
  imports: [
    MatButton,
    CommonModule,
    FormsModule,
  ]
})
export class FoglalasNegyedikComponent implements OnInit {
  userId: number | null = null;
  idopontok: any[] = [];
  currentWeek: string = '';
  weekStartDate: Date = new Date();
  selectedServiceId: number | null = null;
  availableTimeSlots: any[] = [];
  vedonoId: number;
  szolgaltatasID: number;
  vedono: any;
  selectedDate: Date | null = null;
  kezdesiIdo: string = '';
  befejezesiIdo: string = '';
  weekDays: { day: string; date: Date }[] = [];

  setSelectedDate(date: Date) {
    console.log("Kiválasztott dátum beállítva:", date);
    this.selectedDate = date;
    this.cdr.detectChanges();
  }

  constructor(
    private route: ActivatedRoute,
    private vedonoService: VedonoService,
    private idopontfoglalasService: IdopontfoglalasService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private ElerhetosegService: ElerhetosegService,
  ) {
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.felhasznaloID && currentUser.id) {
      this.userId = currentUser.felhasznaloID || currentUser.id;
      console.log('Bejelentkezett felhasználó ID (szuloID):', this.userId);
    } else {
      console.error('Nincs bejelentkezett felhasználó vagy hiányzik az ID.');
      alert('Be kell jelentkezned a foglaláshoz!');
      this.router.navigateByUrl('/belepes');
      return;
    }

    const state = history.state;
    if (state && state.vedonoData) {
      this.vedono = state.vedonoData;
      this.vedonoId = this.vedono.id;
      console.log('Átadott védőnő adatok:', this.vedono);
    } else {
      this.route.queryParams.subscribe(params => {
        this.vedonoId = +params['id'];
        console.log('Védőnő ID (paraméter):', this.vedonoId);
      });
    }

    this.route.queryParams.subscribe(params => {
      this.szolgaltatasID = +params['szolgaltatasID'];
      console.log("Szolgáltatás ID:", this.szolgaltatasID);
    });

    this.updateCurrentWeek();

    setTimeout(() => {
      if (this.vedonoId && this.szolgaltatasID) {
        console.log('Minden szükséges adat elérhető, időpontok betöltése...');
        this.loadIdopontok();
        this.loadAvailableTimeSlots();
      } else {
        console.warn('Nem áll rendelkezésre minden szükséges adat a betöltéshez.');
      }
    }, 0);
  }

  loadAvailableTimeSlots(): void {
    this.ElerhetosegService.getAppointmentsByService(this.vedonoId, this.szolgaltatasID).subscribe(
      (appointments) => {
        if (appointments && appointments.length > 0) {
          this.availableTimeSlots = appointments;
          console.log("A szolgáltatáshoz rendelt időpontok:", this.availableTimeSlots);
        } else {
          this.availableTimeSlots = [];
          console.log("Nincs elérhető időpont a megadott szolgáltatáshoz.");
          alert("Nincs elérhető időpont a kiválasztott szolgáltatáshoz.");
        }
      },
      (error) => {
        console.error("Hiba történt az időpontok lekérésekor:", error);
        alert("Hiba történt az időpontok lekérésekor.");
      }
    );
  }

  loadIdopontok(): void {
    console.log("loadIdopontok meghivva")
    const startOfWeek: Date = new Date(this.weekDays[0].date);
    const endOfWeek: Date = new Date(this.weekDays[this.weekDays.length - 1].date);

    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
    };

    const startDateFormatted = formatDate(startOfWeek);
    const endDateFormatted = formatDate(endOfWeek);

    console.log('Formázott dátumok küldés előtt:', {
      start: startDateFormatted,
      end: endDateFormatted
    });

    this.vedonoService.getElerhetosegekByVedonoIdAndDateRange(
      this.vedonoId,
      startDateFormatted,
      endDateFormatted
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          console.log('Sikeres válasz:', data);
          this.idopontok = data.map((idopont: any) => ({
            ...idopont,
            statusz: idopont.statusz,
          }));
        } else {
          console.log('Nem található időpont a megadott időszakban');
          this.idopontok = [];
        }
        console.log('Betöltött időpontok:', this.idopontok);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Hiba az időpontok betöltésekor:', error);
        this.idopontok = [];
      },
    });
  }

  getFilteredTimeSlotsByDay(day: string): any[] {
    return this.availableTimeSlots.filter((idopont) =>
      idopont.hetNapjai.toLowerCase() === day.toLowerCase()
    );
  }

  updateCurrentWeek(): void {
    const startOfWeek = new Date(this.weekStartDate);
    startOfWeek.setDate(this.weekStartDate.getDate() - (this.weekStartDate.getDay() || 7) + 1);

    this.weekDays = Array.from({length: 7}).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayNames = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
      return {day: dayNames[i], date: date};
    });

    const startFormatted = `${startOfWeek.getFullYear()}. ${startOfWeek.getMonth() + 1}. ${startOfWeek.getDate()}`;
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endFormatted = `${endOfWeek.getFullYear()}. ${endOfWeek.getMonth() + 1}. ${endOfWeek.getDate()}`;
    this.currentWeek = `${startFormatted} - ${endFormatted}`;
  }

  loadPreviousWeek(): void {
    this.weekStartDate.setDate(this.weekStartDate.getDate() - 6);
    this.updateCurrentWeek();
    this.loadIdopontok();
  }

  loadNextWeek(): void {
    this.weekStartDate.setDate(this.weekStartDate.getDate() + 6);
    this.updateCurrentWeek();
    this.loadIdopontok();
  }

  toggleIndok(idopont: any): void {
    idopont.showIndok = !idopont.showIndok;
  }

  foglalas(idopont: any): void {
    console.log("📢 Foglalás indítása...");

    if (!idopont || !idopont.datum || !idopont.kezdesiIdo || !idopont.befejezesiIdo) {
      console.error("Hiba: Az időpont adatai hiányoznak vagy érvénytelenek!", idopont);
      alert("Hiba: Kérlek, válassz ki egy érvényes időpontot!");
      return;
    }

    const formattedDate = idopont.datum.split("T")[0];
    const formattedStartTime = idopont.kezdesiIdo.split("T")[1]?.substring(0, 8) || "00:00:00";
    const formattedEndTime = idopont.befejezesiIdo.split("T")[1]?.substring(0, 8) || "00:00:00";

    const foglalasData = {
      datum: formattedDate,
      kezdesiIdo: formattedStartTime,
      befejezesiIdo: formattedEndTime,
      foglalasIndok: idopont.foglalasIndok || "",
      szuloID: this.userId,
      vedonoID: this.vedonoId,
      szolgaltatasID: this.szolgaltatasID,
      statusz: 1,
      foglalasIdopontja: new Date().toISOString(),
      utolsoFrissites: new Date().toISOString(),
      felhasznaloNev: this.authService.getCurrentUserName(),
      felhasznaloEmail: this.authService.getCurrentUserEmail(),
    };

    console.log("Elküldött foglalás adatok:", foglalasData);

    this.idopontfoglalasService.foglalas(foglalasData).subscribe({
      next: (response: any) => {
        alert("Foglalás sikeres!");

        this.loadIdopontok();

        this.router.navigate(["/foglalas-otodik", response.id]);
      },
      error: (error) => {
        console.error("Hiba történt a foglalás során:", error);
        alert("Foglalás sikertelen. Kérlek, próbáld újra!");
      },
    });
  }
}
