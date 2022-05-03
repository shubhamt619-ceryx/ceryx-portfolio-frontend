import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng-lts/api';
import { of, Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';


@Component({
  selector: 'app-create-portfolio-modal',
  templateUrl: './create-portfolio-modal.component.html',
  styleUrls: ['./create-portfolio-modal.component.scss'],
  providers: [MessageService]
})
export class CreatePortfolioModalComponent implements OnInit, OnDestroy {
  @Input() selectedSamples: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  isPerpetual = false;
  isPasswordProtected = false;
  startDate = "";
  endDate = "";
  name = "";
  username = "";
  password = "";

  constructor(private commonService: CommonService, public modal: NgbActiveModal, private messageService: MessageService) { }

  ngOnInit(): void {
    console.log(this.selectedSamples);
  }

  _formatDate(dateString) {
    let dt = new Date(dateString);
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = dt.getDate().toString().padStart(2, "0");
    let dateToReturn = year + '-' + month + '-' + day;
    console.log(dateToReturn);
    return dateToReturn.toString();
  }

  validateForm() {
    if (this.isPasswordProtected || !this.isPerpetual) {
        if (this.isPasswordProtected) {
          console.log('in if password protected');
          if(this.username.trim() == "" || this.password.trim() == ""){
            this.messageService.add({severity:'error', summary: 'Invalid', detail: 'Username and password are required.'});
            return;
            }
        }
        if (!this.isPerpetual) {
          console.log('in !isPerpetual');
          if(this.startDate.toString().trim() == "" || this.endDate.toString().trim() == ""){
            this.messageService.add({severity:'error', summary: 'Invalid', detail: 'Startdate and end date required.'});
            return;
            }
        }
        this.savePortfolio();
   } else {
    console.log('in outer else');
     this.savePortfolio();
   }
  }

  savePortfolio() {
    // validation
    let portfolioData = {
      "alias": this.name,
      "isPerpetual": this.isPerpetual,
      "isPasswordProtected": this.isPasswordProtected,
      "username": this.username,
      "password": this.password,
      "startDate": this.isPerpetual ? "N.A." : this._formatDate(this.startDate),
      "endDate": this.isPerpetual ? "N.A." : this._formatDate(this.endDate),
      "samples": this.selectedSamples,
      "createdBy": "624ae77e2001216640db5fb9",
    };
    this.isLoading = true;
    let loadSub = this.commonService.fetchRow('portfolio/create/', portfolioData).subscribe(res => {
      this.isLoading = false;
      // Portfolio create success
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Portfolio saved successfully.'});
      this.modal.close(true)
    });
    this.subscriptions.push(loadSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
