import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from '../../services/users.service';

const EMPTY_USER: UserModel = new UserModel();

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
  user: UserModel;
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
      ).subscribe((user:UserModel ) => {
        this.user = user;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.user.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      password: [this.user.password, Validators.compose([Validators.required])],
      username: [this.user.username, Validators.compose([Validators.required])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      mobileNumber: [this.user.mobileNumber, Validators.compose([Validators.required])],
      role: ["0", Validators.compose([Validators.required])],
    });
  }

  save() {
    this.prepareUser();
    if (this.user._id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    // const sbUpdate = this.usersService.update(this.user).pipe(
    //   tap(() => {
    //     this.modal.close();
    //   }),
    //   catchError((errorMessage) => {
    //     this.modal.dismiss(errorMessage);
    //     return of(this.user);
    //   }),
    // ).subscribe(res => this.user = res);
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    // const sbCreate = this.usersService.create(this.user).pipe(
    //   tap(() => {
    //     this.modal.close();
    //   }),
    //   catchError((errorMessage) => {
    //     this.modal.dismiss(errorMessage);
    //     return of(this.user);
    //   }),
    // ).subscribe((res: UserModel) => this.user = res);
    // this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.email = formData.email;
    this.user.name = formData.name;
    this.user.role = formData.role;
    this.user.mobileNumber = formData.mobileNumber;
    this.user.username = formData.username;
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
