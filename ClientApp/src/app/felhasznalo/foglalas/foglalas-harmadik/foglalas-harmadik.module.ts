import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasHarmadikRoutingModule} from './foglalas-harmadik-routing.module';
import {FoglalasHarmadikComponent} from './foglalas-harmadik.component';
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    FoglalasHarmadikComponent
  ],
  imports: [
    CommonModule,
    FoglalasHarmadikRoutingModule,
    MatButtonModule
  ]
})
export class FoglalasHarmadikModule {
}
