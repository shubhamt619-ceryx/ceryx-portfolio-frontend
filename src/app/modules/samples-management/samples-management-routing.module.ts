import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSampleComponent } from './add-sample/add-sample.component';
import { AllSamplesComponent } from './all-samples/all-samples.component';
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
      {
        path: 'edit-sample',
        component: AddSampleComponent,
      },
      {
        path: 'all-samples',
        component: AllSamplesComponent,
      },
      { path: '', redirectTo: 'all-samples', pathMatch: 'full' },
      { path: '**', redirectTo: 'all-samples', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamplesManagementRoutingModule { }
