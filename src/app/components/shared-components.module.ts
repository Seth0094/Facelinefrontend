import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { faceComponent } from './face/face.component';
import { UserComponent } from './user/user.component';
import { ModalCreateFaceComponent } from './modal-create-face/modal-create-face.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSegmentsComponent } from './user-segments/user-segments.component';
import { ModalEditFaceComponent } from './modal-edit-face/modal-edit-face.component';

@NgModule({
  declarations: [
    faceComponent,
    UserComponent,
    ModalCreateFaceComponent,
    UserSegmentsComponent,
    ModalEditFaceComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    faceComponent,
    UserComponent,
    ModalCreateFaceComponent,
    UserSegmentsComponent,
    ModalEditFaceComponent,
  ],
})
export class SharedComponentsModule {}
