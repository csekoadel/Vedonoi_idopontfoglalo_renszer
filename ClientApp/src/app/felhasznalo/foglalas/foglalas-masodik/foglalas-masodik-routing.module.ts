import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasMasodikComponent} from './foglalas-masodik.component';

const routes: Routes = [{path: '', component: FoglalasMasodikComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasMasodikRoutingModule {
}
