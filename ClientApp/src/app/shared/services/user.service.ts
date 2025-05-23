import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, throwError} from 'rxjs';
import {Felhasznalo} from '../models/Felhasznalo';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/Felhasznalo';
  private userSubject = new BehaviorSubject<Felhasznalo | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUserFromLocalStorage();
  }

  loadUserById(userId: number): Observable<Felhasznalo> {
    return this.http.get<Felhasznalo>(`${this.apiUrl}/${userId}`).pipe(
      map((userData) => {
        if (!userData || !userData.id) {
          throw new Error('Hibás vagy hiányzó adatok a backend válaszban.');
        }
        return userData;
      }),
      catchError((error) => {
        console.error('Hiba a felhasználói adatok betöltésekor:', error);
        return throwError(error);
      })
    );
  }

  updateFelhasznalo(userData: Felhasznalo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userData.felhasznaloID || userData.id}`, userData).pipe(
      catchError((error) => {
        console.error('Hiba a felhasználói adatok frissítésekor:', error);
        return throwError(error);
      })
    );
  }

  public loadUserFromLocalStorage(): void {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      try {
        const parsedUser: Felhasznalo = JSON.parse(savedUser);
        parsedUser.szuloId = parsedUser.szuloId ?? parsedUser.szuloID ?? null;

        if (!parsedUser.szuloId) {
          console.warn('Nincs szülői azonosító a LocalStorage adataiban!', parsedUser);
          this.getSzuloIdByFelhasznaloId(parsedUser.felhasznaloID).subscribe(szuloId => {
            if (szuloId) {
              parsedUser.szuloId = szuloId;
              this.setUser(parsedUser);
            }
          });
        } else {
          this.setUser(parsedUser);
        }
      } catch (error) {
        this.clearUserSession();
      }
    } else {
      this.clearUserSession();
    }
  }

  getSzuloIdByFelhasznaloId(felhasznaloId: number): Observable<number | null> {
    return this.http.get<{ szuloId: number }>(
      `http://localhost:5000/api/Gyermek/get-szulo-id-by-felhasznalo-id?felhasznaloId=${felhasznaloId}`
    ).pipe(
      map(response => response.szuloId || null),
      catchError(error => {
        return of(null);
      })
    );
  }

  setUser(user: Felhasznalo | null): void {
    this.userSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  get currentUser(): Felhasznalo | null {
    return this.userSubject.value;
  }

  loadUserByFirebaseUid(firebaseUid: string): Observable<Felhasznalo> {
    return this.http
      .get<Felhasznalo>(`${this.apiUrl}/get-user-by-firebase-uid?firebaseUid=${firebaseUid}`)
      .pipe(
        map((userData) => {
          if (!userData || !userData.id) {
            throw new Error('Hibás vagy hiányzó adatok a backend válaszban.');
          }
          return userData;
        }),
        catchError((error) => {
          console.error('Hiba a felhasználói adatok betöltésekor:', error);
          return throwError(error);
        })
      );
  }

  clearUserSession(): void {
    console.log('Felhasználói munkamenet törlése...');
    this.userSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
