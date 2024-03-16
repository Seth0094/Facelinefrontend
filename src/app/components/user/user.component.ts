import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUserBasic } from 'src/app/interfaces/Users';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
  private router = inject(Router);

  @Input() user: IUserBasic = {} as IUserBasic;

  ngOnInit() {}

  redirectToUser() {
    this.router.navigate(['/view-user', this.user._id]);
  }

}
