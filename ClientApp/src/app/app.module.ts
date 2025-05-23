import {Injectable, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MenuComponent} from './shared/menu/menu.component';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {FoglalasElsoModule} from './felhasznalo/foglalas/foglalas-elso/foglalas-elso.module';
import {FoglalasMasodikModule} from './felhasznalo/foglalas/foglalas-masodik/foglalas-masodik.module';
import {FoglalasNegyedikModule} from './felhasznalo/foglalas/foglalas-negyedik/foglalas-negyedik.module';
import {FoglalasaimModule} from './felhasznalo/foglalas/foglalasaim/foglalasaim.module';
import {ProfilSzModule} from './felhasznalo/profilSz/profilSz.module';
import {ProfilModule} from './vedono/profil/profil.module';
import {DashboardModule} from './vedono/dashboard/dashboard.module';
import {FoglalasokListajaModule} from './vedono/foglalasok-listaja/foglalasok-listaja.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {NaptarKezeloModule} from './vedono/naptar-kezelo/naptar-kezelo.module';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {IdopontModule} from './vedono/Idopont/Idopont.module';
import {UserService} from './shared/services/user.service';
import {registerLocaleData} from '@angular/common';
import localeHu from '@angular/common/locales/hu';

registerLocaleData(localeHu);

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  constructor(matDateLocale: string) {
    super(matDateLocale);
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [
      'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
      'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}

const HUNGARIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY.MM.DD.',
  },
  display: {
    dateInput: 'YYYY.MM.DD.',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'YYYY.MM.DD.',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatListModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MenuComponent,
    FoglalasElsoModule,
    FoglalasMasodikModule,
    FoglalasNegyedikModule,
    FoglalasaimModule,
    ProfilModule,
    ProfilSzModule,
    DashboardModule,
    FoglalasokListajaModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ProfilSzModule,
    NaptarKezeloModule,
    NgxMaterialTimepickerModule,
    AngularFireAuthModule,
    IdopontModule,
    FoglalasokListajaModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    UserService,
    {provide: LOCALE_ID, useValue: 'hu'},
    {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'},
    {provide: MAT_DATE_FORMATS, useValue: HUNGARIAN_DATE_FORMATS},
    {provide: NativeDateAdapter, useClass: CustomDateAdapter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
