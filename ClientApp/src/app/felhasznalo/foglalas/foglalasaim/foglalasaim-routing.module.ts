import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasaimComponent} from './foglalasaim.component';

const routes: Routes = [{path: '', component: FoglalasaimComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasaimRoutingModule {
}
