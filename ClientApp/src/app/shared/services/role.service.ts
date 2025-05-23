import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/api/Role';
  private currentRoleSubject = new BehaviorSubject<string | null>(null);
  public currentRole$ = this.currentRoleSubject.asObservable();

  constructor(private auth: AuthService, private http: HttpClient) {
    this.initializeRoleFromLocalStorage();
  }

  private initializeRoleFromLocalStorage(): void {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      this.currentRoleSubject.next(savedRole);
    } else {
      this.currentRoleSubject.next(null);
    }
  }

  clearRole(): void {
    this.currentRoleSubject.next(null);
    localStorage.removeItem('userRole');
  }

  logout(): Promise<void> {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.clearRole();
    return this.auth.logout();
  }
}
