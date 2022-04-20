import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { MessageService } from 'primeng-lts/api';
@Component({
  selector: 'app-all-samples',
  templateUrl: './all-samples.component.html',
  styleUrls: ['./all-samples.component.scss'],
  providers: [MessageService],
})
export class AllSamplesComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }


  ngOnDestroy() {
  }

}
