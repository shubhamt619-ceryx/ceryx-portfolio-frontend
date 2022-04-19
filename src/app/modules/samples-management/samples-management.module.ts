import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

import {  SampleManagement } from './samples-management.component';
import { SampleManagementModule } from './samples-management-routing.module';

@NgModule({
  declarations: [SampleManagement],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    SampleManagementModule
    ,
  ]
})
export class SampleModule { }
