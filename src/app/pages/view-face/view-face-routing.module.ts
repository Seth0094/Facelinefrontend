import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewFacePage } from './view-face.page';

const routes: Routes = [
  {
    path: '',
    component: ViewFacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewFacePageRoutingModule {}
