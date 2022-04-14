import {
    BehaviorSubject,
    Observable,
    of ,
    Subscription,
    throwError
} from 'rxjs';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import {
    environment
} from 'src/environments/environment';
import {
    UserModel
} from '../models/user.model';
import {
    Router
} from '@angular/router';
import {
    JsonResponseModel
} from '../models/json-response.model';
import { map } from 'rxjs/operators';

const baseUrl = environment.apiUrl;

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})

export class CommonService {

    // private fields
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    private authToken
    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        console.log('111 Common service loaded');
        let authData = this.getAuthFromSessionStorage();
        console.log('111 Authdata is ', authData);
        this.authToken = authData.authToken;
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


    public getRows(url:string): Observable < any > {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
        });
        return this.http.get <JsonResponseModel> (baseUrl + url, {
            headers: httpHeaders,
        }).pipe(
            map((response: JsonResponseModel) => {
                const result = {
                  items: response.data.list,
                  total: response.data.list.length
                };
                return result;
              })
        );
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