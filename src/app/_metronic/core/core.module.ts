import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [FirstLetterPipe, SafePipe],
  imports: [CommonModule, NgxPermissionsModule.forChild()],
  exports: [FirstLetterPipe, SafePipe],
})
export class CoreModule { }
