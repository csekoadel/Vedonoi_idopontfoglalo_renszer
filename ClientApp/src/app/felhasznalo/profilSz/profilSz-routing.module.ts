import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfilSzComponent} from './profilSz.component';

const routes: Routes = [{path: '', component: ProfilSzComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilSzRoutingModule {
}
