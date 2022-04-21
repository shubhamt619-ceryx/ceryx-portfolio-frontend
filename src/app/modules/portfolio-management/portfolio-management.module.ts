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
import { MatGridListModule } from '@angular/material/grid-list';
import { MessageModule } from 'primeng-lts/message';
import { MessagesModule } from 'primeng-lts/messages';
import { DeletePortfolioModalComponent } from './delete-portfolio-modal/delete-portfolio-modal.component';
import { AllPortfoliosComponent } from './all-portfolios/all-portfolios.component';
@NgModule({
  declarations: [
    PortfolioManagementComponent,
    AddPortfolioComponent,
    PortfolioCategoriesComponent,
    PortfolioCategoryCardComponent,
    DeletePortfolioModalComponent,
    AllPortfoliosComponent,
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
    MatGridListModule,
    MessagesModule,
    MessageModule,
  ]
})
export class PortfolioManagementModule { }
