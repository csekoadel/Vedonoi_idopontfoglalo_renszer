import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasokListajaRoutingModule} from './foglalasok-listaja-routing.module';
import {FoglalasokListajaComponent} from './foglalasok-listaja.component';


@NgModule({
  declarations: [
    FoglalasokListajaComponent
  ],
  imports: [
    CommonModule,
    FoglalasokListajaRoutingModule
  ]
})
export class FoglalasokListajaModule {
}
