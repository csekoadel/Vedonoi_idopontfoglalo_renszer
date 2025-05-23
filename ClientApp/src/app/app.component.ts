import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {AuthService} from './shared/services/auth.service';
import {UserService} from './shared/services/user.service';
import {RoleService} from './shared/services/role.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  page = '';
  loggedInUser = false;
  currentRole: string | null = null;
  currentUser: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.roleService.currentRole$.subscribe((role) => {
      this.currentRole = role;
      this.loggedInUser = !!role;
      this.cdRef.detectChanges();
    });
    this.userService.user$.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.loggedInUser = !!user;
      this.currentRole = user?.szerepkor || null;
      if (!user.szuloId) {
        console.warn('Hiányzó szülői azonosító! API lekérés folyamatban...');
        this.userService.getSzuloIdByFelhasznaloId(user.felhasznaloID).subscribe(szuloId => {
          if (szuloId) {
            this.currentUser.szuloId = szuloId;
            this.userService.setUser(this.currentUser);
            console.log('Szülői azonosító frissítve:', szuloId);
          } else {
            console.error('Nem sikerült lekérni a szülői azonosítót.');
          }
        });
      }
      this.cdRef.detectChanges();
    });

    this.checkLocalStorageAndInitialize();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.clearUserSession();
      this.router.navigateByUrl('/belepes');
    }).catch(err => {
      console.error('Hiba a kijelentkezés során:', err);
    });
  }

  private clearUserSession(): void {
    this.loggedInUser = false;
    this.currentRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.roleService.clearRole();
    this.userService.setUser(null);
    this.cdRef.detectChanges();
  }

  private checkLocalStorageAndInitialize(): void {
    const storedUserRaw = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('userRole');

    if (storedUserRaw && storedRole) {
      const storedUser = JSON.parse(storedUserRaw);
      if (storedUser.id) {
        this.userService.setUser(storedUser);
        this.cdRef.detectChanges();
      } else {
        this.loadUserAndRoleData();
      }
    } else {
      this.loadUserAndRoleData();
    }
  }

  private loadUserAndRoleData(): void {
    this.authService.getUserLoggedIn().subscribe({
      next: (user) => {
        if (user && user.uid) {
          this.authService.getUserRole(user.uid).subscribe({
            next: (response) => {
              if (response?.role) {
                const userToStore = {firebaseUid: user.uid, role: response.role};
                localStorage.setItem('currentUser', JSON.stringify(userToStore));
                localStorage.setItem('userRole', response.role);
                this.loggedInUser = true;
                this.currentRole = response.role;
                this.userService.loadUserByFirebaseUid(user.uid).subscribe({
                  next: (firebaseUserData) => {
                    this.userService.setUser(firebaseUserData);
                    this.cdRef.detectChanges();
                  },
                  error: (err) => console.error('Hiba a felhasználói adatok betöltésekor:', err)
                });
              } else {
                console.warn('Hibás szerepkör az API válaszban.');
                this.clearUserSession();
              }
            },
            error: (err) => console.error('API hiba szerepkör lekérésénél:', err)
          });
        } else {
          console.warn('Nem talált Firebase UID-t.');
          this.clearUserSession();
        }
      },
      error: (err) => console.error('Hiba a bejelentkezett felhasználó lekérésekor:', err)
    });
  }

  changePage(selectedPage: string): void {
    console.log('Navigáció:', {loggedInUser: this.loggedInUser, currentRole: this.currentRole});
    if (!this.loggedInUser || !this.currentRole) {
      console.log('Nincs bejelentkezve vagy nincs szerepköre. Átirányítás a bejelentkezési oldalra.');
      this.router.navigateByUrl('/belepes');
      return;
    }
    this.router.navigateByUrl(selectedPage);
  }

  onToggleSideNav(sidenav: MatSidenav): void {
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav): void {
    if (event === true) {
      sidenav.close();
    }
  }
}
