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
    fetch(): any {
      throw new Error('Method not implemented.');
    }

    // private fields
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    private authToken
    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        let authData = this.getAuthFromSessionStorage();
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

    public fetchRow(url:string, data:{}): Observable < any > {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
        });
        return this.http.post<JsonResponseModel> (baseUrl + url, JSON.stringify(data), {
            headers: httpHeaders,
        }).pipe(
            map((response: JsonResponseModel) => {
                return response.data;
              })
        );
    }

    public patchRow(url:string, data:{}): Observable < any > {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
        });
        return this.http.patch<JsonResponseModel> (baseUrl + url, JSON.stringify(data), {
            headers: httpHeaders,
        }).pipe(
            map((response: JsonResponseModel) => {
                return response.data;
              })
        );
    }

    public putRow(url:string, data:{}): Observable < any > {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
        });
        return this.http.put<JsonResponseModel> (url, data, {
            headers: httpHeaders,
        }).pipe(
            map((response: JsonResponseModel) => {
                return response.data;
              })
        );
    }

    public deleteRow(url:string): Observable < any > {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
        });
        return this.http.delete<JsonResponseModel> (baseUrl + url, {
            headers: httpHeaders,
        }).pipe(
            map((response: JsonResponseModel) => {
                return response.data;
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