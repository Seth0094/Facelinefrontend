import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewFacePageRoutingModule } from './view-face-routing.module';

import { ViewFacePage } from './view-face.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewFacePageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ViewFacePage]
})
export class ViewFacePageModule {}
