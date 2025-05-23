import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasElsoComponent} from './foglalas-elso.component';

const routes: Routes = [{path: '', component: FoglalasElsoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasElsoRoutingModule {
}
