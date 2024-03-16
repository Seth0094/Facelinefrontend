import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GetImageService } from 'src/app/services/get-image.service';
import { FacesService } from 'src/app/services/faces.service';

@Component({
  selector: 'app-modal-create-face',
  templateUrl: './modal-create-face.component.html',
  styleUrls: ['./modal-create-face.component.scss'],
})
export class ModalCreateFaceComponent implements OnInit {
  createFaceForm: FormGroup;

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

  constructor() {
    this.createFaceForm = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.createFaceForm = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  async uploadImage() {
    const res = await this.imageService.takePicture();
    if (res) {
      this.image = res.image;
      this.blob = res.blob;
    }
  }

  async createFace() {
    if (this.createFaceForm.invalid) {
      return;
    }

    this.loading = true;

    const { content } = this.createFaceForm.value;

    let images: string[] = [''];

    try {
      let image: string | undefined = '';

      if (this.image) {
        const loading = await this.loadingCtrl.create({
          spinner: 'crescent',
        });

        await loading.present();
        image = await this.imageService.uploadImage(this.blob, this.image);
        images.push(image);
        await loading.dismiss();
      }

      const face = { content, image };

      const toast = await this.toastCtrl.create({
        message: 'Faces created',
        duration: 2000,
        icon: 'checkmark-circle-outline',
        color: 'success',
        position: 'bottom',
      });

      if (this.faceId) {
        await this.facesService.replyToFace(this.faceId, face);
      } else {
        await this.facesService.createFace(face);
      }

      await toast.present();

      this.loading = false;

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
    this.image = [];
    this.blob = [];
  }
}
