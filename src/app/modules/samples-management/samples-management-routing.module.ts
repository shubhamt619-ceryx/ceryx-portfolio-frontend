import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSample } from './add-sample/add-sample.component';
import { SampleManagement } from './samples-management.component';

const routes: Routes = [
  {
    path: '',
    component: SampleManagement,
    children: [
      {
        path: 'AddSample',
        component: AddSample,
      },
      { path: '', redirectTo: 'AddSample', pathMatch: 'full' },
      { path: '**', redirectTo: 'AddSample', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleManagementModule { }
