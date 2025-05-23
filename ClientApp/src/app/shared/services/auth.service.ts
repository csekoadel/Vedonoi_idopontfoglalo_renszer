import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, from, map, Observable, of, tap, throwError} from 'rxjs';
import {UserService} from './user.service';
import {RegistrationRequest} from '../models/RegistrationRequest';
import {catchError, switchMap} from 'rxjs/operators';
import {Felhasznalo} from '../models/Felhasznalo';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private roleApiUrl = `http://localhost:5000/api/Role`;
  private elerhetosegApiUrl = `http://localhost:5000/api/Elerhetoseg`;
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(
    private auth: AngularFireAuth,
    private http: HttpClient,
    private userService: UserService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.currentUserSubject.next(parsedUser);
      this.userLoggedInSubject.next(true);
    }
  }

  getCurrentUserId(): number | null {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const role = this.getCurrentUserRole();

      if (role === 'Vedono') {
        const vedonoId = user?.vedonoID || null;
        return vedonoId;
      } else if (role === 'Szulo') {
        const szuloId = user?.szuloID || user?.szuloId || null;
        return szuloId;
      }
      return user?.id || user?.felhasznaloID || null;
    } catch (error) {
      return null;
    }
  }

  getCurrentUserName(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.felhasznalonev || null;
  }

  getCurrentUserEmail(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.email || null;
  }

  registerToFirebase(email: string, password: string): Observable<string> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      map((cred) => {
        if (!cred.user?.uid) {
          throw new Error('Firebase UID nem generálódott.');
        }
        console.log('Firebase UID létrejött:', cred.user.uid);
        return cred.user.uid;
      }),
      catchError((error) => {
        console.error('Firebase regisztráció hiba:', error.message || error);
        return throwError(() => new Error('Firebase regisztráció sikertelen.'));
      })
    );
  }

  registerToBackend(request: RegistrationRequest): Observable<any> {
    const requestBody = {
      email: request.email,
      felhasznalonev: request.felhasznalonev,
      Jelszo: request.Jelszo,
      firebaseUid: request.firebaseUid,
      szerepkor: request.szerepkor,
      keresztnev: request.keresztnev,
      vezeteknev: request.vezeteknev,
      lakcim: request.lakcim || null,
      munkahely: request.munkahely || null,
      munkaIdo: request.munkaIdo || null,
      bio: request.bio || null,
    };

    console.log('Küldött requestBody a backendnek:', requestBody);
    return this.http.post(`${this.apiUrl}/api/Auth/register`, requestBody);
  }

  getUserLoggedIn(): Observable<any> {
    return this.auth.authState.pipe(
      map((user) => {
        console.log('Bejelentkezési állapot változott:', user);
        return user;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      tap({
        next: (cred) => console.log('Firebase hitelesítés eredménye:', cred),
        error: (err) => console.error('Firebase hitelesítési hiba:', err)
      }),
      switchMap((cred) => {
        const firebaseUid = cred.user?.uid;

        if (!firebaseUid) {
          console.error('Hiányzó Firebase UID');
          return throwError(() => new Error('Hiányzó Firebase UID'));
        }

        console.log('Firebase UID sikeresen lekérve:', firebaseUid);

        return this.http.get<any>(
          `${this.elerhetosegApiUrl}/get-combined-user-data?firebaseUid=${firebaseUid}`
        ).pipe(
          map(response => {
            const userData = this.normalizeUserData(response);

            if (!userData || (!userData.id && !userData.felhasznaloID)) {
              throw new Error('A backend válasz nem tartalmaz felhasználói azonosítót.');
            }

            if (userData.szerepkor === "Szulo" && !userData.szuloId && userData.felhasznaloID) {
              return this.userService.getSzuloIdByFelhasznaloId(userData.felhasznaloID).pipe(
                map(szuloId => {
                  userData.szuloId = szuloId;
                  return userData;
                })
              );
            }
            return of(userData);
          }),
          switchMap(userDataObservable => userDataObservable),
          tap(userData => {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('userRole', userData.szerepkor || 'Vendeg');
            this.currentUserSubject.next(userData);
            this.userLoggedInSubject.next(true);
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error('Adatfeldolgozási hiba: ' + error.message));
          })
        );
      }),
      catchError(error => {
        this.userLoggedInSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  private normalizeUserData(response: any): any {
    if (!response) {
      console.error('A backend válasz üres.');
      return null;
    }

    const id = response.id || response.ID || response.felhasznaloID || response.firebaseUid;

    if (!id) {
      console.error('A backend válasz nem tartalmaz azonosítót:', response);
      return null;
    }

    return {
      id: response.id || response.felhasznaloID || response.firebaseUid,
      email: response.email || '',
      szerepkor: response.szerepkor || 'Vendeg',
      felhasznalonev: response.felhasznalonev || '',
      keresztnev: response.keresztnev || '',
      vezeteknev: response.vezeteknev || '',
      telefonszam: response.telefonszam || '',
      regisztracioIdopontja: response.regisztracioIdopontja || '',
      profilkepUrl: response.profilkepUrl || '',
      utolsoFrissites: response.utolsoFrissites || '',
      firebaseUid: response.firebaseUid || '',
      vedonoID: response.vedonoID || null,
      szuloId: response.szuloId || response.szuloID || response.ID || null,
      bio: response.bio || '',
      munkahely: response.munkahely || ''
    };
  }

  getCurrentUser(): Observable<Felhasznalo | null> {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        let user: Felhasznalo = JSON.parse(storedUser);

        if (!user.szuloID && user.szuloId !== undefined) {
          user.szuloID = user.szuloId;
        }

        if (!user.felhasznaloID && user.id) {
          user.felhasznaloID = user.id;
        }

        if (!user.vedonoID && user.felhasznaloID && user.szerepkor === 'Vedono') {
          user.vedonoID = user.felhasznaloID;
        }

        if (user.felhasznaloID || user.firebaseUid) {
          return of(user);
        } else {
          return of(null);
        }
      }
      return of(null);
    } catch (error) {
      return of(null);
    }
  }

  getUserRole(firebaseUid: string): Observable<{ role: string }> {
    return this.http
      .get<{ role: string }>(`${this.roleApiUrl}/get-user-role?firebaseUid=${firebaseUid}`)
      .pipe(
        map((response) => {
          if (!response.role) {
            throw new Error('A backend válasz nem tartalmaz szerepkört.');
          }
          console.log('Backend válasz:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Hiba a szerepkör lekérdezésekor:', error);
          return throwError(error);
        })
      );
  }

  getCurrentUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  logout(): Promise<void> {
    console.log('Kijelentkezés folyamatban...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.userLoggedInSubject.next(false);
    return this.auth.signOut();
  }
}
