import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisztracioComponent} from './regisztracio.component';

const routes: Routes = [{path: '', component: RegisztracioComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisztracioRoutingModule {
}
