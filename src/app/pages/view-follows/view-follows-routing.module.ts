import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewFollowsPage } from './view-follows.page';

const routes: Routes = [
  {
    path: '',
    component: ViewFollowsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewFollowsPageRoutingModule {}
