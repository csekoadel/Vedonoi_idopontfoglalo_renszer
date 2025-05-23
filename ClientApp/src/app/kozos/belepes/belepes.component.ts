import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-belepes',
  templateUrl: './belepes.component.html',
  styleUrls: ['./belepes.component.css'],
})
export class BelepesComponent implements OnInit {
  loading: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
  ) {
  }

  private handleError(error: any, message: string) {
    console.error(message, error);
    this.showError(message);
    this.loading = false;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');

    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        console.log('Visszaállított felhasználói adat:', user);

        if (user.id || user.felhasznaloID) {
          this.redirectUserBasedOnRole(userRole || 'Vendeg');
        } else {
          console.error('A felhasználói adatok nem tartalmaznak azonosítót.');
        }
      } catch (error) {
        console.error('Hiba történt a localStorage adatok feldolgozása közben:', error);
      }
    } else {
      console.error('Nincs mentett felhasználói adat a localStorage-ban.');
    }
  }

  login() {
    if (this.email.invalid || this.password.invalid) {
      this.showError('Kérjük, töltsd ki az összes mezőt helyesen!');
      return;
    }

    this.loading = true;

    this.authService.login(this.email.value || '', this.password.value || '').subscribe({
      next: (userData) => {
        if (!userData || (!userData.id && !userData.felhasznaloID)) {
          this.handleError(null, 'Hiba történt a bejelentkezés során. Hiányzó azonosító.');
          return;
        }
        const userToStore = {
          id: userData.id ?? userData.felhasznaloID ?? userData.firebaseUid,
          felhasznaloID: userData.felhasznaloID ?? userData.id ?? null,
          email: userData.email || '',
          felhasznalonev: userData.felhasznalonev || '',
          keresztnev: userData.keresztnev || '',
          vezeteknev: userData.vezeteknev || '',
          telefonszam: userData.telefonszam || '',
          szerepkor: userData.szerepkor || 'Vendeg',
          regisztracioIdopontja: userData.regisztracioIdopontja || '',
          profilkepUrl: userData.profilkepUrl || '',
          utolsoFrissites: userData.utolsoFrissites || '',
          firebaseUid: userData.firebaseUid || '',
          szuloId: userData.szuloId ?? userData.szuloID ?? null,
          vedonoID: userData.vedonoID ?? null,
          bio: userData.bio || '',
          munkahely: userData.munkahely || ''
        };

        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        localStorage.setItem('userRole', userData.szerepkor || 'Vendeg');

        setTimeout(() => {
          console.log('Újraellenőrzés 100ms után:', localStorage.getItem('currentUser'));
        }, 100);

        this.userService.setUser(userToStore);
        this.redirectUserBasedOnRole(userData.szerepkor || 'Vendeg');
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error, 'Hibás email vagy jelszó. Kérjük, próbáld újra!');
        this.loading = false;
      }
    });
  }

  private redirectUserBasedOnRole(role: string) {
    if (role === 'Adminisztrator') {
      this.router.navigateByUrl('/admin').then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } else if (role === 'Vedono') {
      this.router.navigateByUrl('/dashboard').then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } else if (role === 'Szulo') {
      this.router.navigateByUrl('/fooldal').then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } else {
      this.showError('Nincs megfelelő jogosultság!');
      this.authService.logout().then(() => this.router.navigateByUrl('/belepes'));
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Bezár', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
