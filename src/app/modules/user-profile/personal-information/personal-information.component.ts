import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { JsonResponseModel } from 'src/app/_ceryx/models/json-response.model';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { AuthService } from 'src/app/_ceryx/services/auth.service';
import { CommonService } from 'src/app/_ceryx/services/common.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
  providers: [MessageService],
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  avatarPic = 'none';
  isLoading: boolean;

  constructor(private userService: AuthService, private fb: FormBuilder,
    private commonService: CommonService,private messageService: MessageService,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    this.loadCurrentUserInfo()
  }

  loadCurrentUserInfo() {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  prepareUser() {
    const formData = this.formGroup.value;
    //this.user.email = formData.email;
    this.user.name = formData.name;
    this.user.mobileNumber = formData.mobileNumber;
    this.user.profile_pic = formData.profile_pic;
  }

  loadForm() {
    this.formGroup = this.fb.group({
      profile_pic: [this.user.profile_pic],
      name: [this.user.name, Validators.required],
      mobileNumber: [this.user.mobileNumber, Validators.required],
      email: [{value:this.user.email, disabled: true}, Validators.compose([Validators.required, Validators.email])],
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.user = Object.assign(this.user, formValues);

    // Do request to your server for user update, we just imitate user update there
    this.userService.isLoadingSubject.next(true);
    const sb = this.commonService.patchRow("user/profile", this.user).subscribe((res: JsonResponseModel) => {
      
      let uSub = this.userService.getUserByToken().subscribe(user => {
        this.user = user;
        //this.router.navigate(['user-profile/']);
        location.reload()
      })
      this.subscriptions.push(uSub);  
      //user updated successfully
      this.messageService.clear()
      this.messageService.add({severity:'success', summary:'Success', detail:'User updated successfully'});
    });
    this.subscriptions.push(sb);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  getPic() {
    if (!this.user.profile_pic) {
      return 'none';
    }

    return `url('${this.user.profile_pic}')`;
  }

  deletePic() {
    this.user.profile_pic = '';
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
}
