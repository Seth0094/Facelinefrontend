import { IResponse } from './Utils';

export interface ISignupResponse extends IResponse {
  data: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    email: string;
    createdAt: string;
  };
}

export interface ISigninResponse extends IResponse {
  data: {
    token: string;
    userId: string;
  };
}
