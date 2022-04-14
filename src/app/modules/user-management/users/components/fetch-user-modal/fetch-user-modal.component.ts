import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-fetch-user-modal',
  templateUrl: './fetch-user-modal.component.html',
  styleUrls: ['./fetch-user-modal.component.scss']
})
export class FetchUserModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  users: User[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const sb = this.usersService.items$.pipe(
      first()
    ).subscribe((res: User[]) => {
      this.users = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  fetchSelected() {
    this.isLoading = true;
    // just imitation, call server for fetching data
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
