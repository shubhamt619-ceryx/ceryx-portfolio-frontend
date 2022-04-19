import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/_ceryx/models/user.model';
import { AuthService } from 'src/app/_ceryx/services/auth.service';


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  user$: Observable<UserModel>;
  files: File[] = [];
  constructor(public userService: AuthService) {
    this.user$ = this.userService.currentUserSubject.asObservable();
    //console.log(this.user$, 'user$');
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
