import { Component, OnInit, inject, Input } from '@angular/core';
import { IFace } from 'src/app/interfaces/Face';
import { FacesService } from 'src/app/services/faces.service';

@Component({
  selector: 'app-user-segments',
  templateUrl: './user-segments.component.html',
  styleUrls: ['./user-segments.component.scss'],
})
export class UserSegmentsComponent implements OnInit {
  private facesService = inject(FacesService);

  @Input() userId: string | null = '';
  segment: string = 'faces';
  faces: IFace[] = [];

  segments: any = [
    {
      name: 'faces',
      function: this.facesService.getFacesFromUser.bind(this.facesService),
    },
    {
      name: 'replies',
      function: this.facesService.getReplyFacesFromUser.bind(this.facesService),
    },
    {
      name: 'likes',
      function: this.facesService.getLikedFacesFromUser.bind(this.facesService),
    },
  ];

  constructor() {}

  ngOnInit() {
    this.loadFaces();
  }

  async segmentChanged(event: any) {
    this.segment = event.target.value;
    await this.loadFaces();
  }

  async loadFaces() {
    const res = await this.segments
      .find((segment: any) => segment.name === this.segment).function(this.userId)

    if (res.status === 'success') {
      this.faces = res.data;
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

    const res = await this.segments
      .find((segment: any) => segment.name === this.segment)
      .function(this.userId, queryParams);

    if (res.status === 'success') {
      this.faces = this.faces.concat(res.data);
    }

    event.target.complete();
  }
}
