import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { JsonResponseModel } from '../models/json-response.model';
import { finalize, map } from 'rxjs/operators';


const jwtHelper = new JwtHelperService();


const baseUrl = environment.apiUrl;

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

@Injectable({providedIn: 'root'})

export class AuthService {

    // private fields
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }


    constructor(
        private http: HttpClient,
        private router: Router,
        ) {
            this.isLoadingSubject = new BehaviorSubject<boolean>(false);
            this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
            this.currentUser$ = this.currentUserSubject.asObservable();
            this.isLoading$ = this.isLoadingSubject.asObservable();
            const subscr = this.getUserByToken().subscribe()
            this.subscriptions.push(subscr);
         }
    

    login(email: String, password: String): Observable<any> {
      this.isLoadingSubject.next(true);
        let loginAttempt = this.http.post(baseUrl + 'user/login', { email: email, password: password }, httpOptions);
        loginAttempt.subscribe((res: any) => {
          this.isLoadingSubject.next(false);
          if (res.success) {
            console.log('LOGIN WORKED');
            this.setAuthInSessionStorage(res.data.token)
          } else {
            console.log('LOGIN DID NOT WORKED');
          }
        })
        return loginAttempt
      }

      logout() {
        sessionStorage.removeItem(this.authLocalStorageToken);
        this.router.navigate(['/auth/login'], {
          queryParams: {},
        });
      }

  // private methods
  private setAuthInSessionStorage(authToken) {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    const expirationDate = jwtHelper.getTokenExpirationDate(authToken);
    const isExpired = jwtHelper.isTokenExpired(authToken);
    let decodedToken = jwtHelper.decodeToken(authToken)
    decodedToken.authToken = authToken
    this.currentUserSubject = new BehaviorSubject<UserModel>(decodedToken);
    sessionStorage.setItem(this.authLocalStorageToken, JSON.stringify(decodedToken));
    console.log('Setting Token in local storage');
  }

  private getAuthFromSessionStorage() {
    try {
      const authData = JSON.parse(
        sessionStorage.getItem(this.authLocalStorageToken)
      );
      
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromSessionStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.getUserByTokenHttp(auth.authToken).pipe(
      map((user: any) => {
        console.log(user , 'sersssssssssss');
        
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user.data);
        } else {
          this.logout();
        }
        return user.data;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  

      private  getUserByTokenHttp(authToken): Observable<any> {
        const httpHeaders = new HttpHeaders({
          'Content-Type':  'application/json', 
          'Authorization': `Bearer ${authToken}`,
         });
         
        let user = new UserModel();
        return this.http.get<JsonResponseModel>(baseUrl + 'user/profile', {
          headers: httpHeaders,
         });
         //.subscribe(res => {
          // if (res.success) {
          //     user.setUser(res.data);
          //     console.log('In success condition', user);
          //     return of(user)
          // } else {
          //   console.log('In fail condition', res);
          //     return of(undefined)
          // }
         //})
      }

 
      private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }

  }