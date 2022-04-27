import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CeryxIconComponent } from './ceryx-icon-component/ceryx-icon.component';

@NgModule({
  declarations: [
    CeryxIconComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CeryxIconComponent
  ],
})
export class CeryxSharedModule { }
