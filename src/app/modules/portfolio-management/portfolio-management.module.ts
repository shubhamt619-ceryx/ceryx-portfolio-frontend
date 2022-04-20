import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { PortfolioManagementComponent } from './portfolio-management.component';
import {PortfolioManagementRoutingModule } from './portfolio-management-routing.module';
import {AddPortfolioComponent} from './add-portfolio/add-portfolio.component'
import { NgxDropzoneModule } from 'ngx-dropzone';
import {TreeModule} from 'primeng-lts/tree';
import {ToastModule} from 'primeng-lts/toast';
import { PortfolioCategoriesComponent } from './add-portfolio/portfolio-categories/portfolio-categories.component';
import { PortfolioCategoryCardComponent } from './add-portfolio/portfolio-categories/portfolio-category-card/portfolio-category-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  declarations: [
    PortfolioManagementComponent,
    AddPortfolioComponent,
    PortfolioCategoriesComponent,
    PortfolioCategoryCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    PortfolioManagementRoutingModule,
    NgxDropzoneModule,
    TreeModule,
    ToastModule,
    MatCardModule,
    MatGridListModule,
  ]
})
export class PortfolioManagementModule { }
