import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IdopontfoglalasService} from '../../../shared/services/idopontfoglalas.service';

@Component({
  selector: 'app-foglalas-otodik',
  templateUrl: './foglalas-otodik.component.html',
  styleUrls: ['./foglalas-otodik.component.css']
})
export class FoglalasOtodikComponent implements OnInit {
  foglalas: any | null = null;
  errorMessage: string | null = null;
  foglalasId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private idopontfoglalasService: IdopontfoglalasService
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Lekérdezett ID:', id);

    if (!isNaN(id) && id > 0) {
      this.fetchFoglalas(id);
    } else {
      this.errorMessage = 'Érvénytelen azonosító';
      console.error('Nem megfelelő az ID:', id);
    }
  }


  fetchFoglalas(id: number): void {
    this.idopontfoglalasService.getFoglalasById(id).subscribe({
      next: (data) => {
        this.foglalas = data;
        console.log('Foglalás adatok:', this.foglalas);
      },
      error: (err) => {
        console.error('Hiba a foglalás lekérésekor:', err);
        this.errorMessage = 'Nem sikerült betölteni a foglalás adatait.';
      }
    });
  }
}
