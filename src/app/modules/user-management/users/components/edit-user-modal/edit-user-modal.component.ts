import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

const EMPTY_USER: User = {
  firstName: '',
  lastName: '',
  dateOfBbirth: '',
  userName: '',
  gender: '',
  ipAddress: '',
  type: '',
  dob: new Date(),
  isDeleted: false,
  _id: 0,
  createdBy: '',
  role: '',
  email: '',
  name: '',
  password: '',
  createdOn: '',
  __v: 0,
  lastLogin: '',
  mobileNumber: 0,
  id: undefined
};

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserModalComponent implements OnInit, OnDestroy {
  @Input() _id: number;
  isLoading$;
  user: User;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    if (!this._id) {
      this.user = EMPTY_USER;
      this.loadForm();
    } else {
      const sb = this.usersService.getItemById(this._id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((user: User) => {
        this.user = user;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      firstName: [this.user.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.user.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      dob: [this.user.dateOfBbirth, Validators.compose([Validators.nullValidator])],
      userName: [this.user.userName, Validators.compose([Validators.required])],
      gender: [this.user.gender, Validators.compose([Validators.required])],
      ipAddress: [this.user.ipAddress],
      type: [this.user.type, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareUser();
    if (this.user.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.user).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe(res => this.user = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.create(this.user).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe((res: User) => this.user = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.dob = new Date(formData.dob);
    this.user.email = formData.email;
    this.user.firstName = formData.firstName;
    this.user.dateOfBbirth = formData.dob;
    this.user.ipAddress = formData.ipAddress;
    this.user.lastName = formData.lastName;
    this.user.type = +formData.type;
    this.user.userName = formData.userName;
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
