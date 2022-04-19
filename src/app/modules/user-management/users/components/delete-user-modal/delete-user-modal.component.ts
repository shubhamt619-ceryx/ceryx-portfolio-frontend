import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.scss']
})
export class DeleteUserModalComponent implements OnInit, OnDestroy {
  @Input() _id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private commonService: CommonService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteUser() {
    this.isLoading = true;
    let loadSub = this.commonService.deleteRow('user/delete-user/' + this._id).subscribe(res => {
      this.isLoading = false;
      this.modal.close(true)
    });
    this.subscriptions.push(loadSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
