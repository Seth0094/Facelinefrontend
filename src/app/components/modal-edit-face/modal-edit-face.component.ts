import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { IFace } from 'src/app/interfaces/Face';
import { GetImageService } from 'src/app/services/get-image.service';
import { FacesService } from 'src/app/services/faces.service';

@Component({
  selector: 'app-modal-edit-face',
  templateUrl: './modal-edit-face.component.html',
  styleUrls: ['./modal-edit-face.component.scss'],
})
export class ModalEditFaceComponent implements OnInit {
  createFaceForm: FormGroup = new FormGroup({});
  @Input() face: IFace = {} as IFace;

  private imageService = inject(GetImageService);
  private facesService = inject(FacesService);
  private modalCtrl = inject(ModalController);
  private formBuilder = inject(FormBuilder);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  faceId: string = '';
  image: any = null;
  blob: any = null;
  content: any;
  loading: boolean = false;
  validateIMG: boolean = false;
  firebaseImage: any = null;

  ngOnInit() {
    this.image = this.face.image;
    this.createFaceForm = this.formBuilder.group({
      content: [this.face.content, [Validators.required]],
    });
  }

  async uploadImage() {
    const res = await this.imageService.takePicture();
    this.validateIMG = true;
    if (res) {
      this.image = res.image.dataUrl;
      this.firebaseImage = res.image;
      this.blob = res.blob;
    }
  }

  async editFace() {
    if (this.createFaceForm.invalid) {
      return;
    }

    this.loading = true;

    const { content } = this.createFaceForm.value;

    let image = '';

    try {
      if (this.image && this.validateIMG == true) {
        const loading = await this.loadingCtrl.create({
          spinner: 'crescent',
        });

        await loading.present();
        image = await this.imageService.uploadImage(
          this.blob,
          this.firebaseImage
        );
        await loading.dismiss();
      } else {
        image = this.image;
      }

      const face = { content, image };

      const toast = await this.toastCtrl.create({
        message: 'Faces edited',
        duration: 2000,
        icon: 'checkmark-circle-outline',
        color: 'success',
        position: 'bottom',
      });

      await this.facesService.updateFace(this.face._id, face);

      await toast.present();

      return this.modalCtrl.dismiss(true);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  dismissModal() {
    return this.modalCtrl.dismiss(true);
  }

  removeImage() {
    this.image = '';
    this.firebaseImage = null;
    this.blob = null;
  }
}
