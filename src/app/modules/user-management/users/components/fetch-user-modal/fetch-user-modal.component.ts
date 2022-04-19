import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-fetch-user-modal',
  templateUrl: './fetch-user-modal.component.html',
  styleUrls: ['./fetch-user-modal.component.scss']
})
export class FetchUserModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  @Input() email: string;
  users: UserModel[] = [];
  user: UserModel;
  isLoading = true;
  subscriptions: Subscription[] = [];

  constructor(private commonService: CommonService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    let dataToPost = { email: this.email }
    let loadSub = this.commonService.fetchRow('user/userdetails', dataToPost).subscribe(res => {
      this.user = res;
      this.isLoading = false;
    });
    this.subscriptions.push(loadSub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  close(){
    this.modal.dismiss('');
  }
}
