import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegistrationRequest} from '../../shared/models/RegistrationRequest';
import {Szerepkor} from "../../shared/models/Szerepkor";

@Component({
  selector: 'app-regisztracio',
  templateUrl: './regisztracio.component.html',
  styleUrls: ['./regisztracio.component.scss']
})
export class RegisztracioComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', Validators.required),
    keresztnev: new FormControl('', Validators.required),
    vezeteknev: new FormControl('', Validators.required),
    felhasznalonev: new FormControl('', Validators.required),
    szerepkor: new FormControl(Szerepkor.Vendeg, Validators.required),
    lakcim: new FormControl(''),
    munkahely: new FormControl(''),
    munkaIdo: new FormControl(''),
    bio: new FormControl('')
  });

  szerepkorok = [
    {label: 'Védőnő', value: Szerepkor.Vedono},
    {label: 'Szülő', value: Szerepkor.Szulo},
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  onSubmit() {
    const roleMapToBackend: { [key: string]: Szerepkor } = {
      "Védőnő": Szerepkor.Vedono,
      "Szülő": Szerepkor.Szulo,

    };
    if (this.signUpForm.invalid) {
      this.snackBar.open('Kérjük töltse ki az összes kötelező mezőt!', 'Bezár', {duration: 5000});
      return;
    }

    const email = this.signUpForm.value.email || '';
    const password = this.signUpForm.value.password || '';

    this.authService.registerToFirebase(email, password).subscribe({
      next: (firebaseUid) => {
        console.log('Firebase UID:', firebaseUid);
        const szerepkorValue = roleMapToBackend[this.signUpForm.value.szerepkor] || Szerepkor.Vendeg;

        const requestData: RegistrationRequest = {
          email: this.signUpForm.value.email || '',
          felhasznalonev: this.signUpForm.value.felhasznalonev || '',
          Jelszo: this.signUpForm.value.password || '',
          firebaseUid: firebaseUid,
          szerepkor: szerepkorValue,
          keresztnev: this.signUpForm.value.keresztnev || '',
          vezeteknev: this.signUpForm.value.vezeteknev || '',
          lakcim: this.signUpForm.value.lakcim || null,
          munkahely: this.signUpForm.value.munkahely || null,
          munkaIdo: this.signUpForm.value.munkaIdo || null,
          bio: this.signUpForm.value.bio || null,

        };
        this.authService.registerToBackend(requestData).subscribe({
          next: () => {
            this.snackBar.open('Sikeres regisztráció!', 'OK', {duration: 5000});
            this.router.navigateByUrl('/belepes');
          },
          error: (error) => {
            console.error('Backend regisztráció hiba:', error);
            this.snackBar.open(error.error?.message || 'Hiba történt a regisztráció során.', 'Bezár', {duration: 5000});
          }
        });
      },
      error: (error) => {
        console.error('Firebase regisztráció hiba:', error);
        this.snackBar.open('Hiba történt a Firebase regisztráció során.', 'Bezár', {duration: 5000});
      }
    });
  }
}


