import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng-lts/api';
import { Table } from 'primeng-lts/table';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { environment } from 'src/environments/environment';
import { DeletePortfolioModalComponent } from '../delete-portfolio-modal/delete-portfolio-modal.component';
import {Clipboard} from '@angular/cdk/clipboard';
@Component({
  selector: 'app-all-portfolios',
  templateUrl: './all-portfolios.component.html',
  styleUrls: ['./all-portfolios.component.scss'],
  providers: [MessageService],
})
export class AllPortfoliosComponent implements OnInit, AfterViewInit, OnDestroy {

  portfolios: any[] = [];
  subscriptions: Subscription[] = [];
  baseUrl = environment.s3BaseUrl;
  viewerUrl = environment.viewerUrl;
  loading = false;

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private clipboard: Clipboard,
    ) { }

  ngOnInit(): void {
  }

  copyPortfolioLink(portfolio) {
    this.clipboard.copy(this.viewerUrl + portfolio.link);
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Link copied', detail: 'Link was copied successfully', life: 1000 });
  }

  loadPortfolios() {
  this.loading = true;
  const dSub = this.commonService.getRows('portfolio/list').subscribe(res => {
      this.portfolios = res.items;
      this.loading = false;
      this.cd.detectChanges();
  });
  this.subscriptions.push(dSub);
  }

  viewPortfolio(portfolio){
    const launchUrl =  this.viewerUrl + portfolio.link;
    window.open(launchUrl, '_blank');
  }

  deletePortfolio(portfolio) {
    const modalRef = this.modalService.open(DeletePortfolioModalComponent);
    modalRef.componentInstance._id = portfolio.link;
    modalRef.result.then(() => {
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Portfolio was deleted successfully', life: 1000 });
        this.loadPortfolios();
     }, () => {}).catch(err => {
      console.log(123);
     });
  }

  clear(table: Table) {
    table.clear();
  }
  ngAfterViewInit() {
    this.loadPortfolios();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
