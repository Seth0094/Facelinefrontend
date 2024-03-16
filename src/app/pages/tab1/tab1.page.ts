import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalCreateFaceComponent } from 'src/app/components/modal-create-face/modal-create-face.component';
import { IFace } from 'src/app/interfaces/Face';
import { FacesService } from 'src/app/services/faces.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  private facesService = inject(FacesService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  segment: string = 'recent';
  faces: IFace[] = [];

  ngOnInit() {
    this.loadFaces();

    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.faces.length === 0) {
        return;
      }

      if (params['filterOut']) {
        this.faces = this.faces.filter(
          (face) => face._id !== params['filterOut']
        );
      }
    });
  }

  async segmentChanged(event: any) {
    this.segment = event.target.value;
    await this.loadFaces();
  }

  async createFace() {
    const modal = await this.modalCtrl.create({
      component: ModalCreateFaceComponent,
      componentProps: {
        faceId: '',
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.loadFaces();
    }
  }

  async redirectToProfile() {
    this.router.navigate(['/my-profile']);
  }

  async loadFaces() {
    if (this.segment === 'recent') {
      const res = await this.facesService.getRecentFaces();
      if (res.status === 'success') {
        this.faces = res.data;
      }
    }

    if (this.segment === 'following') {
      const res = await this.facesService.getFollowingFaces();
      if (res.status === 'success') {
        this.faces = res.data;
      }
    }
  }

  onRefresh(event: any) {
    this.loadFaces();
    event.target.complete();
  }

  async loadMore(event: any) {
    const lastFace = this.faces[this.faces.length - 1];
    const queryParams = {
      date: lastFace.createdAt,
    };

    if (this.segment === 'recent') {
      const res = await this.facesService.getRecentFaces(queryParams);
      this.faces = this.faces.concat(res.data);
    }

    if (this.segment === 'following') {
      const res = await this.facesService.getFollowingFaces(queryParams);
      this.faces = this.faces.concat(res.data);
    }

    event.target.complete();
  }
}
