import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdopontfoglalasService {
  private apiUrl = 'http://localhost:5000/api/Idopontfoglalas';

  constructor(private http: HttpClient) {
  }

  foglalas(foglalasData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/foglalas`, foglalasData);
  }

  getFoglalasById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getFoglalasaim(szuloID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/foglalasaim/${szuloID}`);
  }

  getFoglalasokByVedonoId(vedonoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vedono/${vedonoId}`);
  }

  elutasitFoglalas(bookingId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/elutasitas/${bookingId}`, {});
  }

  getTotalBookings(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }

  getWeeklyBookings(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/weekly`);
  }

  getDailyBookings(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/daily`);
  }

  getUniqueParents(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unique-parents`);
  }

  getDailyBookingsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/daily-list`);
  }

  getWeeklyBookingsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/weekly-list`);
  }

  getTotalBookingsByMonth(): Observable<{ month: string; count: number }[]> {
    return this.http.get<{ month: string; count: number }[]>(`${this.apiUrl}/total-bookings-by-month`);
  }
}
