import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IdopontComponent} from './Idopont.component';

const routes: Routes = [
  {path: '', component: IdopontComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdopontRoutingModule {
}
