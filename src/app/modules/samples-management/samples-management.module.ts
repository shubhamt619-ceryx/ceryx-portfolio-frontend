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
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {CardModule} from 'primeng-lts/card';
import { MatListModule } from '@angular/material/list';
import { ButtonModule } from 'primeng-lts/button';
import { DeleteSampleModalComponent } from './delete-sample-modal/delete-sample-modal.component';
import { MessagesModule } from 'primeng-lts/messages';
import { MessageModule } from 'primeng-lts/message';
import {ChipsModule} from 'primeng-lts/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CeryxSharedModule } from 'src/app/_ceryx/ceryx-shared/ceryx-shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  declarations: [
    SamplesManagementComponent,
    AddSampleComponent,
    AllSamplesComponent,
    DeleteSampleModalComponent,
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
    InputTextareaModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    CardModule,
    MatListModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ChipsModule,
    MatCheckboxModule,
    MatTabsModule,
    CeryxSharedModule,
    MatProgressSpinnerModule,
    NgSelectModule,
  ]
})
export class SamplesManagementModule { }
