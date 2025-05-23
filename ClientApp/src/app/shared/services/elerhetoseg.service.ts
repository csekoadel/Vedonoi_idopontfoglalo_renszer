import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ElerhetosegService {
  private apiUrl = 'http://localhost:5000/api/Elerhetoseg';
  private combinedUserDataUrl = 'http://localhost:5000/api/Elerhetoseg/get-combined-user-data';

  constructor(private http: HttpClient) {
  }

  getAppointments(vedonoID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAppointments?vedonoID=${vedonoID.toString()}`)
      .pipe(
        map(appointments => {
          console.log('Betöltött időpontok:', appointments);
          return appointments;
        }),
        catchError(err => {
          console.error('Hiba történt az időpontok lekérésekor:', err);
          return [];
        })
      );
  }

  addElerhetoseg(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  deleteElerhetoseg(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteElerhetoseg/${id}`);
  }

  getCombinedUserData(firebaseUid: string): Observable<any> {
    return this.http.get<any>(`${this.combinedUserDataUrl}?firebaseUid=${firebaseUid}`);
  }

  getAppointmentsByService(vedonoId: number, szolgaltatasID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAppointmentsByService?vedonoID=${vedonoId}&szolgaltatasID=${szolgaltatasID}`)
      .pipe(
        map(appointments => appointments),
        catchError(err => {
          console.error('Hiba történt az időpontok lekérésekor:', err);
          return [];
        })
      );
  }

}
