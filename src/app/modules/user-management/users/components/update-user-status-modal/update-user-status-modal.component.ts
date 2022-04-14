import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-update-user-status-modal',
  templateUrl: './update-user-status-modal.component.html',
  styleUrls: ['./update-user-status-modal.component.scss']
})
export class UpdateUserStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  status = 2;
  users: User[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private userService: UsersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    const sb = this.userService.items$.pipe(
      first()
    ).subscribe((res: User[]) => {
      this.users = res.filter(c => this.ids.indexOf(c._id) > -1);
    });
    this.subscriptions.push(sb);
  }

  updateCustomersStatus() {
    this.isLoading = true;
    const sb = this.userService.updateStatusForItems(this.ids, +this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
