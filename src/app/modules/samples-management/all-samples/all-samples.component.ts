import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
  samples: any[] = [];
  filteredSamples: any[] = [];
  categories: any[] = [];
  subscriptions: Subscription[] = [];
  isLoading = false;
  baseUrl = environment.s3BaseUrl;
  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllSamples();
  }

  deleteSample(sample) {
    const modalRef = this.modalService.open(DeleteSampleModalComponent);
    modalRef.componentInstance._id = sample._id;
    modalRef.result.then((result) => {
      this.loadAllSamples();
     }, () => {}).catch(err => {
       console.log(123);
     });
  }

  launchSample(sample){
    const launchUrl =  this.baseUrl + sample._id + '/' + sample.link;
    window.open(launchUrl, '_blank');
  }

  editSample(sample){
    this.router.navigate(['/samples-management/edit-sample/' + sample._id]).then(() => {});
  }

  filterSamplesCategory(categoryIdIndex) {
    this.filteredSamples = [];
    if (categoryIdIndex === 0) {
      this.filteredSamples = this.samples;
    } else {
      const categoryId = this.categories[categoryIdIndex - 1]._id;
      this.filteredSamples = this.samples.filter(sample => sample.category === categoryId);
    }
    this.cd.detectChanges();
  }

  loadCategories() {
    const dSub = this.commonService.getRows('category/list').subscribe(res => {
       this.categories = res.items;
       this.cd.detectChanges();
     });
    this.subscriptions.push(dSub);
   }
  tabClick(tab) {
    if (tab.index === 0) {
      this.filterSamplesCategory(0);
    } else {
      this.filterSamplesCategory(tab.index);
    }
  }
  loadAllSamples() {
    this.isLoading = true
    const dSub = this.commonService.getRows('sample/list').subscribe(res => {
      this.samples = [];
      res.items.forEach(element => {
        if (element.link !== '777') {
          element.thumbnail = element.thumbnail.replace(`${element._id}/${element._id}/`, `${element._id}/`);
          this.samples.push(element);
        }
      });
      this.filteredSamples = this.samples;
      this.isLoading = false;
      this.cd.detectChanges();
    });
    this.subscriptions.push(dSub);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
  }
}
