import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ISignupResponse, ISigninResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

   baseUrl = 'https://facelineback-production.up.railway.app/auth';
   //baseUrl = 'http://localhost:3000/auth';

  async  signup(user: FormData): Promise<ISignupResponse> {
    return lastValueFrom( this.http.post<ISignupResponse>(`${this.baseUrl}/signup`, user));
  }

  async signin(user: FormData): Promise<ISigninResponse> {
    return lastValueFrom(this.http.post<ISigninResponse>(`${this.baseUrl}/signin`, user));
  }
}
