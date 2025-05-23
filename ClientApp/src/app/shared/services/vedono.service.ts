import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VedonoService {
  private apiUrl = 'http://localhost:5000/api/Vedono';

  private apiUrll = 'http://localhost:5000/api/Elerhetoseg';

  constructor(private http: HttpClient) {
  }

  getVedonok(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-vedonok`);
  }

  getElerhetosegekByVedonoId(vedonoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-vedono-naptar/${vedonoId}`);
  }

  getElerhetosegekByVedonoIdAndDateRange(vedonoId: number, startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('vedonoId', vedonoId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);

    console.log('Request params:', {
      vedonoId,
      startDate,
      endDate
    });

    return this.http.get<any[]>(`${this.apiUrl}/filter`, {params})
      .pipe(
        map(appointments => {
          console.log('Backend válasz:', appointments);
          return appointments;
        }),
        catchError(err => {
          console.error('Hiba történt az időpontok lekérésekor:', err);
          console.error('Hibaüzenet:', err.error?.message || err.message);
          return of([]);
        })
      );
  }

  getVedonoDetails(vedonoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vedono-details/${vedonoId}`);
  }

}

