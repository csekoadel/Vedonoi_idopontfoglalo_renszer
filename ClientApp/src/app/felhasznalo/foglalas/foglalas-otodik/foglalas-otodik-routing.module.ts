import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasOtodikComponent} from './foglalas-otodik.component';

const routes: Routes = [
  {path: '', component: FoglalasOtodikComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasOtodikRoutingModule {
}
