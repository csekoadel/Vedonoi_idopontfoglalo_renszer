import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoglalasHarmadikComponent} from './foglalas-harmadik.component';

const routes: Routes = [{path: '', component: FoglalasHarmadikComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalasHarmadikRoutingModule {
}
