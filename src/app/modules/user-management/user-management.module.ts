import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { DeleteUserModalComponent } from './users/components/delete-user-modal/delete-user-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent } from './users/components/edit-user-modal/edit-user-modal.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { UpdateUserStatusModalComponent } from './users/components/update-user-status-modal/update-user-status-modal.component';
import { TableModule } from 'primeng-lts/table';
import { ButtonModule } from 'primeng-lts/button';

@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    UserManagementComponent,
    DeleteUserModalComponent,
    EditUserModalComponent,
    UpdateUserStatusModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CRUDTableModule,
    NgbDatepickerModule,
    InlineSVGModule,
    UserManagementRoutingModule,
    TableModule,
    ButtonModule,
  ],
  entryComponents: [
    UsersComponent,
    RolesComponent,
    UserManagementComponent,
    DeleteUserModalComponent,
    EditUserModalComponent,
    UpdateUserStatusModalComponent,
  ]
})
export class UserManagementModule {}
