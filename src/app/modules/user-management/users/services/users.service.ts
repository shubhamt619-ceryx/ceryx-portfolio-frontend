import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../../_metronic/shared/crud-table';
import { environment } from '../../../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<User> implements OnDestroy {
  API_URL = `${environment.apiUrl}users`;
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
