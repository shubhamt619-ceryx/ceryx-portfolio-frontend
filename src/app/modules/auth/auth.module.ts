import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginModernComponent } from './login-modern/login-modern.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import { MaterialModule } from '../material/material.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    LoginComponent,
    LoginModernComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    NgxPermissionsModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ]
})
export class AuthModule {}
