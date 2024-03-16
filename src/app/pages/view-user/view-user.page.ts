import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
})
export class ViewUserPage implements OnInit {
  private activedRoute = inject(ActivatedRoute);
  private userService = inject(UsersService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  userId = this.activedRoute.snapshot.paramMap.get('id');
  user: any;

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    const res = await this.userService.getUser(this.userId!);
    this.user = res.data;
  }

  async blockUser() {
    const res = await this.userService.blockUser(this.userId!);
    if (res.status === 'success') {
      if (res.message == 'User blocked') {
        this.user.following = false;
        this.user.blocked = true;
      } else if (res.message == 'User unblocked') {
        this.user.blocked = false;
      }
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Block User',
      message: 'Are you sure you want to block this user? You will no longer see their faces.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.blockUser();
          },
        },
      ],
    });

    await alert.present();
  }

  async followUser() {
    const res = await this.userService.followUser(this.userId!);
    if (res.status === 'success') {
      if (res.message == 'User followed') {
        this.user.following = true;
        this.user.followersCount++;
      } else if (res.message == 'User unfollowed') {
        this.user.following = false;
        this.user.followersCount--;
      }
    }
  }

  gotoFollows(filter: string) {
    this.router.navigate(['/view-follows', this.userId], {
      state: { filter, userId: this.userId },
    });
  }
}
