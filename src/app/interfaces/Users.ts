import { IResponse } from "./Utils";

export interface IUserBasic {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface IUserWithCounts extends IUserBasic {
  createdAt: string;
  followersCount: number;
  followingCount: number;
}

export interface IUserProfile extends IUserWithCounts {
  following: boolean;
  blocked: boolean;
  hasMeBlocked: boolean;
}

export interface IUserListResponse extends IResponse {
  data: IUserBasic[];
}

export interface IUserWithCountsResponse extends IResponse {
  data: IUserWithCounts;
}

export interface IUserSearchResponse extends IResponse {
  data: IUserWithCounts[];
}

export interface IUserResponse extends IResponse {
  data: IUserProfile;
}