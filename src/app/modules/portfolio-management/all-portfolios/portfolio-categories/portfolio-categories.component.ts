import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-portfolio-categories',
  templateUrl: './portfolio-categories.component.html',
  styleUrls: ['./portfolio-categories.component.scss']
})
export class PortfolioCategoriesComponent implements OnInit, OnDestroy{
  @Input('categories') categories: any[] = [];
  @Output() categoryClicked = new EventEmitter<string>();
  constructor() {
  }

  ngOnInit(){

  }

  ngOnDestroy() {
    
  }

  emitCategoryClicked(category){
    this.categories.forEach(thisCat => {
      if (thisCat == category) {
        thisCat.active = true;
      } else {
        thisCat.active = false;
      }
    })
    this.categoryClicked.emit(category);
  }


}
