import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface CategoryNode {
  _id: string;
  name: string;
  children?: CategoryNode[];
  active?: boolean;
}

@Component({
  selector: 'app-portfolio-categories',
  templateUrl: './portfolio-categories.component.html',
  styleUrls: ['./portfolio-categories.component.scss']
})
export class PortfolioCategoriesComponent implements OnInit, OnDestroy{

  @Input('categories') categories: CategoryNode[] = [];
  @Input() categoriesSubject: Subject<any> = new Subject<any>();
  @Output() categoryClicked = new EventEmitter<string>();
  subscriptions: Subscription[] = [];
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  constructor(
  ) {
    this.dataSource.data = this.categories;
  }
  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  ngOnInit(){
    console.log(this.categories, 123);
    const dSub = this.categoriesSubject.subscribe(res => {
      this.categories = res.categories;
      this.dataSource.data = this.categories;
    });
    this.subscriptions.push(dSub);

  }

  ngOnDestroy() {
  }

  emitCategoryClicked(category){
    this.categories.forEach(thisCat => {
      if (thisCat === category) {
        thisCat.active = true;
      } else {
        thisCat.active = false;
      }
    })
    this.categoryClicked.emit(category);
  }


}
