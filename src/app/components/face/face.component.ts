import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IFace } from 'src/app/interfaces/Face';
import { FacesService } from 'src/app/services/faces.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController,ModalController, ToastController,} from '@ionic/angular';
import { ModalEditFaceComponent } from '../modal-edit-face/modal-edit-face.component';
import { terminate } from '@angular/fire/firestore';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss'],
})
export class faceComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private faceService = inject(FacesService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  @Output() reloadEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Input() face: IFace = {} as IFace;
  @ViewChild('popover') popover: any;

  loading: boolean = false;
  checkUser: boolean = false;
  authUserId: string | null = '';

  ngOnInit() {
    this.getUserId();
  }

  redirectToFace() {
    this.router.navigate(['/view-face', this.face._id], {
      state: { face: this.face },
    });
  }

  async getUserId() {
    const { value } = await Preferences.get({ key: 'userId' });
    this.checkUser = this.face.user._id == value;
    this.authUserId = value;
  }

  redirectToUser(event: Event) {
    event.stopPropagation();

    if (this.face.user._id === this.authUserId) {
      this.router.navigate(['/my-profile']);
      return;
    }

    this.router.navigate(['/view-user', this.face.user._id]);
  }

  async likeFace(event: Event) {
    event.stopPropagation();
    if (this.loading) return;
    this.loading = true;
    const res = await this.faceService.likeFace(this.face._id!);

    if (res.status === 'success') {
      if (res.message === 'face liked') {
        this.face.likeCount++;
        this.face.liked = true;
      } else if (res.message === 'face unliked') {
        this.face.likeCount--;
        this.face.liked = false;
      }
    }
    this.loading = false;
  }

  showOptions(event: any) {
    event.stopPropagation();

    this.popover.event = event;
    this.popover.present();
  }

  presentAlert() {
    this.alertCtrl
      .create({
        header: 'Delete Faces',
        message: 'Are you sure you want to delete this face?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.popover.dismiss();
            },
          },
          {
            text: 'Delete',
            handler: async () => {
              await this.deleteFace();
              await this.popover.dismiss();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async deleteFace() {
    const toast = await this.toastCtrl.create({
      message: 'Faces deleted',
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      color: 'success',
    });

    try {
      const res = await this.faceService.deleteFace(this.face._id);

      if (res.status === 'success') {
        await toast.present();

        this.reloadEvent.emit();
        this.deleteEvent.emit();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendToReply(event: Event) {
    event.stopPropagation();

    const res = await this.faceService.getFace(this.face.isReplyTo!);

    this.router.navigate(['/view-face', this.face.isReplyTo], {
      state: { face: res.data },
    });
  }

  async openEditModal() {
    const modal = await this.modalCtrl.create({
      component: ModalEditFaceComponent,
      componentProps: {
        face: this.face,
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.popover.dismiss();
      this.reloadEvent.emit();
      this.editEvent.emit();
    }
  }
}
