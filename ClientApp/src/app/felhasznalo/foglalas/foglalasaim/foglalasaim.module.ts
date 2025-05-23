import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FoglalasaimRoutingModule} from './foglalasaim-routing.module';
import {FoglalasaimComponent} from './foglalasaim.component';
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";


@NgModule({
  declarations: [
    FoglalasaimComponent
  ],
  imports: [
    CommonModule,
    FoglalasaimRoutingModule,
    MatIcon,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatCellDef,
    MatRowDef,
    MatHeaderCellDef
  ]
})
export class FoglalasaimModule {
}
