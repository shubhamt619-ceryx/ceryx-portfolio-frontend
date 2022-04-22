import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';


@Component({
  selector: 'app-create-portfolio-modal',
  templateUrl: './create-portfolio-modal.component.html',
  styleUrls: ['./create-portfolio-modal.component.scss']
})
export class CreatePortfolioModalComponent implements OnInit, OnDestroy {
  @Input() selectedSamples: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  messageService: any;
  isPerpetual = false;
  startDate = "" ;
  endDate = "" ;
  name = "" ;

  constructor(private commonService: CommonService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.selectedSamples);
  }

  _formatDate(dateString) {
    let dt = new Date(dateString);
    let year  = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = dt.getDate().toString().padStart(2, "0");
    let dateToReturn = year + '-' + month + '-' + day;
    console.log(dateToReturn);
    return dateToReturn.toString();
  }

  savePortfolio() {
    let portfolioData = {
      "alias": this.name,
      "isPerpetual": this.isPerpetual,
      "startDate": this.isPerpetual ? "N.A." : this._formatDate(this.startDate),
      "endDate": this.isPerpetual ? "N.A." : this._formatDate(this.endDate),
      "samples": this.selectedSamples,
      "createdBy": "624ae77e2001216640db5fb9",
    };
    this.isLoading = true;
    let loadSub = this.commonService.fetchRow('portfolio/create/', portfolioData).subscribe(res => {
      this.isLoading = false;
      // Portfolio create success
      this.modal.close(true)
    }); 
    this.subscriptions.push(loadSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
