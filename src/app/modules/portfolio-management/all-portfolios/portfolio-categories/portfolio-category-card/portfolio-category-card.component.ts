import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-portfolio-category-card',
  templateUrl: './portfolio-category-card.component.html',
  styleUrls: ['./portfolio-category-card.component.scss']
})
export class PortfolioCategoryCardComponent implements OnInit, OnDestroy{
  @Input('sample') sample;
  @Output() sampleSelected = new EventEmitter<string>();
  @Output() sampleDeselected = new EventEmitter<string>();
  constructor() {
  }

  ngOnInit(){

  }

  ngOnDestroy() {
    
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
