import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessageService } from 'primeng-lts/api';
import {Subject, Subscription} from 'rxjs';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { CreatePortfolioModalComponent } from './create-portfolio-modal/create-portfolio-modal.component';
@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.scss'],
  providers: [MessageService],
})
export class AddPortfolioComponent implements OnInit, AfterViewInit, OnDestroy {

  categories: any[] = [];
  subscriptions: Subscription[] = [];
  categorySamples: any[] = [];
  selectedSamples: any[] = [];
  categoriesSubject: Subject<any> = new Subject<any>();

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    // this.createPortfolio()
    this.loadCategories();
  }

  loadCategories() {
   const dSub = this.commonService.getRows('category/gethierarchy').subscribe(res => {
     this.categories = res.items;
     this.loadCategorySamples(this.categories[0]);
     this.categoriesSubject.next({categories: this.categories});
     this.cd.detectChanges();
    });
   this.subscriptions.push(dSub);
  }

  addToSelectedSamples(sample) {
    this.selectedSamples.push(sample);
  }

  removeSelectedSample(sample) {
    this.selectedSamples = this.selectedSamples.filter(thisSample => thisSample._id != sample._id);
  }

  loadCategorySamples(category) {
    console.log('Loading samples for the category ' , category);
    const dSub = this.commonService.getRows(`sample/list?category=${category.name}`).subscribe(res => {
      this.categorySamples = this._appendSelectedState(res.items);
      this.cd.detectChanges();
    });
    this.subscriptions.push(dSub);
  }

  _appendSelectedState(categorySamples) {
    console.log("category samples are ", categorySamples);
    const samplesToReturn = [];
    categorySamples.forEach(thisSample => {
      if (this.selectedSamples.filter(function(e) { return e._id === thisSample._id; }).length > 0) {
        thisSample.isSelected = true;
      }
      samplesToReturn.push(thisSample);
    });
    return samplesToReturn;
  }
  _collectSelectedSampleIds(selectedSamples) {
    const sampleIds = [];
    selectedSamples.forEach(sample => {
      sampleIds.push(sample._id);
    });
    return sampleIds;
  }
  createPortfolio() {
    const modalRef = this.modalService.open(CreatePortfolioModalComponent, { size: 'lg' });
    modalRef.componentInstance.selectedSamples = this._collectSelectedSampleIds(this.selectedSamples);
    modalRef.result.then((result) => {

     }, () => {}).catch(err => {
      console.log(123);
     });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
