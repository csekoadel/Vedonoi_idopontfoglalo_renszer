import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GyermekService} from '../../shared/services/gyermek.service';
import {Gyermek} from '../../shared/models/Gyermek';
import {UserService} from '../../shared/services/user.service';


import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-ujgyermek',
  templateUrl: './ujgyermek.component.html',
  styleUrls: ['./ujgyermek.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class UjgyermekComponent {
  childForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gyermekService: GyermekService,
    private userService: UserService
  ) {
    console.log('Konstruktor - Jelenlegi felhasználó:', this.userService.currentUser);

    this.childForm = this.fb.group({
      vezeteknev: ['', [Validators.required, Validators.minLength(2)]],
      keresztnev: ['', [Validators.required, Validators.minLength(2)]],
      szuletesiDatum: ['', Validators.required],
      neme: ['', Validators.required]
    });

    // Feliratkozás a felhasználó változásaira
    this.userService.user$.subscribe(user => {
      if (!user) {
        console.warn("user undefined, nem lehet ID-t lekérni.");
        return;
      }
      console.log(user.id);
    });

  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.childForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    console.log('Form értékek:', this.childForm.value);
    console.log('UserService állapota:', this.userService.currentUser);

    const currentUser = this.userService.currentUser;

    if (!currentUser) {
      console.error('Nincs bejelentkezett felhasználó!');
      alert('Kérjük, jelentkezzen be újra!');
      return;
    }

    if (!currentUser.szuloID && currentUser.szuloId !== undefined) {
      console.warn("`szuloId` található, de `szuloID` hiányzik. Konvertálás...");
      currentUser.szuloID = currentUser.szuloId;
    }
    if (!currentUser.szuloID) {
      console.warn("A `szuloID` nincs beállítva! Próbáljuk az `id`-ből vagy `felhasznaloID`-ból.");
      currentUser.szuloID = currentUser.felhasznaloID || currentUser.id;
    }


    if (this.childForm.valid) {
      const gyermek: Gyermek = {
        szuloID: currentUser.felhasznaloID || currentUser.id,
        keresztnev: this.childForm.value.keresztnev,
        vezeteknev: this.childForm.value.vezeteknev,
        szuletesiDatum: new Date(this.childForm.value.szuletesiDatum).toISOString(),
        neme: this.childForm.value.neme
      };

      console.log('Küldendő gyermek adatok:', gyermek);

      const gyermekObs = this.gyermekService.addGyermek(gyermek);

      if (!gyermekObs) {
        console.error('Hiba: `addGyermek()` nem adott vissza Observable-t!');
        return;
      }

      gyermekObs.subscribe({
        next: (response) => {
          console.log('Sikeres mentés:', response);
          alert('Gyermek sikeresen felvéve!');
          this.childForm.reset();
        },
        error: (error) => {
          console.error('Hiba a gyermek felvétele során:', error);
          alert('Hiba történt a gyermek felvétele során: ' + error.message);
        }
      });
    }
  }
}
