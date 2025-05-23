import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElerhetosegService} from "../../shared/services/elerhetoseg.service";
import {Vedono} from '../../shared/models/Vedono';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {MatCalendar} from "@angular/material/datepicker";

interface ServiceMapping {
  id: number;
  name: string;
}

@Component({
  selector: 'app-naptar-kezelo',
  templateUrl: './naptar-kezelo.component.html',
  imports: [
    MatCalendar,
    NgxMaterialTimepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckbox,
    MatList,
    MatListItem,
    JsonPipe,
    MatIcon,
    MatButton,
    MatInput,
    MatCard,
    NgIf,
    NgForOf,
    MatIconButton
  ],
  standalone: true,
  styleUrls: ['./naptar-kezelo.component.css']
})
export class NaptarKezeloComponent implements OnInit {
  selectedDate: Date | null = null;
  kezdesiIdo: string = '';
  befejezesiIdo: string = '';
  idopontok: any[] = [];
  vedonoData: Vedono | null = null;
  vedonoID: number | null = null;
  servicesList: ServiceMapping[] = [
    {id: 1, name: 'Várandós tanácsadás'},
    {id: 2, name: 'Csecsemő védőnői tanácsadás (0-1 év)'},
    {id: 3, name: 'Gyerek tanácsadás (1-6 év)'},
    {id: 4, name: 'Védőnői fogadóóra'},
    {id: 5, name: 'Szülés felkészítő'},
    {id: 6, name: 'Méhnyakrák szűrés'}
  ];

  selectedServices: { [key: string]: boolean } = {};

  constructor(private elerhetosegService: ElerhetosegService, private afAuth: AngularFireAuth, private cdr: ChangeDetectorRef) {
    this.initializeSelectedServices();
  }

  private initializeSelectedServices(): void {
    this.servicesList.forEach(service => {
      this.selectedServices[service.name] = false;
    });
  }

  getAvailableServicesForTime(selectedDate: Date, kezdesiIdo: string, befejezesiIdo: string): ServiceMapping[] {
    return this.servicesList.filter(service => {
      return !this.idopontok.some(appointment =>
        appointment.datum === this.formatDateToLocalTime(selectedDate) &&
        appointment.kezdesiIdo === kezdesiIdo &&
        appointment.befejezesiIdo === befejezesiIdo &&
        appointment.szolgaltatasID === service.id
      );
    });
  }

  getDayName(date: Date | null): string {
    if (!date) {
      console.error('Érvénytelen dátum: a date null vagy undefined.');
      return 'Ismeretlen nap';
    }

    const dayNames = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
    const dayIndex = (date.getDay() + 6) % 7; // Hétfő = 0, Vasárnap = 6
    return dayNames[dayIndex];
  }

  loadExistingAppointments(): void {
    if (!this.vedonoID) {
      console.error('Nincs elérhető védőnő azonosító.');
      return;
    }

    this.elerhetosegService.getAppointments(this.vedonoID).subscribe({
      next: (appointments) => {
        console.log('📅 Betöltött összes időpont:', appointments);

        const today = new Date();
        const hetKezdete = this.getHetElsoNapja(today);
        const hetVege = this.getHetUtolsoNapja(today);

        this.idopontok = appointments.filter((appointment: any) => {
          const datum = new Date(appointment.datum);
          return datum >= hetKezdete && datum <= hetVege;
        }).map((appointment: any) => {
          const szolgaltatasok = appointment.elerhetosegSzolgaltatasok && appointment.elerhetosegSzolgaltatasok.length > 0
            ? appointment.elerhetosegSzolgaltatasok.map((szolgaltatas: any) => szolgaltatas.szolgaltatas?.nev)
            : ['Nincs szolgáltatás'];

          const appointmentDate = new Date(appointment.datum);
          return {
            ...appointment,
            kezdesiIdo: this.convertTo24HourFormat(appointment.kezdesiIdo),
            befejezesiIdo: this.convertTo24HourFormat(appointment.befejezesiIdo),
            szolgaltatasok: szolgaltatasok,
            hetNapjai: this.getDayName(appointmentDate),
            id: appointment.id
          };
        });

        console.log('📅 Szűrt heti időpontok:', this.idopontok);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Hiba történt az időpontok betöltésekor:', err);
        alert('Hiba történt az időpontok betöltésekor.');
      }
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const day = (localDate.getDay() + 6) % 7; // Hétfő = 0, Szombat = 5, Vasárnap = 6
    return day !== 5 && day !== 6; // Szombat (5) és Vasárnap (6) tiltása
  };

  private getHetElsoNapja(datum: Date): Date {
    const elsoNap = new Date(datum);
    const napIndex = (elsoNap.getDay() + 6) % 7;
    const hetfoIndex = napIndex === 0 ? 0 : -napIndex;
    elsoNap.setDate(elsoNap.getDate() + hetfoIndex);
    elsoNap.setHours(0, 0, 0, 0);
    return elsoNap;
  }

  private getHetUtolsoNapja(datum: Date): Date {
    const utolsoNap = new Date(this.getHetElsoNapja(datum));
    utolsoNap.setDate(utolsoNap.getDate() + 6);
    utolsoNap.setHours(23, 59, 59, 999);
    return utolsoNap;
  }

  toggleDetails(item: any): void {
    item.showDetails = !item.showDetails;
  }

  onDateSelected(): void {
    if (!this.selectedDate) {
      console.error('Nem választottál dátumot.');
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (this.selectedDate < currentDate) {
      alert('Nem választhatsz múltbéli dátumot.');
      this.selectedDate = null;
      return;
    }

    console.log('Kiválasztott dátum:', this.selectedDate);
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        console.error('Felhasználó nincs bejelentkezve.');
        alert('Kérjük, jelentkezzen be!');
        return;
      }

      const firebaseUID = user.uid;
      console.log('Bejelentkezett felhasználó UID-ja:', firebaseUID);
      this.fetchVedonoData(firebaseUID);
    });
  }

