import { IResponse } from './Utils';

export interface IFaceResponse extends IResponse {
  data: IFace;
}

export interface IFaceArrayResponse extends IResponse {
  data: IFace[];
}

export interface IFaceBasicResponse extends IResponse {
  data: {
    _id: string;
    content: string;
    image: string[];
    isReplyTo: string | null;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
}

export interface IFace {
  _id: string;
  content: string;
  image: string []; 
  isReplyTo: string | null;
  isEdited: boolean;
  createdAt: string;
  user: 
    {
      _id: string;
      username: string;
      name: string;
      avatar: string;
    }
  ;
  liked: boolean;
  likeCount: number;
  replyCount: number;
}
