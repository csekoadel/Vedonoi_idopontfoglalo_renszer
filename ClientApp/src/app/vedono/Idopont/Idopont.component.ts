import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VedonoService } from '../../shared/services/vedono.service';
import { AuthService } from '../../shared/services/auth.service';
import { Elerhetoseg } from '../../shared/models/Elerhetoseg';
import { Felhasznalo } from '../../shared/models/Felhasznalo';
import { Subscription, of } from 'rxjs';
import { HetNapjaEnum } from "../../shared/models/HetNapjaEnum";
import { ElerhetosegService } from "../../shared/services/elerhetoseg.service";

@Component({
  selector: 'app-Idopont',
  templateUrl: './Idopont.component.html',
  styleUrls: ['./Idopont.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class IdopontComponent implements OnInit, OnDestroy {
  currentUser: Partial<Felhasznalo> = {};
  vedonoId: number | null = null;
  elerhetosegek: Elerhetoseg[] = [];
  betoltesAlatt = false;
  hibaUzenet: string | null = null;
  private subscription: Subscription = new Subscription();
  simplifiedData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private vedonoService: VedonoService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private elerhetosegService: ElerhetosegService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const localUserRaw = localStorage.getItem('currentUser');
    if (localUserRaw) {
      try {
        const localUser = JSON.parse(localUserRaw);
        if (localUser?.vedonoID) {
          this.vedonoId = localUser.vedonoID;
          this.naptarBetoltese();
          return;
        }
      } catch (e) {
      }
    }

    this.route.paramMap.subscribe(params => {
      const paramId = params.get('vedonoId');
      if (paramId && paramId !== 'undefined') {
        this.vedonoId = Number(paramId);
        if (!isNaN(this.vedonoId) && this.vedonoId > 0) {
          this.naptarBetoltese();
        } else {
          this.hibaUzenet = 'Hiba: Érvénytelen azonosító!';
        }
      } else {
        this.initializeUser();
      }
    });
  }

  private initializeUser(): void {
    this.betoltesAlatt = true;
    this.subscription.add(
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
          if (user?.vedonoID) {
            this.vedonoId = user.vedonoID;
            this.router.navigate(['/Idopont', this.vedonoId]);
          } else {
            this.hibaUzenet = 'Hiba: Nincs megfelelő védőnői azonosító.';
          }
          this.betoltesAlatt = false;
        },
        error: (error) => {
          this.hibaUzenet = 'Hiba történt a felhasználó adatainak betöltésekor.';
          this.betoltesAlatt = false;
        }
      })
    );
  }

  private naptarBetoltese(): void {
    if (!this.vedonoId) return;
    this.betoltesAlatt = true;
    this.hibaUzenet = null;

    this.subscription.add(
      this.vedonoService.getElerhetosegekByVedonoId(this.vedonoId).subscribe({
        next: (elerhetosegek) => {
          this.elerhetosegek = elerhetosegek;
          this.simplifiedData = this.getDatumokSzerintCsoportositvaArray();
          this.cdr.detectChanges();
          this.betoltesAlatt = false;
        },
        error: () => {
          this.hibaUzenet = 'A naptár betöltése sikertelen.';
          this.betoltesAlatt = false;
        }
      })
    );
  }

  getDatumokSzerintCsoportositvaArray(): any[] {
    return Array.from(this.getDatumokSzerintCsoportositva().entries()).map(([datum, idopontok]) => ({
      datum: new Date(datum),
      idopontok: idopontok || []
    }));
  }

  getDatumokSzerintCsoportositva(): Map<string, Elerhetoseg[]> {
    const csoportositott = new Map<string, Elerhetoseg[]>();
    this.elerhetosegek.forEach(e => {
      const datum = this.datePipe.transform(new Date(e.datum), 'yyyy-MM-dd')!;
      if (!csoportositott.has(datum)) csoportositott.set(datum, []);
      csoportositott.get(datum)?.push(e);
    });
    return csoportositott;
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date instanceof Date ? date : new Date(date), 'yyyy. MMMM d. HH:mm')!;
  }

  getHungarianDayName(englishDayName: string): string {
    switch (englishDayName) {
      case 'Monday': return HetNapjaEnum.Hetfo;
      case 'Tuesday': return HetNapjaEnum.Kedd;
      case 'Wednesday': return HetNapjaEnum.Szerda;
      case 'Thursday': return HetNapjaEnum.Csutortok;
      case 'Friday': return HetNapjaEnum.Pentek;
      case 'Saturday': return HetNapjaEnum.Szombat;
      case 'Sunday': return HetNapjaEnum.Vasarnap;
      default: return '';
    }
  }

  getHungarianMonthName(englishMonthName: string): string {
    switch (englishMonthName) {
      case 'January': return 'Január';
      case 'February': return 'Február';
      case 'March': return 'Március';
      case 'April': return 'Április';
      case 'May': return 'Május';
      case 'June': return 'Június';
      case 'July': return 'Július';
      case 'August': return 'Augusztus';
      case 'September': return 'Szeptember';
      case 'October': return 'Október';
      case 'November': return 'November';
      case 'December': return 'December';
      default: return '';
    }
  }

  getHungarianDate(date: Date): string {
    const englishDay = date.toLocaleString('en-US', { weekday: 'long' });
    const englishMonth = date.toLocaleString('en-US', { month: 'long' });
    const hungarianDay = this.getHungarianDayName(englishDay);
    const hungarianMonth = this.getHungarianMonthName(englishMonth);
    return `${hungarianDay}, ${hungarianMonth} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
