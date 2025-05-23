import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RoleService} from '../services/role.service';
import {UserService} from '../services/user.service';
import {Felhasznalo} from '../models/Felhasznalo';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, UrlTree} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  @Input() currentPage = '';
  @Output() selectedPage = new EventEmitter<string>();
  @Output() onCloseSidenav = new EventEmitter<boolean>();
  @Output() onLogout = new EventEmitter<boolean>();

  @Input() loggedInUser = false;
  @Input() currentRole: string | null = null;
  currentUser: Partial<Felhasznalo> = {};
  userRole: string | null = null;

  private destroy$ = new Subject<void>();
  vedonoId: any[] | string | UrlTree;

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('🔄 Menü: felhasználó változás:', user);
        this.currentUser = user;
        this.loggedInUser = !!user;
        this.currentRole = user?.szerepkor || null;
        this.cdRef.detectChanges(); // 📌 UI frissítés!
      });

    this.roleService.currentRole$
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        console.log('🔄 Menü: szerepkör változás:', role);
        this.currentRole = role;
        this.cdRef.detectChanges(); // 📌 UI frissítés!
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.roleService.logout().then(() => {
      this.onLogout.emit(true);
      this.close(true);
    });
  }

  close(logout?: boolean): void {
    this.onCloseSidenav.emit(true);
    if (logout) {
      this.onLogout.emit(logout);
    }
  }
}



