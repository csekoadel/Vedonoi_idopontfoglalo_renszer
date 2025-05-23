import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasOtodikRoutingModule} from './foglalas-otodik-routing.module';
import {FoglalasOtodikComponent} from './foglalas-otodik.component';


@NgModule({
  declarations: [
    FoglalasOtodikComponent
  ],
  imports: [
    CommonModule,
    FoglalasOtodikRoutingModule
  ]
})
export class FoglalasOtodikModule {
}
