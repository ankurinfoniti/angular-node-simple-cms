import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment as env } from 'src/environments/environment';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private httpClient = inject(HttpClient);

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(`${env.BASE_URL}/posts`)
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'aaaaa', title, content };
    this.httpClient
      .post<{ message: string }>(`${env.BASE_URL}/posts`, post)
      .subscribe((responsDate) => {
        console.log(responsDate);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
