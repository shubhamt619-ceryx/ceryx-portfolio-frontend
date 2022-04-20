import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import {  SamplesManagementComponent } from './samples-management.component';
import { SamplesManagementRoutingModule } from './samples-management-routing.module';
import {AddSampleComponent} from './add-sample/add-sample.component'
import { NgxDropzoneModule } from 'ngx-dropzone';
import {TreeModule} from 'primeng-lts/tree';
import {ToastModule} from 'primeng-lts/toast';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import { AllSamplesComponent } from './all-samples/all-samples.component';

@NgModule({
  declarations: [
    SamplesManagementComponent,
    AddSampleComponent,
    AllSamplesComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SamplesManagementRoutingModule,
    NgxDropzoneModule,
    TreeModule,
    ToastModule,
    InputTextareaModule
  ]
})
export class SamplesManagementModule { }
