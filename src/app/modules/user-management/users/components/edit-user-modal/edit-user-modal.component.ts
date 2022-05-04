import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { JsonResponseModel } from 'src/app/_ceryx/models/json-response.model';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { MessageService } from 'primeng-lts/api';
const EMPTY_USER: UserModel = new UserModel();

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: MessageService }
  ]
})
export class EditUserModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() user: UserModel;

  isLoading$;
  formGroup: FormGroup;
  isNewUser = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private commonService: CommonService,
    private messageService: MessageService,
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  ngAfterViewInit(): void {
  }



  loadUser() {
    this.isLoading$ = true;
    if (this.user._id == '') {
      this.user = new UserModel();
      this.user.clearUser();
      this.isLoading$ = false;
      this.isNewUser = true;
      this.loadForm();
    } else {
      const dataToPost = { email: this.user.email };
      const sb = this.commonService.fetchRow('user/userdetails', dataToPost).subscribe((user: UserModel) => {
        this.user = user;
        console.log(this.user, 'this.user');
        this.isNewUser = false;
        this.loadForm();
        this.isLoading$ = false;
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.user.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      password: [this.user.password, Validators.compose([Validators.required])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      mobileNumber: [this.user.mobileNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      role: ['0', Validators.compose([Validators.required])],
    });
  }

  save() {
    this.prepareUser();
    if (this.isNewUser) {
      this.create();
    } else {
      this.edit();
    }
  }

  close(){
    this.modal.close();
  }

  edit() {
    const sb = this.commonService.patchRow('user/profile', this.user).subscribe((res: JsonResponseModel) => {
      this.user = res.data;
      this.messageService.add({severity:'success', summary: 'Success', detail: 'User updated successfully'});
    });
    this.subscriptions.push(sb);
  }

  create() {
    const userWithoutId = this.user;
    delete userWithoutId._id;
    const sb = this.commonService.fetchRow('user/register', this.user).subscribe((res: JsonResponseModel) => {
      this.user = res.data;  
      this.messageService.add({severity:'success', summary: 'Success', detail: 'User created successfully'});
      this.modal.close();
    });
    this.subscriptions.push(sb);
  }

  private prepareUser() { 
    const formData = this.formGroup.value;
    this.user.createdBy = '624ae77e2001216640db5fb9';
    this.user.email = formData.email;
    this.user.name = formData.name;
    this.user.role = formData.role;
    this.user.mobileNumber = formData.mobileNumber;
    this.user.password = formData.password;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
