import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'All',
  },
  {
    name: 'Games',
    children: [{name: '2D Games'}, {name: '3D Games'}, {name: 'Unity 3D'}],
  },
  {
    name: 'Graphic Design',
    children: [
      {
        name: 'Graphics',
        children: [{name: 'Vector Graphics'}, {name: 'illustrations'}],
      },
    ],
  },
  {
    name: 'Cloud Computing',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Artificial_intelligence',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
];


@Component({
  selector: 'app-portfolio-categories',
  templateUrl: './portfolio-categories.component.html',
  styleUrls: ['./portfolio-categories.component.scss']
})
export class PortfolioCategoriesComponent implements OnInit, OnDestroy{

  @Input('categories') categories: any[] = [];
  @Output() categoryClicked = new EventEmitter<string>();
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  constructor() {
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngOnInit(){

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
