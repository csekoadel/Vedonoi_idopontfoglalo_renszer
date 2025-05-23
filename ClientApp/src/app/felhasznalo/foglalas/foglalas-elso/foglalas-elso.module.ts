import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasElsoRoutingModule} from './foglalas-elso-routing.module';
import {FoglalasElsoComponent} from './foglalas-elso.component';
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {FlexModule} from "@angular/flex-layout";
import {MatButton} from "@angular/material/button";


@NgModule({
  declarations: [
    FoglalasElsoComponent
  ],
  imports: [
    CommonModule,
    FoglalasElsoRoutingModule,
    MatOption,
    MatSelect,
    MatFormField,
    MatLabel,
    FlexModule,
    MatButton
  ]
})
export class FoglalasElsoModule {
}
