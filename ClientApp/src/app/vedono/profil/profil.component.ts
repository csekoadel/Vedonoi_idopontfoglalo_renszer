import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {Szerepkor} from '../../shared/models/Szerepkor';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profileForm: FormGroup;
  uploadedImage: string | null = null;
  disableSaveButton = true;
  isUpdating = false;

  roleMap: { [key: string]: Szerepkor } = {
    "Védőnő": Szerepkor.Vedono,
    "Szülő": Szerepkor.Szulo,
    "Adminisztrátor": Szerepkor.Adminisztrator,
    "Vendég": Szerepkor.Vendeg
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
      role: [{value: '', disabled: true}],
      munkahely: ['']
    });
  }

  ngOnInit(): void {
    this.initializeFromLocalStorage();
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

  private initializeFromLocalStorage(): void {
    try {
      const storedUserRaw = localStorage.getItem('currentUser');

      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);

        if (!storedUser || typeof storedUser !== 'object') {
          this.clearUserSession();
          return;
        }

        const userId = Number(storedUser.id) || Number(storedUser.felhasznaloID);

        if (!userId || isNaN(userId)) {
          this.clearUserSession();
          return;
        }

        this.loadUserData(userId);
      } else {
        this.loadUserFromFirebase();
      }
    } catch (error) {
      this.clearUserSession();
    }
  }

  private loadUserData(userId: number): void {
    if (!userId || isNaN(userId)) {
      return;
    }


    this.userService.loadUserById(userId).subscribe({
      next: (userData) => {
        if (userData && userData.id) {
          this.userService.setUser(userData);
          this.updateFormWithUserData(userData);
        } else {
        }
      },
      error: (err) => {
      }
    });
  }

  private updateFormWithUserData(userData: any): void {
    if (!userData || !userData.id) {
      return;
    }


    let vedonoData = userData.vedonoAdatok;

    if (!vedonoData) {
      vedonoData = {bio: 'Nincs megadva', munkahely: 'Nincs megadva'};
    }


    this.profileForm.patchValue({
      username: userData.felhasznalonev || '',
      firstname: userData.vezeteknev || '',
      lastname: userData.keresztnev || '',
      email: userData.email || '',
      phone: userData.telefonszam || '',
      role: Object.keys(this.roleMap).find(key => this.roleMap[key] === userData.szerepkor) || 'Vendég',
      bio: vedonoData.bio,
      munkahely: vedonoData.munkahely
    });

    this.uploadedImage = userData.profilkepUrl || 'assets/profil_kep_alap.jpg';

  }


  private loadUserFromFirebase(): void {
    this.authService.getUserLoggedIn().subscribe({
      next: (firebaseUser) => {
        if (firebaseUser?.uid) {
          this.userService.loadUserByFirebaseUid(firebaseUser.uid).subscribe({
            next: (userData) => {
              this.userService.setUser(userData);
              this.updateFormWithUserData(userData);
            },
          });
        }
      },
    });
  }

  onSave(): void {
    const currentUser = this.userService.currentUser;
    if (!currentUser || !currentUser.id) {
      return;
    }

    const formData = this.profileForm.getRawValue();
    const finalData: any = {
      felhasznaloID: currentUser.id,
      id: currentUser.id,
      felhasznalonev: formData.username.trim(),
      keresztnev: formData.lastname.trim(),
      vezeteknev: formData.firstname.trim(),
      email: formData.email.trim(),
      telefonszam: formData.phone.trim(),
      bio: formData.bio?.trim() || '',
      munkahely: formData.munkahely?.trim() || '',
      profilkepUrl: this.uploadedImage || '',
      szerepkor: this.roleMap[formData.role] || Szerepkor.Vendeg,
      firebaseUid: currentUser.firebaseUid,
      vedonoID: currentUser.vedonoID || null
    };


    if (finalData.szerepkor !== "Szülő") {
      delete finalData.szuloId;
    }


    this.isUpdating = true;

    this.userService.updateFelhasznalo(finalData).subscribe({
      next: (updatedUser) => {
        this.updateFormWithUserData(updatedUser);
        this.disableSaveButton = true;
        this.isUpdating = false;
      },
      error: (error) => {
        this.isUpdating = false;
      }
    });
  }

  private clearUserSession(): void {
    this.userService.setUser(null);
    localStorage.removeItem('currentUser');
  }
}
