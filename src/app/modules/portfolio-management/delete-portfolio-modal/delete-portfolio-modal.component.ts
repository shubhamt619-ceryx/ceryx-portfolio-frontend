import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { CommonService } from 'src/app/_ceryx/services/common.service';


@Component({
  selector: 'app-delete-portfolio-modal',
  templateUrl: './delete-portfolio-modal.component.html',
  styleUrls: ['./delete-portfolio-modal.component.scss']
})
export class DeletePortfolioModalComponent implements OnInit, OnDestroy {
  @Input() _id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  messageService: any;

  constructor(private commonService: CommonService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deletePortfolio() {
    this.isLoading = true;
    let loadSub = this.commonService.deleteRow('protfolio/delete/' + this._id).subscribe(res => {
      this.isLoading = false;
      // User delete success
      this.modal.close(true)
    }); 
    this.subscriptions.push(loadSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
