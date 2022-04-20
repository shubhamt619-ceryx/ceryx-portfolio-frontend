import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { MessageService } from 'primeng-lts/api';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
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
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios() {
   let dSub = this.commonService.getRows('category/list').subscribe(res => {
      this.portfolios = res.items;
      this.cd.detectChanges()
    });
    this.subscriptions.push(dSub);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
