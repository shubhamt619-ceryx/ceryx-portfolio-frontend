import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-ceryx-icon',
  templateUrl: './ceryx-icon.component.html',
  styleUrls: ['./ceryx-icon.component.scss'],
})

export class CeryxIconComponent implements OnInit {
    @Input() icon = 'empty';
    @Input() text = 'empty';
    constructor(
    ) { }

  ngOnInit(): void {
    console.log(this.icon, '222');
  }



}
