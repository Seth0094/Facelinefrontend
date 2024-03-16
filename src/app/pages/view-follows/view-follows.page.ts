import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-view-follows',
  templateUrl: './view-follows.page.html',
  styleUrls: ['./view-follows.page.scss'],
})
export class ViewFollowsPage implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  constructor() {}
  filter: string = this.router.getCurrentNavigation()!.extras.state!['filter'];
  userId: string = this.router.getCurrentNavigation()!.extras.state!['userId'];
  users: any[] = [];
  ngOnInit() {
    this.chargeData();
  }
  async getFollowers(queryParams?: any) {
    const res = await this.usersService.getFollowersFromUser(
      this.userId,
      queryParams
    );
    if (res.status === 'success') {
      return res.data;
    }

    return [];
  }
  async getFollowing(queryParams?: any) {
    const res = await this.usersService.getFollowingFromUser(
      this.userId,
      queryParams
    );
    if (res.status === 'success') {
      return res.data;
    }
    return [];
  }

  async chargeData() {
    if (this.filter == 'followers') {
      this.users = await this.getFollowers();
    }
    if (this.filter == 'following') {
      this.users = await this.getFollowing();
    }
  }

  onRefresh(event: any) {
    this.chargeData();
    event.target.complete();
  }

  loadMore(event: any) {
    this.loadMoreUsers();
    event.target.complete();
  }

  async loadMoreUsers() {
    const lastUser = this.users[this.users.length - 1];
    const queryParams = { date: lastUser.createdAt };

    let newUsers;

    if (this.filter === 'followers') {
      newUsers = await this.getFollowers(queryParams);
    }

    if (this.filter === 'following') {
      newUsers = await this.getFollowing(queryParams);
    }

    this.users = this.users.concat(newUsers);
  }
}
