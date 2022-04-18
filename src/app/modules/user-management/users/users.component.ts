import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng-lts/table';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements
  OnInit,
  OnDestroy {
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  productDialog: boolean;

  users: UserModel[];

  user: UserModel;

  selectedUser: UserModel[];

  loading: boolean = true;
  submitted: boolean;
  confirmationService: any;
  messageService: any;
  product: any;
  products: any;
  constructor(
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    let usersSub = this.commonService.getRows('user/list-user').subscribe(res => {
      this.users = res.items;
      this.loading = false;
      this.cd.detectChanges();
    });
    this.subscriptions.push(usersSub);  
  }

  openNew() {
    let newUser = new UserModel();
    newUser.clearUser();//Clear
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedUser() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
       accept: () => {
    this.users = this.users.filter(val => val._id !== this.user._id);
    this.user.clearUser();
    this.messageService.add({severity:'success', summary: 'Successful', detail: 'user Deleted', life: 3000});
}
    });
  }

  editUser(user:UserModel) {
    this.user.setUser(user);
    // this.productDialog = true;
    const modalRef = this.modalService.open(EditUserModalComponent);
    modalRef.componentInstance.id = 0;
    modalRef.result.then(() =>
      this.loadUsers()
    );
  }
  deleteuser(user: UserModel) {
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.id = 0;
    modalRef.result.then(() => this.commonService.fetch(), () => { });
  }

  // hideDialog() {
  //   this.productDialog = false;
  //   this.submitted = false;
  // }

  saveProduct() {
    this.submitted = true;

    if (this.user.name.trim()) {
      if (this.user._id) {
        this.users[this.findIndexById(this.user._id)] = this.user
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user Updated', life: 3000 });
      }
      else {
        this.user._id = this.createId();
        this.users.push(this.user);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user Created', life: 3000 });
      }

      this.users = [...this.products];
      this.productDialog = false;
      this.user.setUser(this.user);
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.user[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  clear(table: Table) {
    table.clear();
  }newusers
  createNewUser(){
      console.log("New user Clicked")
  }
  viewUser(){
      console.log("viewUser Clicked")
  }
  editUserInfo(){
    let newUser = new UserModel()
    newUser.clearUser();
    this.editUser(newUser);
  }
  deleteUserButton(){
    let newUser = new UserModel()
    newUser.clearUser();
    this.deleteuser(newUser);
}
  }
