import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUserWithCounts } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  user: IUserWithCounts | null = null;

  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    const res = await this.usersService.getMe();
    if (res.status === 'success') {
      this.user = res.data;
    }
  }

  gotoFollows(filter: string) {
    this.router.navigate(['/view-follows', this.user?._id], {
      state: { filter, userId: this.user?._id },
    });
  }

  redirectToSettings() {
    this.router.navigate(['/settings'], {
      state: { user: this.user },
    });
  }
}
