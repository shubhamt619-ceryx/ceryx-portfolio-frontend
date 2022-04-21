import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-portfolio-category-card',
  templateUrl: './portfolio-category-card.component.html',
  styleUrls: ['./portfolio-category-card.component.scss']
})
export class PortfolioCategoryCardComponent implements OnInit, OnDestroy{
  @Input('sample') sample;
  baseUrl = environment.s3BaseUrl;
  @Output() sampleSelected = new EventEmitter<string>();
  @Output() sampleDeselected = new EventEmitter<string>();
  constructor() {
  }

  ngOnInit(){

  }

  ngOnDestroy() {
    
  }
  launchSample(sample){
    let launchUrl =  this.baseUrl + sample.link;
    window.open(launchUrl, '_blank');
  }
  
  emitSampleSelected(){
    this.sample.isSelected = !this.sample.isSelected;
    if (this.sample.isSelected) {
      this.sampleSelected.emit(this.sample);
    } else {
      this.sampleDeselected.emit(this.sample);
    }
  }
}
