import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BelepesRoutingModule} from './belepes-routing.module';
import {BelepesComponent} from './belepes.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    BelepesComponent
  ],
  imports: [
    CommonModule,
    BelepesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class BelepesModule {
}
