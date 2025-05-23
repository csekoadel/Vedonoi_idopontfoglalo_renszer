import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VedonoService} from '../../../shared/services/vedono.service';
import {UserService} from "../../../shared/services/user.service";
import {combineLatest, filter} from "rxjs";

@Component({
  selector: 'app-foglalas-harmadik',
  templateUrl: './foglalas-harmadik.component.html',
  styleUrls: ['./foglalas-harmadik.component.css']
})
export class FoglalasHarmadikComponent implements OnInit {
  vedonok: any[] = [];
  loading: boolean = true;
  selectedServiceId: number | null = null;
  szuloId: number | null = null;
  currentUser: any = {};

  constructor(
    private vedonoService: VedonoService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.route.queryParams,
      this.userService.user$.pipe(filter(user => !!user))
    ]).subscribe(([params, currentUser]) => {
      this.selectedServiceId = params['serviceID'] ? +params['serviceID'] : null;
      this.szuloId = params['szuloId'] ? +params['szuloId'] : null;

      if (!this.selectedServiceId) {
        console.error('Hiányzik a `selectedServiceId`, nem lehet folytatni.');
        this.router.navigate(['/foglalas-masodik']);
        return;
      }

      if (!this.szuloId) {
        console.error('Hiányzik a `szuloId`, nem lehet folytatni.');
        this.router.navigate(['/belepes']);
        return;
      }

      this.currentUser = currentUser;
      if (!this.currentUser.id) {
        console.error('Nincs bejelentkezett felhasználó!');
        this.router.navigate(['/belepes']);
        return;
      }

      this.loadVedonok();
    });
  }

  private loadVedonok(): void {
    this.vedonoService.getVedonok().subscribe({
      next: (data) => {
        console.log('Lekért védőnők:', data);
        const vedonoDetailsRequests = data.map((vedono) =>
          this.vedonoService.getVedonoDetails(vedono.id).toPromise()
        );

        Promise.all(vedonoDetailsRequests)
          .then((details) => {
            console.log('API válasz részletek:', details);
            this.vedonok = details.map((detail) => {
              if (!detail.id) {
                console.error('Hiányzó ID az API válaszból:', detail);
                return null;
              }
              return {
                id: detail.id,
                nev: detail.name || 'Név nem elérhető',
                profilePicture: detail.profilePictureUrl || 'assets/profil_kep_alap.jpg',
                bio: detail.bio || 'Nincs megadott leírás.',
                munkahely: detail.munkahely || 'Nincs megadott munkahely.',
                elerhetosegiLista: detail.elerhetosegiLista || []
              };
            }).filter(vedono => vedono !== null);
          })
          .catch((error) => {
            console.error('Hiba a védőnők részletes adatainak lekérésekor:', error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      error: (error) => {
        console.error('Hiba a védőnők lekérésekor:', error);
        this.loading = false;
      }
    });
  }

  megtekintNaptar(vedono: any): void {
    if (!this.currentUser?.id) {
      console.error('Nem vagy bejelentkezve!');
      alert('Be kell jelentkezned a foglaláshoz!');
      this.router.navigate(['/belepes']);
      return;
    }

    if (!this.szuloId) {
      console.error('Szülő ID nincs beállítva!');
      return;
    }

    if (!vedono?.id) {
      console.error('Védőnő adatai hiányoznak!');
      return;
    }

    if (!this.selectedServiceId) {
      console.error('Szolgáltatás ID hiányzik!');
      return;
    }

    this.router.navigate(['/foglalas-negyedik', vedono.id], {
      queryParams: {
        szolgaltatasID: this.selectedServiceId,
        szuloId: this.szuloId
      },
      state: {
        vedonoData: {
          id: vedono.id,
          nev: vedono.nev,
          profilePicture: vedono.profilePicture,
          bio: vedono.bio,
          munkahely: vedono.munkahely,
          elerhetosegiLista: vedono.elerhetosegiLista
        }
      }
    });
  }
}
