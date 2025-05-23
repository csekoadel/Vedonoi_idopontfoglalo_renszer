import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UjgyermekComponent} from "./ujgyermek.component";

const routes: Routes = [{path: '', component: UjgyermekComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UjgyermekRoutingModule {
}
