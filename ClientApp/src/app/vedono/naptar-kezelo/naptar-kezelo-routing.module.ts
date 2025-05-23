import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NaptarKezeloComponent} from "./naptar-kezelo.component";

const routes: Routes = [{path: '', component: NaptarKezeloComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaptarKezeloRoutingModule {
}
