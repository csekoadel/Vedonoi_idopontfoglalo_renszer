import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasNegyedikComponent} from './foglalas-negyedik.component';

const routes: Routes = [
  {path: '', component: FoglalasNegyedikComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoglalasNegyedikRoutingModule {
}
