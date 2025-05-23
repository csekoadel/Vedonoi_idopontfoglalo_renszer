import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FooldalComponent} from "./fooldal.component";

const routes: Routes = [{path: '', component: FooldalComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooldalRoutingModule {
}
