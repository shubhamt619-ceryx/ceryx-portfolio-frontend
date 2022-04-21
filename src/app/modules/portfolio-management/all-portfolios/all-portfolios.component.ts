import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng-lts/api';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { DeletePortfolioModalComponent } from '../delete-portfolio-modal/delete-portfolio-modal.component';
@Component({
  selector: 'app-all-portfolios',
  templateUrl: './all-portfolios.component.html',
  styleUrls: ['./all-portfolios.component.scss'],
  providers: [MessageService],
})
export class AllPortfoliosComponent implements OnInit, AfterViewInit, OnDestroy {

  portfolios: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    
  }

  loadPortfolios() {
   let dSub = this.commonService.getRows('portfolio/list').subscribe(res => {
      this.portfolios = res.items;
      console.log(res);
      this.cd.detectChanges()
    });
    this.subscriptions.push(dSub);
  }

  deletePortfolio(portfolio) {
    const modalRef = this.modalService.open(DeletePortfolioModalComponent);
    modalRef.componentInstance._id = portfolio._id;
    modalRef.result.then((result) => {
        this.loadPortfolios()
     }, () => {}).catch(err => { 
      console.log(123);
     });
  }

  ngAfterViewInit() {
    this.loadPortfolios();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
