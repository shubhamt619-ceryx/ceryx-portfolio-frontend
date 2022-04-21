import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { MessageService } from 'primeng-lts/api';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
@Component({
  selector: 'app-all-samples',
  templateUrl: './all-samples.component.html',
  styleUrls: ['./all-samples.component.scss'],
  providers: [MessageService],
})
export class AllSamplesComponent implements OnInit, AfterViewInit, OnDestroy {
  samples: [] = []
  subscriptions: Subscription[] = []
  isLoading = false
  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.loadAllSamples()
  }

  loadAllSamples() {
    this.isLoading = true
    let dSub = this.commonService.getRows('sample/list').subscribe(res => {
      this.samples = res.items;
      this.isLoading = false
      this.cd.detectChanges()
    });
    this.subscriptions.push(dSub);
  }

  ngAfterViewInit() {

  }


  ngOnDestroy() {
  }

}
