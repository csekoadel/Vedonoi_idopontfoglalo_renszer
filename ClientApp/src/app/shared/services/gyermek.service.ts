import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Gyermek} from '../models/Gyermek';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class GyermekService {
  private apiUrl = 'http://localhost:5000/api/Gyermek';

  constructor(private http: HttpClient) {
  }

  addGyermek(gyermek: Gyermek): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, gyermek);
  }

  getSzuloIdByFelhasznaloId(felhasznaloId: number): Observable<{ szuloId: number }> {
    return this.http
      .get<{ szuloId: number }>(`${this.apiUrl}/get-szulo-id-by-felhasznalo-id?felhasznaloId=${felhasznaloId}`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getGyermekekBySzuloId(szuloId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-by-parent-id?szuloId=${szuloId}`).pipe(
      catchError(error => {
        console.error('Hiba a gyermekek lekérésekor:', error);
        return throwError(error);
      })
    );
  }
}
