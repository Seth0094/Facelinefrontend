import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  IFaceResponse,
  IFaceArrayResponse,
  IFaceBasicResponse,
  IResponse,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FacesService {
  http = inject(HttpClient);
   baseUrl = 'https://facelineback-production.up.railway.app/face';
   //baseUrl = 'http://localhost:3000/face';

  async getFace(faceId: string): Promise<IFaceResponse> {
    return lastValueFrom(
      this.http.get<IFaceResponse>(`${this.baseUrl}/${faceId}`)
    );
  }

  async createFace(face: object): Promise<IFaceBasicResponse> {
    return lastValueFrom(
      this.http.post<IFaceBasicResponse>(`${this.baseUrl}`, face)
    );
  }

  async updateFace(
    faceId: string,
    face: object,
  ): Promise<IFaceBasicResponse> {
    return lastValueFrom(
      this.http.put<IFaceBasicResponse>(`${this.baseUrl}/${faceId}`, face)
    );
  }

  async deleteFace(faceId: string): Promise<IFaceBasicResponse> {
    return lastValueFrom(
      this.http.delete<IFaceBasicResponse>(`${this.baseUrl}/${faceId}`)
    );
  }

  async replyToFace(
    faceId: string,
    face: object
  ): Promise<IFaceBasicResponse> {
    return lastValueFrom(
      this.http.post<IFaceBasicResponse>(
        `${this.baseUrl}/${faceId}/reply`,
        face
      )
    );
  }

  async likeFace(faceId: string): Promise<IResponse> {
    return lastValueFrom(
      this.http.post<IResponse>(`${this.baseUrl}/${faceId}/like`, {})
    );
  }

  async getRepliesFromFace(
    faceId: string,
    queryParams?: any
  ): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(`${this.baseUrl}/${faceId}/replies`, {
        params,
      })
    );
  }

  async getRecentFaces(queryParams?: any): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(`${this.baseUrl}/recent`, {
        params,
      })
    );
  }

  async getFollowingFaces(queryParams?: any): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(`${this.baseUrl}/following`, {
        params,
      })
    );
  }

  async getFacesFromUser(
    userId: string,
    queryParams?: any
  ): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(`${this.baseUrl}/user/${userId}`, {
        params,
      })
    );
  }

  async getReplyFacesFromUser(
    userId: string,
    queryParams?: any
  ): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(
        `${this.baseUrl}/user/${userId}/replies`,
        { params }
      )
    );
  }

  async getLikedFacesFromUser(
    userId: string,
    queryParams?: any
  ): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(
        `${this.baseUrl}/user/${userId}/liked`,
        { params }
      )
    );
  }

  async searchFaces(queryParams?: any): Promise<IFaceArrayResponse> {
    const params = this.constructQueryParams(queryParams);
    return lastValueFrom(
      this.http.get<IFaceArrayResponse>(`${this.baseUrl}/search`, {
        params,
      })
    );
  }

  constructQueryParams = (queryParams: any): HttpParams => {
    let params = new HttpParams();

    if (queryParams && typeof queryParams === 'object') {
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.set(key, queryParams[key]);
        }
      }
    }

    return params;
  };

  getMethod(method: string) {
    switch (method) {
      case 'getRecentFaces':
        return this.getRecentFaces;
      case 'getFollowingFaces':
        return this.getFollowingFaces;
      case 'getFacesFromUser':
        return this.getFacesFromUser;
      case 'getReplyFacesFromUser':
        return this.getReplyFacesFromUser;
      case 'getLikedFacesFromUser':
        return this.getLikedFacesFromUser;
      case 'getRepliesFromFace':
        return this.getRepliesFromFace;
      case 'searchFaces':
        return this.searchFaces;
      default:
        return this.getRecentFaces;
    }
  }
}
