import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, map } from 'rxjs';

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
      .get<{ message: string; posts: any }>(`${env.BASE_URL}/posts`)
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string; title: string; content: string }>(
      `${env.BASE_URL}/posts/${id}`
    );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title, content };
    return this.httpClient.post<{ message: string; postId: string }>(
      `${env.BASE_URL}/posts`,
      post
    );
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    return this.httpClient.put(`${env.BASE_URL}/posts/${id}`, post);
  }

  deletePost(postId: string) {
    this.httpClient.delete(`${env.BASE_URL}/posts/${postId}`).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
