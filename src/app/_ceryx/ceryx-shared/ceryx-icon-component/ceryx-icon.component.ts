import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-ceryx-icon',
  templateUrl: './ceryx-icon.component.html',
  styleUrls: ['./ceryx-icon.component.scss'],
})

export class CeryxIconComponent implements OnInit {
    @Input('icon') icon: string = "empty";
    @Input('text') text: string = "empty";
    constructor(
    ) { }

  ngOnInit(): void {
    console.log(this.icon, '222');
  }

 

}
