import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { Table } from 'primeng-lts/table';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { FetchUserModalComponent } from './components/fetch-user-modal/fetch-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService],
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
  product: any;
  products: any;
  searchText = "";
  constructor(
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
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

  createUser() {
    let newUser = new UserModel();
    newUser.clearUser();//Clear
    this.editUser(newUser);
  }

  editUser(user:UserModel) {
    this.user = user;
    const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => { console.log(result, 'result'); }, () => { this.loadUsers() }).catch(err => {});
  }

  deleteUser(user: UserModel) {
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance._id = user._id;
    modalRef.result.then((result) => {

      this.loadUsers()
     }, () => {}).catch(err => { 
      console.log(123);
     });
  }
  saveUser() {
    this.submitted = true;

    if (this.user.name.trim()) {
      if (this.user._id) {
        this.users[this.findIndexById(this.user._id)] = this.user
        this.messageService.clear()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User updated', life: 3000 });
      }
      else {
        this.user._id = this.createId();
        this.users.push(this.user);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User created successfully', life: 3000 });
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
    this.searchText = "";
    table.clear();
  }
  viewUser(user: UserModel){
    const modalRef = this.modalService.open(FetchUserModalComponent);
    modalRef.componentInstance.email = user.email;
    modalRef.result.then((result) => { console.log(result, 'result'); }, () => {}).catch(err => {});
  }
  }
