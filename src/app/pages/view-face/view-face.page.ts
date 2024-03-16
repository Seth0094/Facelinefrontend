import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalCreateFaceComponent } from 'src/app/components/modal-create-face/modal-create-face.component';
import { IFace } from 'src/app/interfaces/Face';
import { FacesService } from 'src/app/services/faces.service';

@Component({
  selector: 'app-view-face',
  templateUrl: './view-face.page.html',
  styleUrls: ['./view-face.page.scss'],
})
export class ViewFacePage implements OnInit {
  private faceService = inject(FacesService);
  private modalCtrl = inject(ModalController);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  face: IFace | null = null;
  replies: IFace[] = [];
  faceId: string | null = this.activatedRoute.snapshot.paramMap.get('id');

  ngOnInit() {
    this.loadData();
  }

  async getFace() {
    try {
      const res = await this.faceService.getFace(this.faceId!);
      if (res.status === 'success') {
        this.face = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getReplies() {
    try {
      const res = await this.faceService.getRepliesFromFace(this.faceId!);
      if (res.status === 'success') {
        console.log(res.data)
        this.replies = res.data;
        
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loadData() {
    await this.getReplies();
    await this.getFace();
  }

  onFaceEdit() {
    this.getFace();
  }

  onFaceDelete() {
    this.router.navigate(['/tabs/tab1'], {
      queryParams: { filterOut: this.faceId },
    });
  }

  onRefresh(event: any) {
    this.loadData();
    event.target.complete();
  }

  async reply() {
    const modal = await this.modalCtrl.create({
      component: ModalCreateFaceComponent,
      componentProps: {
        faceId: this.faceId,
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      await this.loadData();
    }
  }
}
