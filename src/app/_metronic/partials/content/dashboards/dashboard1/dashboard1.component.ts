import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {
  constructor(
    private permissionService: NgxPermissionsService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.permissionService.getPermissions(), 'PERM');
  }
}
