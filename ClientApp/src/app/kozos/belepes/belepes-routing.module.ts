import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BelepesComponent} from './belepes.component';

const routes: Routes = [{path: '', component: BelepesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BelepesRoutingModule {
}
