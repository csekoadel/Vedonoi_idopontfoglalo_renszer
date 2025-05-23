import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasokListajaComponent} from './foglalasok-listaja.component';

const routes: Routes = [{path: '', component: FoglalasokListajaComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasokListajaRoutingModule {
}
