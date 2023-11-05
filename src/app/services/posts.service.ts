import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { Comment } from '../interfaces/comment.interface';
import { Observable } from 'rxjs';
import { Constants } from '../utils/constants';
import { ApiEnum } from '../utils/api.enum';
import { Photo } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private httpClient: HttpClient) {}

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(
      `${Constants.baseUrl}${ApiEnum.GET_POSTS}`
    );
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(
      `${Constants.baseUrl}${ApiEnum.GET_USERS}`
    );
  }

  public getComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${Constants.baseUrl}/${'comments'}`);
  }

  public getPostById(id: number): Observable<Post> {
    return this.httpClient.get<Post>(
      `${Constants.baseUrl}${ApiEnum.GET_POSTS}/${id}`
    );
  }

  public getPhotos(params: {
    start: number;
    limit: number;
  }): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>(
      `${Constants.baseUrl}${ApiEnum.GET_PHOTOS}`,
      {
        params,
      }
    );
  }
}
