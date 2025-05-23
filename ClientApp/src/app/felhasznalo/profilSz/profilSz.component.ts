import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {Szerepkor} from '../../shared/models/Szerepkor';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-profilSz',
  templateUrl: './profilSz.component.html',
  styleUrls: ['./profilSz.component.css']
})
export class ProfilSzComponent implements OnInit {
  profileForm: FormGroup;
  uploadedImage: string | null = null;
  disableSaveButton = true;
  isUpdating = false;

  roleMap: { [key in Szerepkor]: string } = {
    [Szerepkor.Vedono]: 'Védőnő',
    [Szerepkor.Szulo]: 'Szülő',
    [Szerepkor.Adminisztrator]: 'Adminisztrátor',
    [Szerepkor.Vendeg]: 'Vendég'
  };
  roleKeys: string[] = Object.keys(this.roleMap);
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: [''],
      role: this.fb.control({ value: '', disabled: true })
    });
  }

  ngOnInit(): void {
    this.initializeFromLocalStorage();
  }

  private initializeFromLocalStorage(): void {
    try {
      const storedUserRaw = localStorage.getItem('currentUser');

      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        console.log('LocalStorage adatok:', storedUser);

        if (!storedUser || typeof storedUser !== 'object') {
          console.error('Hibás vagy sérült localStorage adat.');
          this.clearUserSession();
          return;
        }

        const userId = Number(storedUser.id) || Number(storedUser.felhasznaloID);
        console.log('Betöltött felhasználói azonosító:', userId);

        if (!userId || isNaN(userId)) {
          console.error('Hiányzik vagy érvénytelen a felhasználói azonosító a localStorage-ból.');
          this.clearUserSession();
          return;
        }

        this.loadUserData(userId);
      } else {
        console.warn('Nincs mentett felhasználó a LocalStorage-ban. Megpróbáljuk Firebase UID alapján.');
        this.loadUserFromFirebase();
      }
    } catch (error) {
      console.error('Hiba a LocalStorage feldolgozása közben:', error);
      this.clearUserSession();
    }
  }

  private loadUserData(userId: number): void {
    if (!userId || isNaN(userId)) {
      console.error('Hiba: Hiányzik vagy érvénytelen a felhasználói azonosító:', userId);
      return;
    }

    console.log('Felhasználói adatok betöltése az ID alapján:', userId);

    this.userService.loadUserById(userId).subscribe({
      next: (userData) => {
        console.log('Friss adatok a backendből:', userData);
        if (userData && userData.id) {
          this.userService.setUser(userData);
          this.updateFormWithUserData(userData);
        } else {
          console.error('Hiba: A backend válasz nem tartalmaz érvényes azonosítót:', userData);
        }
      },
      error: (err) => {
        console.error('Hiba a felhasználói adatok betöltésekor:', err);
      }
    });
  }

  private updateFormWithUserData(userData: any): void {
    if (!userData || !userData.id) {
      console.error('Hiányzó vagy hibás felhasználói adatok:', userData);
      return;
    }

    const localRole = localStorage.getItem('userRole');
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const szerepkorKulcs = Object.keys(this.roleMap).find(
      key =>
        this.roleMap[key] === userData.szerepkor ||
        key === userData.szerepkor ||
        key === localRole
    ) || 'Vendég';

    this.profileForm.patchValue({
      username: this.userService.currentUser?.felhasznalonev || '',
      firstname: userData.vezeteknev || '',
      lastname: userData.keresztnev || '',
      email: userData.email || '',
      phone: userData.telefonszam || '',
      bio: userData.bio || '',
      role: szerepkorKulcs
    });

    this.uploadedImage = userData.profilkepUrl || 'assets/profil_kep_alap.jpg';
  }



  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = typeof reader.result === 'string' ? reader.result : null;
        this.disableSaveButton = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    const currentUser = this.userService.currentUser;
    if (!currentUser || !currentUser.id) {
      console.error('Nincs érvényes felhasználói azonosító a mentéshez.');
      return;
    }
    console.log(localStorage.getItem('currentUser'));


    const formData = this.profileForm.getRawValue();
    const finalProfilkepUrl = this.uploadedImage || '';

    const finalData = {
      felhasznaloID: currentUser.id,
      id: currentUser.id,
      felhasznalonev: formData.username.trim(),
      keresztnev: formData.lastname.trim(),
      vezeteknev: formData.firstname.trim(),
      email: formData.email.trim(),
      telefonszam: formData.phone.trim(),
      bio: formData.bio.trim(),
      profilkepUrl: finalProfilkepUrl,
      szerepkor: this.roleMap[formData.role] || Szerepkor.Vendeg
    };

    this.isUpdating = true;

    this.userService.updateFelhasznalo(finalData).subscribe({
      next: (updatedUser) => {
        console.log('Sikeresen frissített adatok:', updatedUser);
        this.updateFormWithUserData(updatedUser);
        this.disableSaveButton = true;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Hiba a mentés során:', error);
        this.isUpdating = false;
      }
    });
  }

  private clearUserSession(): void {
    console.warn('Felhasználói munkamenet törlése folyamatban...');
    this.userService.setUser(null);
    localStorage.removeItem('currentUser');
  }

  private loadUserFromFirebase(): void {
    this.authService.getUserLoggedIn().subscribe({
      next: (firebaseUser) => {
        if (firebaseUser?.uid) {
          this.userService.loadUserByFirebaseUid(firebaseUser.uid).subscribe({
            next: (userData) => {
              console.log('Betöltött felhasználói adatok Firebase alapján:', userData);
              this.userService.setUser(userData);
              this.updateFormWithUserData(userData);
            },
            error: (err) => console.error('Hiba a felhasználói adatok betöltésekor:', err)
          });
        }
      },
      error: (err) => console.error('Hiba a bejelentkezett felhasználó lekérésekor:', err)
    });
  }
}
