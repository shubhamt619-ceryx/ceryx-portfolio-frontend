import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng-lts/api';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { environment } from 'src/environments/environment';
import { DeleteSampleModalComponent } from '../delete-sample-modal/delete-sample-modal.component';

@Component({
  selector: 'app-all-samples',
  templateUrl: './all-samples.component.html',
  styleUrls: ['./all-samples.component.scss'],
  providers: [MessageService],
})
export class AllSamplesComponent implements OnInit, AfterViewInit, OnDestroy {
  samples: any[] = []
  subscriptions: Subscription[] = []
  isLoading = false
  baseUrl = environment.s3BaseUrl;
  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.loadAllSamples()
  }

  deleteSample(sample) {
    const modalRef = this.modalService.open(DeleteSampleModalComponent);
    modalRef.componentInstance._id = sample._id;
    modalRef.result.then((result) => {

      this.loadAllSamples()
     }, () => {}).catch(err => { 
      console.log(123);
     });
  }

  launchSample(sample){
    let launchUrl =  this.baseUrl + sample.link;
    window.open(launchUrl, '_blank');
  }

  loadAllSamples() {
    this.isLoading = true
    let dSub = this.commonService.getRows('sample/list').subscribe(res => {
      this.samples = []
      res.items.forEach(element => {
        if (element.link != 777) {
          //element.thumbnail = this.baseUrl + element.thumbnail
          this.samples.push(element);
        }
      });
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
