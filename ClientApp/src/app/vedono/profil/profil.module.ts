import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfilRoutingModule} from './profil-routing.module';
import {ProfilComponent} from './profil.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";


@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput
  ]
})
export class ProfilModule {
}
