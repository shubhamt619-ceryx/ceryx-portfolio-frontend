import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_ceryx/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { by } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  defaultAuth: any = {
    email: 'amitjain@yopmail.com',
    password: 'amit1234',
  };
  defaultStaffAuth: any = {
    email: 'shubham@yopmail.com',
    password: 'amit1234',
  };
  loginForm: FormGroup;
  hasError:boolean = false;
  returnUrl: string;

  // private fields
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/dashboard';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value).subscribe(response => {
        if (response.success) {
          console.log('Login Success');
          let snackBar = this.snackBar.open("Login Success !", null, {
            duration: 1000,
          });
          snackBar.afterDismissed().subscribe(info => {
            this.router.navigate([this.returnUrl]);
          });
        } else {
          console.log('Login failed');
          this.snackBar.open("Login failed ! Invalid credntials ", null, {
            duration: 1000,
          });
        }
      }, (err) => {
        console.log('Login failed');
          this.snackBar.open("Login failed ! Invalid credntials ", null, {
            duration: 1000,
          });
      });
    this.subscriptions.push(loginSubscr);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}