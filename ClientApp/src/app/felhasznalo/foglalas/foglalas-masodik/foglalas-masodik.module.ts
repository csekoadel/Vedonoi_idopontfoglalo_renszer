import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasMasodikRoutingModule} from './foglalas-masodik-routing.module';
import {FoglalasMasodikComponent} from './foglalas-masodik.component';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatCalendar} from "@angular/material/datepicker";
import {MatButton} from "@angular/material/button";


@NgModule({
  declarations: [
    FoglalasMasodikComponent
  ],
  imports: [
    CommonModule,
    FoglalasMasodikRoutingModule,
    MatCard,
    MatCardTitle,
    MatCalendar,
    MatButton,
    MatCardActions,
    MatCardContent
  ]
})
export class FoglalasMasodikModule {
}
