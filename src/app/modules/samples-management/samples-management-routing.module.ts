import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSampleComponent } from './add-sample/add-sample.component';
import { SamplesManagementComponent } from './samples-management.component';

const routes: Routes = [
  {
    path: '',
    component: SamplesManagementComponent,
    children: [
      {
        path: 'add-sample',
        component: AddSampleComponent,
      },
      { path: '', redirectTo: 'add-sample', pathMatch: 'full' },
      { path: '**', redirectTo: 'add-sample', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamplesManagementRoutingModule { }
