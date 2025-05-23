import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fooldal',
  standalone: true,
  templateUrl: './fooldal.component.html',
  styleUrl: './fooldal.component.css'
})
export class FooldalComponent {
  constructor(private router: Router) {
  }

  foglalas(): void {
    this.router.navigateByUrl("/belepes").catch(error => {
      console.error('Hiba történt a navigálás során:', error);
    });
  }

}
