import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-foglalas-masodik',
  templateUrl: './foglalas-masodik.component.html',
  styleUrls: ['./foglalas-masodik.component.css']
})
export class FoglalasMasodikComponent {
  services = [
    {name: 'Várandós tanácsadás', id: 1},
    {name: 'Csecsemő védőnői tanácsadás (0-1 év)', id: 2},
    {name: 'Gyerek tanácsadás (1-6 év)', id: 3},
    {name: 'Védőnői fogadóóra', id: 4},
    {name: 'Szülés felkészítő', id: 5},
    {name: 'Méhnyakrák szűrés', id: 6}
  ];
  selectedServiceId: number | null = null;
  szuloId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.getCurrentUser().subscribe(user => {
      if (user && (user.szuloId || user.szuloID)) {
        this.szuloId = user.szuloId ?? user.szuloID;
        console.log("Szülő ID betöltve:", this.szuloId);
      } else {
        console.error("Nincs bejelentkezett szülő, vagy hiányzik a szuloId!");
        this.router.navigate(['/belepes']);
      }
    });
  }

  selectService(service: { name: string, id: number }) {
    this.selectedServiceId = service.id;
    console.log("Kiválasztott szolgáltatás:", service);
  }

  onNext(): void {
    if (!this.selectedServiceId) {
      alert("Kérlek, válassz egy szolgáltatást!");
      return;
    }

    if (!this.szuloId) {
      alert("Hiba: Nincs bejelentkezett szülő! Kérlek, jelentkezz be újra.");
      this.router.navigate(['/belepes']);
      return;
    }

    this.router.navigate(['/foglalas-harmadik'], {
      queryParams: {
        serviceID: this.selectedServiceId,
        szuloId: this.szuloId
      }
    });
  }
}
