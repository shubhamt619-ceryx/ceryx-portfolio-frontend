import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPortfolioComponent } from './add-portfolio/add-portfolio.component';
import { AllPortfoliosComponent } from './all-portfolios/all-portfolios.component';
import { PortfolioManagementComponent } from './portfolio-management.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioManagementComponent,
    children: [
      {
        path: 'add-portfolio',
        component: AddPortfolioComponent,
      },
      {
        path: 'all-portfolio',
        component: AllPortfoliosComponent,
      },
      { path: '', redirectTo: 'all-portfolio', pathMatch: 'full' },
      { path: '**', redirectTo: 'all-portfolio', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioManagementRoutingModule { }
