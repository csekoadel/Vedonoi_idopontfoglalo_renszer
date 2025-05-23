import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {BaseChartDirective} from "ng2-charts";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardTitle,
    MatCard,
    MatCardContent,
    BaseChartDirective,
  ]
})
export class DashboardModule {
}
