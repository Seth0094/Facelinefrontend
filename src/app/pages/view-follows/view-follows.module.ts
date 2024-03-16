import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewFollowsPageRoutingModule } from './view-follows-routing.module';

import { ViewFollowsPage } from './view-follows.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewFollowsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ViewFollowsPage]
})
export class ViewFollowsPageModule {}