  private fetchVedonoData(firebaseUID: string): void {
    this.elerhetosegService.getCombinedUserData(firebaseUID).subscribe({
      next: (userData: Vedono) => {
        this.vedonoData = userData;
        this.vedonoID = userData?.vedonoID || null;
        console.log('Védőnő adatai:', this.vedonoData);
        console.log('Védőnő ID:', this.vedonoID);

        if (this.vedonoID) {
          this.loadExistingAppointments();
        } else {
          console.warn('Ez a felhasználó nem védőnő, nincs vedonoID.');
        }
      },
      error: (err) => {
        console.error('Hiba a felhasználói adatok lekérésekor:', err);
        alert('Hiba történt a felhasználói adatok betöltésekor!');
      }
    });
  }

  addAvailability(): void {
    if (!this.selectedDate) {
      alert('Kérem, válassza ki a dátumot!');
      return;
    }

    if (!this.kezdesiIdo || !this.befejezesiIdo) {
      alert('Kérem, adja meg a kezdési és befejezési időt!');
      return;
    }

    if (!this.vedonoID) {
      alert('Kérem, jelentkezzen be, hogy hozzáadhassa az időpontot!');
      return;
    }

    const selectedServiceIds = this.servicesList
      .filter(service => this.selectedServices[service.name])
      .map(service => service.id);

    if (selectedServiceIds.length === 0) {
      alert('Kérem, válasszon legalább egy szolgáltatást!');
      return;
    }

    selectedServiceIds.forEach(serviceID => {
      const elerhetoseg = {
        datum: this.formatDateToLocalTime(this.selectedDate),
        kezdesiIdo: this.combineDateAndTime(this.selectedDate, this.kezdesiIdo).toISOString(),
        befejezesiIdo: this.combineDateAndTime(this.selectedDate, this.befejezesiIdo).toISOString(),
        vedonoID: this.vedonoID,
        hetNapjai: this.getDayName(this.selectedDate),
        szolgaltatasIds: [serviceID]
      };

      console.log('Elküldött adat a backendnek:', JSON.stringify(elerhetoseg, null, 2));

      this.elerhetosegService.addElerhetoseg(elerhetoseg).subscribe({
        next: (response) => {
          alert('Időpont sikeresen hozzáadva!');
          this.loadExistingAppointments();
        },
        error: (err) => {
          console.error('Hiba az API hívás során:', err);
          alert(err.error || 'Váratlan hiba történt. Kérjük, próbálja újra később.');
        }
      });
    });

    this.resetForm();
  }

  combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    const offset = new Date().getTimezoneOffset();
    combinedDate.setMinutes(combinedDate.getMinutes() - offset);
    return combinedDate;
  }

  private resetForm(): void {
    this.kezdesiIdo = '';
    this.befejezesiIdo = '';
    this.selectedDate = null;
    this.initializeSelectedServices();
  }

  formatTimeTo24Hour(time: string): string {
    if (!time) return '00:00';
    const isPM = time.includes('PM');
    let [hours, minutes] = time.replace('AM', '').replace('PM', '').trim().split(':').map(Number);

    if (isPM && hours !== 12) {
      hours += 12;
    }
    if (!isPM && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  deleteAvailability(item: any): void {
    if (!confirm('Biztosan törölni szeretnéd ezt az időpontot?')) {
      return;
    }

    this.elerhetosegService.deleteElerhetoseg(item.id).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.idopontok = this.idopontok.filter(i => i.id !== item.id);
      },
      error: (err) => {
        console.error('Hiba történt az időpont törlésekor:', err);
        alert('Hiba történt az időpont törlésekor.');
      }
    });
  }

  formatDateToLocalTime(date: Date | null): string {
    if (!date) return '';
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toLocaleDateString('hu-HU');
  }

  convertTo24HourFormat(time: string): string {
    const date = new Date(time);
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
